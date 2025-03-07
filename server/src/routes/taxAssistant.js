import express from 'express';
import { analyze } from '../controllers/taxAssistant.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/analyze', protect, analyze);

export default router;