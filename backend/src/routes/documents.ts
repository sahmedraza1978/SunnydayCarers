import { Router, Request, Response } from 'express';
import { query } from '../database/init';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { documentService } from '../services/documentService';
import { ApiResponse } from '../types';
import fs from 'fs';
import path from 'path';

const router = Router();

// Generate document from agreement
router.post(
  '/:agreementId/generate',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { agreementId } = req.params;
    const { format = 'docx' } = req.body; // 'docx' or 'pdf'

    // Get agreement details
    const agreementResult = await query(
      `SELECT sa.*, p.*, t.content as template_content 
       FROM service_agreements sa
       JOIN participants p ON sa.participant_id = p.id
       JOIN agreement_templates t ON sa.template_id = t.id
       WHERE sa.id = $1`,
      [agreementId]
    );

    if (agreementResult.rows.length === 0) {
      throw new AppError(404, 'Agreement not found');
    }

    const agreement = agreementResult.rows[0];

    try {
      // Generate document
      const buffer = await documentService.generateDocument(agreement, format);

      // Create output filename
      const filename = `SA-${agreement.first_name}-${agreement.last_name}-${agreement.ndis_number}.${
        format === 'pdf' ? 'pdf' : 'docx'
      }`;

      // Save to storage (optional)
      const uploadDir = path.join(__dirname, '../../uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filepath = path.join(uploadDir, filename);
      fs.writeFileSync(filepath, buffer);

      // Update agreement with document path
      await query(
        `UPDATE service_agreements SET document_path = $1 WHERE id = $2`,
        [filepath, agreementId]
      );

      // Send file to client
      res.setHeader('Content-Type', format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(buffer);
    } catch (error: any) {
      console.error('Document generation error:', error);
      throw new AppError(500, `Failed to generate ${format}: ${error.message}`);
    }
  })
);

// Preview document fields
router.get(
  '/:agreementId/preview',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { agreementId } = req.params;

    const agreementResult = await query(
      `SELECT sa.*, p.*, t.content as template_content 
       FROM service_agreements sa
       JOIN participants p ON sa.participant_id = p.id
       JOIN agreement_templates t ON sa.template_id = t.id
       WHERE sa.id = $1`,
      [agreementId]
    );

    if (agreementResult.rows.length === 0) {
      throw new AppError(404, 'Agreement not found');
    }

    const agreement = agreementResult.rows[0];
    const fieldData = documentService.mapParticipantToFields(agreement);

    res.json({
      success: true,
      data: {
        participant_name: `${agreement.first_name} ${agreement.last_name}`,
        fields: fieldData,
      },
    } as ApiResponse);
  })
);

export default router;
