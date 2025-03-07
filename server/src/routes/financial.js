import express from 'express';
import { protect } from '../middleware/auth.js';
import { recommendSalaryStructure } from '../services/aiFinancialService.js';

const router = express.Router();

// Get financial summary  
router.get('/summary', protect, async (req, res) => {
  try {
    // TODO: Implement actual database queries
    const summary = {
      totalIncome: 150000,
      totalExpenses: 50000,
      totalDeductions: 20000,
      taxLiability: 24000,
      effectiveRate: 16,
    };
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
router.post('/salary-structure', protect, async (req, res) => {
  try {
    const { salary, allowances } = req.body;
    const recommendations = await recommendSalaryStructure(salary, allowances);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Get financial projections
router.get('/projections', protect, async (req, res) => {
  try {
    const projections = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i).toLocaleString('default', { month: 'short' }),
      income: 12500,
      expenses: 4200,
      tax: 2500,
    }));
    res.json(projections);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Record new financial transaction
router.post('/transactions', protect, async (req, res) => {
  try {
    const { type, amount, category, date, description } = req.body;
    // TODO: Save to database
    res.status(201).json({
      id: Date.now().toString(),
      type,
      amount,
      category,
      date,
      description,
      userId: req.user.id,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get tax recommendations
router.get('/recommendations', protect, async (req, res) => {
  try {
    const recommendations = [
      {
        id: 1,
        title: 'Increase Pension Contributions',
        description: 'Consider maximizing your pension contributions to reduce taxable income',
        potentialSavings: 5000,
        priority: 'high',
      },
      {
        id: 2,
        title: 'Review Business Expenses',
        description: 'Ensure all legitimate business expenses are properly documented and claimed',
        potentialSavings: 3000,
        priority: 'medium',
      },
    ];
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
