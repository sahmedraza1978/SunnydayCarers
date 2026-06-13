import pool from '../database/init';

export interface DashboardMetrics {
  totalParticipants: number;
  totalOnboarded: number;
  onboardingInProgress: number;
  pendingAgreements: number;
  completedAgreements: number;
  serviceTypeBreakdown: {
    [key: string]: number;
  };
  planManagementBreakdown: {
    coordinator: number;
    planner: number;
    unassigned: number;
  };
  recentParticipants: Array<{
    id: string;
    fullName: string;
    email: string;
    createdAt: string;
    onboardingStatus: string;
  }>;
  recentAgreements: Array<{
    id: string;
    participantName: string;
    createdAt: string;
    agreementStartDate: string;
  }>;
  onboardingByWeek: Array<{
    week: string;
    count: number;
  }>;
  agreementsByMonth: Array<{
    month: string;
    count: number;
  }>;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    // Total participants
    const totalParticipantsResult = await pool.query(
      'SELECT COUNT(*) as count FROM participants'
    );
    const totalParticipants = parseInt(
      totalParticipantsResult.rows[0].count,
      10
    );

    // Onboarding stats
    const onboardingStats = await pool.query(`
      SELECT 
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as onboarded,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress
      FROM (
        SELECT DISTINCT ON (participant_id) participant_id, status
        FROM onboarding_records
        ORDER BY participant_id, created_at DESC
      ) latest_onboarding
    `);

    const totalOnboarded = parseInt(
      onboardingStats.rows[0].onboarded || 0,
      10
    );
    const onboardingInProgress = parseInt(
      onboardingStats.rows[0].in_progress || 0,
      10
    );

    // Agreement stats
    const agreementStats = await pool.query(`
      SELECT 
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
      FROM service_agreements
    `);

    const pendingAgreements = parseInt(
      agreementStats.rows[0].pending || 0,
      10
    );
    const completedAgreements = parseInt(
      agreementStats.rows[0].completed || 0,
      10
    );

    // Service type breakdown
    const serviceTypeResult = await pool.query(`
      SELECT service_type, COUNT(*) as count
      FROM (
        SELECT DISTINCT ON (participant_id) participant_id, service_type
        FROM onboarding_records
        WHERE service_type IS NOT NULL
        ORDER BY participant_id, created_at DESC
      ) latest_services
      GROUP BY service_type
      ORDER BY count DESC
    `);

    const serviceTypeBreakdown: { [key: string]: number } = {};
    serviceTypeResult.rows.forEach((row) => {
      const serviceType = row.service_type || 'Unassigned';
      const displayName = {
        sil_group_home: 'SIL - Group Home',
        sil_and_cp: 'SIL + CP',
        in_home_support: 'In-Home Care',
        day_program: 'Day Program',
        Unassigned: 'Unassigned',
      }[serviceType] || serviceType;
      serviceTypeBreakdown[displayName] = parseInt(row.count, 10);
    });

    // Plan management breakdown
    const planManagementResult = await pool.query(`
      SELECT plan_management, COUNT(*) as count
      FROM (
        SELECT DISTINCT ON (participant_id) participant_id, plan_management
        FROM onboarding_records
        WHERE plan_management IS NOT NULL
        ORDER BY participant_id, created_at DESC
      ) latest_plans
      GROUP BY plan_management
    `);

    const planManagementBreakdown = {
      coordinator: 0,
      planner: 0,
      unassigned: 0,
    };

    planManagementResult.rows.forEach((row) => {
      if (row.plan_management === 'coordinator') {
        planManagementBreakdown.coordinator = parseInt(row.count, 10);
      } else if (row.plan_management === 'planner') {
        planManagementBreakdown.planner = parseInt(row.count, 10);
      }
    });

    planManagementBreakdown.unassigned =
      totalParticipants - planManagementBreakdown.coordinator - planManagementBreakdown.planner;

    // Recent participants (last 5)
    const recentParticipantsResult = await pool.query(`
      SELECT 
        p.id, 
        p.full_name as "fullName", 
        p.email, 
        p.created_at as "createdAt",
        COALESCE(o.status, 'pending') as "onboardingStatus"
      FROM participants p
      LEFT JOIN LATERAL (
        SELECT status FROM onboarding_records 
        WHERE participant_id = p.id 
        ORDER BY created_at DESC 
        LIMIT 1
      ) o ON true
      ORDER BY p.created_at DESC
      LIMIT 5
    `);

    const recentParticipants = recentParticipantsResult.rows.map((row) => ({
      id: row.id,
      fullName: row.fullName,
      email: row.email,
      createdAt: new Date(row.createdAt).toLocaleDateString('en-AU'),
      onboardingStatus: row.onboardingStatus,
    }));

    // Recent agreements (last 5)
    const recentAgreementsResult = await pool.query(`
      SELECT 
        a.id,
        p.full_name as "participantName",
        a.created_at as "createdAt",
        a.agreement_start_date as "agreementStartDate"
      FROM service_agreements a
      JOIN participants p ON a.participant_id = p.id
      ORDER BY a.created_at DESC
      LIMIT 5
    `);

    const recentAgreements = recentAgreementsResult.rows.map((row) => ({
      id: row.id,
      participantName: row.participantName,
      createdAt: new Date(row.createdAt).toLocaleDateString('en-AU'),
      agreementStartDate: row.agreementStartDate
        ? new Date(row.agreementStartDate).toLocaleDateString('en-AU')
        : 'N/A',
    }));

    // Onboarding by week (last 8 weeks)
    const onboardingByWeekResult = await pool.query(`
      SELECT 
        DATE_TRUNC('week', created_at)::date as week,
        COUNT(DISTINCT participant_id) as count
      FROM onboarding_records
      WHERE status = 'completed'
        AND created_at >= NOW() - INTERVAL '8 weeks'
      GROUP BY DATE_TRUNC('week', created_at)
      ORDER BY week DESC
      LIMIT 8
    `);

    const onboardingByWeek = onboardingByWeekResult.rows
      .reverse()
      .map((row) => ({
        week: new Date(row.week).toLocaleDateString('en-AU', {
          month: 'short',
          day: 'numeric',
        }),
        count: parseInt(row.count, 10),
      }));

    // Agreements by month (last 6 months)
    const agreementsByMonthResult = await pool.query(`
      SELECT 
        DATE_TRUNC('month', created_at)::date as month,
        COUNT(*) as count
      FROM service_agreements
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
      LIMIT 6
    `);

    const agreementsByMonth = agreementsByMonthResult.rows
      .reverse()
      .map((row) => ({
        month: new Date(row.month).toLocaleDateString('en-AU', {
          month: 'short',
          year: '2-digit',
        }),
        count: parseInt(row.count, 10),
      }));

    return {
      totalParticipants,
      totalOnboarded,
      onboardingInProgress,
      pendingAgreements,
      completedAgreements,
      serviceTypeBreakdown,
      planManagementBreakdown,
      recentParticipants,
      recentAgreements,
      onboardingByWeek,
      agreementsByMonth,
    };
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    throw error;
  }
}
