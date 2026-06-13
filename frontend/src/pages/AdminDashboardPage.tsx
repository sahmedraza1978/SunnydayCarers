import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Pie, Doughnut } from 'react-chartjs-2';
import { api } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardMetrics {
  totalParticipants: number;
  totalOnboarded: number;
  onboardingInProgress: number;
  pendingAgreements: number;
  completedAgreements: number;
  serviceTypeBreakdown: { [key: string]: number };
  planManagementBreakdown: { coordinator: number; planner: number; unassigned: number };
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
  onboardingByWeek: Array<{ week: string; count: number }>;
  agreementsByMonth: Array<{ month: string; count: number }>;
}

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/metrics');
      setMetrics(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch dashboard metrics:', err);
      setError('Failed to load dashboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error || 'Failed to load dashboard'}</p>
          <button
            onClick={fetchMetrics}
            className="mt-2 text-red-600 hover:text-red-800 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const onboardingCompletionRate =
    metrics.totalParticipants > 0
      ? Math.round((metrics.totalOnboarded / metrics.totalParticipants) * 100)
      : 0;

  const agreementCompletionRate =
    metrics.totalParticipants > 0
      ? Math.round(
          (metrics.completedAgreements /
            (metrics.completedAgreements + metrics.pendingAgreements || 1)) *
            100
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">System overview and analytics</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Participants */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Participants</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">
                  {metrics.totalParticipants}
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Onboarding Completion */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Onboarding Completion</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{onboardingCompletionRate}%</p>
                <p className="text-sm text-gray-500 mt-1">
                  {metrics.totalOnboarded} of {metrics.totalParticipants} completed
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Pending Agreements */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Agreements</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">
                  {metrics.pendingAgreements}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {agreementCompletionRate}% completion rate
                </p>
              </div>
              <div className="bg-yellow-100 rounded-full p-4">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* In-Progress Onboarding */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">In-Progress Onboarding</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">
                  {metrics.onboardingInProgress}
                </p>
              </div>
              <div className="bg-purple-100 rounded-full p-4">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Completed Agreements */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed Agreements</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">
                  {metrics.completedAgreements}
                </p>
              </div>
              <div className="bg-indigo-100 rounded-full p-4">
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Coordinator Managed */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Coordinator Managed</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">
                  {metrics.planManagementBreakdown.coordinator}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {metrics.planManagementBreakdown.planner} Planner managed
                </p>
              </div>
              <div className="bg-cyan-100 rounded-full p-4">
                <svg
                  className="w-8 h-8 text-cyan-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.657"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Service Type Breakdown */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Service Type Breakdown</h2>
            <div className="relative h-64">
              <Pie
                data={{
                  labels: Object.keys(metrics.serviceTypeBreakdown),
                  datasets: [
                    {
                      data: Object.values(metrics.serviceTypeBreakdown),
                      backgroundColor: [
                        '#3B82F6',
                        '#10B981',
                        '#F59E0B',
                        '#EF4444',
                        '#8B5CF6',
                      ],
                      borderColor: '#FFFFFF',
                      borderWidth: 2,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Plan Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Plan Management</h2>
            <div className="relative h-64">
              <Doughnut
                data={{
                  labels: ['Coordinator', 'Planner', 'Unassigned'],
                  datasets: [
                    {
                      data: [
                        metrics.planManagementBreakdown.coordinator,
                        metrics.planManagementBreakdown.planner,
                        metrics.planManagementBreakdown.unassigned,
                      ],
                      backgroundColor: ['#60A5FA', '#34D399', '#D1D5DB'],
                      borderColor: '#FFFFFF',
                      borderWidth: 2,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Onboarding Trend */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Onboarding Trend (8 weeks)</h2>
            <div className="relative h-64">
              <Line
                data={{
                  labels: metrics.onboardingByWeek.map((d) => d.week),
                  datasets: [
                    {
                      label: 'Completed Onboardings',
                      data: metrics.onboardingByWeek.map((d) => d.count),
                      borderColor: '#3B82F6',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      tension: 0.4,
                      fill: true,
                      pointBackgroundColor: '#3B82F6',
                      pointBorderColor: '#FFFFFF',
                      pointBorderWidth: 2,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Participants */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Recent Participants</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {metrics.recentParticipants.length > 0 ? (
                    metrics.recentParticipants.map((participant) => (
                      <tr key={participant.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {participant.fullName}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                              participant.onboardingStatus === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : participant.onboardingStatus === 'in_progress'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {participant.onboardingStatus === 'completed'
                              ? 'Completed'
                              : participant.onboardingStatus === 'in_progress'
                              ? 'In Progress'
                              : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {participant.createdAt}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                        No participants yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => navigate('/participants')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All Participants →
              </button>
            </div>
          </div>

          {/* Recent Agreements */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Recent Agreements</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Participant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {metrics.recentAgreements.length > 0 ? (
                    metrics.recentAgreements.map((agreement) => (
                      <tr key={agreement.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {agreement.participantName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {agreement.agreementStartDate}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {agreement.createdAt}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                        No agreements yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => navigate('/agreements')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All Agreements →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
