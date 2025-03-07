import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/auth.js';
import { createExpense, getExpenses, uploadExpense } from '../controllers/expense.js';

const router = express.Router();

const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// For manual entry
router.post('/', createExpense);
router.get('/', getExpenses);
router.get('/gst-credits', protect, async (req, res) => {
  try {
    const credits = await Transaction.aggregate([
      {
        $match: {
          gstNumber: { $exists: true },
          gstCreditclaimed: true
        }
      },
      {
        $group: {
          _id: "$category",
          totalGST: { $sum: "$gstAmount" },
          claimedCredits: { $sum: { $cond: ["$gstCredit claimed", "$gstAmount", 0] } }
        }
      }
    ]);
    res.json(credits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// For file upload
router.post('/upload', upload.single('receipt'), uploadExpense);

export default router;
