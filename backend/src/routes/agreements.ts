import { Router, Request, Response } from 'express';
import { query } from '../database/init';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { ServiceAgreement, ApiResponse } from '../types';

const router = Router();

// Get all agreements
router.get(
  '/',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const result = await query(
      'SELECT * FROM service_agreements ORDER BY created_at DESC'
    );
    res.json({
      success: true,
      data: result.rows,
    } as ApiResponse<ServiceAgreement[]>);
  })
);

// Get agreement by ID
router.get(
  '/:id',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const result = await query(
      'SELECT * FROM service_agreements WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Agreement not found');
    }

    res.json({
      success: true,
      data: result.rows[0],
    } as ApiResponse<ServiceAgreement>);
  })
);

// Create new agreement
router.post(
  '/',
  authenticate,
  authorize(['admin', 'support_worker']),
  asyncHandler(async (req: Request, res: Response) => {
    const { participant_id, template_id, start_date, end_date, notes } = req.body;

    if (!participant_id || !template_id || !start_date) {
      throw new AppError(400, 'Missing required fields');
    }

    const result = await query(
      `INSERT INTO service_agreements (participant_id, template_id, start_date, end_date, notes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [participant_id, template_id, start_date, end_date || null, notes || null, req.user?.id || null]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    } as ApiResponse<ServiceAgreement>);
  })
);

// Update agreement status
router.patch(
  '/:id/status',
  authenticate,
  authorize(['admin']),
  asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body;

    if (!status) {
      throw new AppError(400, 'Status is required');
    }

    const result = await query(
      `UPDATE service_agreements SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Agreement not found');
    }

    res.json({
      success: true,
      data: result.rows[0],
    } as ApiResponse<ServiceAgreement>);
  })
);

export default router;
