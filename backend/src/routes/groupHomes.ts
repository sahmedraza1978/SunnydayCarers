import express, { Request, Response } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  getAllGroupHomes,
  getGroupHomeById,
  createGroupHome,
  updateGroupHome,
  deleteGroupHome,
  getGroupHomeStats,
  searchGroupHomes,
} from '../services/groupHomeService';

const router = express.Router();

// Get all active group homes
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const groupHomes = await getAllGroupHomes();
    res.json({ data: groupHomes });
  } catch (error) {
    console.error('Error fetching group homes:', error);
    res.status(500).json({ error: 'Failed to fetch group homes' });
  }
});

// Search group homes
router.get('/search', authenticate, async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query required' });
    }
    const results = await searchGroupHomes(q);
    res.json({ data: results });
  } catch (error) {
    console.error('Error searching group homes:', error);
    res.status(500).json({ error: 'Failed to search group homes' });
  }
});

// Get group home statistics
router.get('/stats', authenticate, authorize('admin'), async (req: Request, res: Response) => {
  try {
    const stats = await getGroupHomeStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching group home stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get specific group home
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const groupHome = await getGroupHomeById(id);
    if (!groupHome) {
      return res.status(404).json({ error: 'Group home not found' });
    }
    res.json(groupHome);
  } catch (error) {
    console.error('Error fetching group home:', error);
    res.status(500).json({ error: 'Failed to fetch group home' });
  }
});

// Create group home
router.post('/', authenticate, authorize('admin'), async (req: Request, res: Response) => {
  try {
    const {
      name,
      location_street,
      location_suburb,
      location_postcode,
      location_state,
      bedrooms,
      bathrooms,
      assistance_type,
      max_capacity,
      contact_person_name,
      contact_person_phone,
      contact_person_email,
      manager_name,
      manager_phone,
      manager_email,
      wheelchair_accessible,
      has_yard,
      has_kitchen,
      notes,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !location_street ||
      !location_suburb ||
      !location_postcode ||
      !location_state ||
      !bedrooms ||
      bathrooms === undefined
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const groupHome = await createGroupHome({
      name,
      location_street,
      location_suburb,
      location_postcode,
      location_state,
      bedrooms: parseInt(bedrooms),
      bathrooms: parseInt(bathrooms),
      assistance_type,
      max_capacity: max_capacity ? parseInt(max_capacity) : null,
      contact_person_name,
      contact_person_phone,
      contact_person_email,
      manager_name,
      manager_phone,
      manager_email,
      wheelchair_accessible,
      has_yard,
      has_kitchen,
      notes,
    });

    res.status(201).json(groupHome);
  } catch (error) {
    console.error('Error creating group home:', error);
    res.status(500).json({ error: 'Failed to create group home' });
  }
});

// Update group home
router.put('/:id', authenticate, authorize('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const groupHome = await updateGroupHome(id, updates);
    if (!groupHome) {
      return res.status(404).json({ error: 'Group home not found' });
    }

    res.json(groupHome);
  } catch (error) {
    console.error('Error updating group home:', error);
    res.status(500).json({ error: 'Failed to update group home' });
  }
});

// Delete group home (soft delete - sets status to inactive)
router.delete('/:id', authenticate, authorize('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = await deleteGroupHome(id);

    if (!success) {
      return res.status(404).json({ error: 'Group home not found' });
    }

    res.json({ message: 'Group home deleted successfully' });
  } catch (error) {
    console.error('Error deleting group home:', error);
    res.status(500).json({ error: 'Failed to delete group home' });
  }
});

export default router;
