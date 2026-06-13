import { Router, Request, Response } from 'express';
import { query } from '../database/init';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { User, ApiResponse } from '../types';

const router = Router();

// Get all users (admin only)
router.get(
  '/',
  authenticate,
  authorize(['admin']),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await query(
      'SELECT id, email, first_name, last_name, role, is_active, created_at FROM users'
    );
    res.json({
      success: true,
      data: result.rows,
    } as ApiResponse<User[]>);
  })
);

// Get current user
router.get(
  '/me',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const result = await query(
      'SELECT id, email, first_name, last_name, role, is_active, created_at FROM users WHERE id = $1',
      [req.user?.id]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'User not found');
    }

    res.json({
      success: true,
      data: result.rows[0],
    } as ApiResponse<User>);
  })
);

// Update user (admin only)
router.put(
  '/:id',
  authenticate,
  authorize(['admin']),
  asyncHandler(async (req: Request, res: Response) => {
    const { first_name, last_name, role, is_active } = req.body;

    const result = await query(
      `UPDATE users SET first_name = COALESCE($1, first_name), 
       last_name = COALESCE($2, last_name), 
       role = COALESCE($3, role),
       is_active = COALESCE($4, is_active),
       updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 RETURNING id, email, first_name, last_name, role, is_active, created_at`,
      [first_name, last_name, role, is_active, req.params.id]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'User not found');
    }

    res.json({
      success: true,
      data: result.rows[0],
    } as ApiResponse<User>);
  })
);

export default router;
