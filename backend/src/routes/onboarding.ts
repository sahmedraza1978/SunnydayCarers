import { Router, Request, Response } from 'express';
import { query } from '../database/init';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Get all onboarding records for a participant
router.get(
  '/participant/:participantId',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const result = await query(
      'SELECT * FROM onboarding_records WHERE participant_id = $1 ORDER BY created_at DESC',
      [req.params.participantId]
    );

    res.json({
      success: true,
      data: result.rows,
    } as ApiResponse);
  })
);

// Create new onboarding record
router.post(
  '/',
  authenticate,
  authorize(['admin', 'support_worker']),
  asyncHandler(async (req: Request, res: Response) => {
    const {
      participant_id,
      service_type,
      managed_by,
      support_coordinator_name,
      support_coordinator_phone,
      support_coordinator_email,
      planner_name,
      planner_phone,
      planner_email,
      planner_organization,
      group_home_name,
      group_home_address,
      group_home_phone,
      in_home_support_start_date,
      day_program_name,
      day_program_days,
      additional_notes,
    } = req.body;

    // Validate required fields
    if (!participant_id || !service_type || !managed_by) {
      throw new AppError(400, 'participant_id, service_type, and managed_by are required');
    }

    // Validate conditional required fields
    if (managed_by === 'planner' && !planner_name) {
      throw new AppError(400, 'Planner information required when managed by Planner');
    }

    if (service_type.includes('sil_group_home') && !group_home_address) {
      throw new AppError(400, 'Group home address required for SIL group home services');
    }

    if (service_type.includes('in_home_support') && !in_home_support_start_date) {
      throw new AppError(400, 'Start date required for in-home support services');
    }

    const id = uuidv4();
    const result = await query(
      `INSERT INTO onboarding_records (
        id, participant_id, service_type, managed_by, support_coordinator_name,
        support_coordinator_phone, support_coordinator_email, planner_name,
        planner_phone, planner_email, planner_organization, group_home_name,
        group_home_address, group_home_phone, in_home_support_start_date,
        day_program_name, day_program_days, additional_notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *`,
      [
        id,
        participant_id,
        service_type,
        managed_by,
        support_coordinator_name || null,
        support_coordinator_phone || null,
        support_coordinator_email || null,
        planner_name || null,
        planner_phone || null,
        planner_email || null,
        planner_organization || null,
        group_home_name || null,
        group_home_address || null,
        group_home_phone || null,
        in_home_support_start_date || null,
        day_program_name || null,
        day_program_days || null,
        additional_notes || null,
      ]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    } as ApiResponse);
  })
);

// Update onboarding record
router.put(
  '/:id',
  authenticate,
  authorize(['admin', 'support_worker']),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    // Build dynamic update query
    const allowedFields = [
      'service_type',
      'managed_by',
      'support_coordinator_name',
      'support_coordinator_phone',
      'support_coordinator_email',
      'planner_name',
      'planner_phone',
      'planner_email',
      'planner_organization',
      'group_home_name',
      'group_home_address',
      'group_home_phone',
      'in_home_support_start_date',
      'day_program_name',
      'day_program_days',
      'additional_notes',
      'status',
    ];

    const setClause = Object.keys(updates)
      .filter((key) => allowedFields.includes(key))
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');

    if (!setClause) {
      throw new AppError(400, 'No valid fields to update');
    }

    const values = Object.keys(updates)
      .filter((key) => allowedFields.includes(key))
      .map((key) => updates[key]);

    values.push(id);

    const result = await query(
      `UPDATE onboarding_records SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${
        values.length
      } RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Onboarding record not found');
    }

    res.json({
      success: true,
      data: result.rows[0],
    } as ApiResponse);
  })
);

// Mark onboarding as complete
router.patch(
  '/:id/complete',
  authenticate,
  authorize(['admin', 'support_worker']),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await query(
      `UPDATE onboarding_records 
       SET status = 'completed', completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 
       RETURNING *`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Onboarding record not found');
    }

    res.json({
      success: true,
      data: result.rows[0],
    } as ApiResponse);
  })
);

export default router;
