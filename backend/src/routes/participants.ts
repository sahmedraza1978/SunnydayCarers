import { Router, Request, Response } from 'express';
import { query } from '../database/init';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { Participant, ApiResponse } from '../types';

const router = Router();

// Get all participants
router.get(
  '/',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const result = await query('SELECT * FROM participants ORDER BY created_at DESC');
    res.json({
      success: true,
      data: result.rows,
    } as ApiResponse<Participant[]>);
  })
);

// Get participant by ID
router.get(
  '/:id',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const result = await query('SELECT * FROM participants WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      throw new AppError(404, 'Participant not found');
    }

    res.json({
      success: true,
      data: result.rows[0],
    } as ApiResponse<Participant>);
  })
);

// Create new participant
router.post(
  '/',
  authenticate,
  authorize(['admin', 'support_worker']),
  asyncHandler(async (req: Request, res: Response) => {
    const {
      ndis_number,
      first_name,
      last_name,
      date_of_birth,
      email,
      phone_number,
      address_street,
      address_suburb,
      address_state,
      address_postcode,
      emergency_contact_name,
      emergency_contact_phone,
      emergency_contact_relationship,
      notes,
    } = req.body;

    if (!ndis_number || !first_name || !last_name) {
      throw new AppError(400, 'Missing required fields');
    }

    const result = await query(
      `INSERT INTO participants (
        ndis_number, first_name, last_name, date_of_birth, email, phone_number,
        address_street, address_suburb, address_state, address_postcode,
        emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
        notes, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [
        ndis_number,
        first_name,
        last_name,
        date_of_birth || null,
        email || null,
        phone_number || null,
        address_street || null,
        address_suburb || null,
        address_state || null,
        address_postcode || null,
        emergency_contact_name || null,
        emergency_contact_phone || null,
        emergency_contact_relationship || null,
        notes || null,
        req.user?.id || null,
      ]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    } as ApiResponse<Participant>);
  })
);

// Update participant
router.put(
  '/:id',
  authenticate,
  authorize(['admin', 'support_worker']),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    const setClause = Object.keys(updates)
      .filter((key) => key !== 'id' && key !== 'created_at' && key !== 'created_by')
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');

    if (!setClause) {
      throw new AppError(400, 'No fields to update');
    }

    const values = Object.keys(updates)
      .filter((key) => key !== 'id' && key !== 'created_at' && key !== 'created_by')
      .map((key) => updates[key]);

    values.push(id);

    const result = await query(
      `UPDATE participants SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Participant not found');
    }

    res.json({
      success: true,
      data: result.rows[0],
    } as ApiResponse<Participant>);
  })
);

export default router;
