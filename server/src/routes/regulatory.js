import express from 'express';
import { 
  getAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
  getUpdates 
} from '../controllers/regulatory.js';
import { fetchGovernmentUpdates } from '../services/regulatoryService.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.get('/incentives', protect, async (req, res) => {
  try {
    const incentives = await fetchGovernmentUpdates();
    res.json(incentives);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/alerts', getAlerts);
router.post('/alerts', createAlert);
router.put('/alerts/:id', updateAlert);
router.delete('/alerts/:id', deleteAlert);
router.get('/updates', getUpdates);

export default router;
