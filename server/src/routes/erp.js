import express from 'express';
import { syncData, getBalances, getTaxReport } from '../controllers/erpSync.js';

const router = express.Router();

router.post('/sync', syncData);
router.get('/balances', getBalances);
router.get('/tax-report', getTaxReport);

export default router;
