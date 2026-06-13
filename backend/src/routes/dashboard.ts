import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { getDashboardMetrics } from '../services/dashboardService';

const router = express.Router();

router.get('/metrics', authenticate, authorize('admin'), async (req, res) => {
  try {
    const metrics = await getDashboardMetrics();
    res.json(metrics);
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
});

export default router;
