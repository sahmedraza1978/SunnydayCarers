import { Router, Request, Response } from 'express';
import { query } from '../database/init';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { AgreementTemplate, ApiResponse } from '../types';
import fs from 'fs';
import path from 'path';

const router = Router();

// Get all templates
router.get(
  '/',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const result = await query(
      'SELECT id, name, description, version, is_active, created_at FROM agreement_templates ORDER BY created_at DESC'
    );
    res.json({
      success: true,
      data: result.rows,
    } as ApiResponse<AgreementTemplate[]>);
  })
);

// Get template by ID
router.get(
  '/:id',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const result = await query(
      'SELECT * FROM agreement_templates WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Template not found');
    }

    res.json({
      success: true,
      data: result.rows[0],
    } as ApiResponse<AgreementTemplate>);
  })
);

// Create new template
router.post(
  '/',
  authenticate,
  authorize(['admin']),
  asyncHandler(async (req: Request, res: Response) => {
    const { name, description, content, file_path } = req.body;

    if (!name || !content) {
      throw new AppError(400, 'Name and content are required');
    }

    const result = await query(
      `INSERT INTO agreement_templates (name, description, content, file_path, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, description || null, content, file_path || null, req.user?.id || null]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    } as ApiResponse<AgreementTemplate>);
  })
);

// Update template
router.put(
  '/:id',
  authenticate,
  authorize(['admin']),
  asyncHandler(async (req: Request, res: Response) => {
    const { name, description, content, is_active } = req.body;

    const result = await query(
      `UPDATE agreement_templates 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           content = COALESCE($3, content),
           is_active = COALESCE($4, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [name, description, content, is_active, req.params.id]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Template not found');
    }

    res.json({
      success: true,
      data: result.rows[0],
    } as ApiResponse<AgreementTemplate>);
  })
);

// Delete template
router.delete(
  '/:id',
  authenticate,
  authorize(['admin']),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await query(
      'DELETE FROM agreement_templates WHERE id = $1 RETURNING id',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Template not found');
    }

    res.json({
      success: true,
      data: { message: 'Template deleted' },
    });
  })
);

export default router;
