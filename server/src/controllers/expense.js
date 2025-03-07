import { processExpenseDocument } from '../services/expenseClassifier.js';
import { calculateDeductibility, aggregateExpenseAnalytics } from '../services/expenseService.js';
import { calculateGSTAmounts } from '../services/gstRules.js';
import Transaction from '../models/transaction.js';
import mongoose from 'mongoose';

const TEST_USER_ID = new mongoose.Types.ObjectId('65bf631dc5b35d8d259a81c1');

export const createExpense = async (req, res) => {
  try {
    // Validate required fields
    const { vendorName, amount, category, date } = req.body;
    
    if (!vendorName || !amount || !category || !date) {
      return res.status(400).json({
        message: 'Missing required fields',
        required: ['vendorName', 'amount', 'category', 'date']
      });
    }

    // Calculate GST amounts
    const gstInfo = calculateGSTAmounts(
      Number(amount),
      category,
      req.body.customGstRate
    );

    // Calculate deductibility
    const deductibilityInfo = calculateDeductibility({
      ...req.body,
      ...gstInfo
    });

    // Prepare transaction data with proper type casting
    const transactionData = {
      vendorName,
      amount: Number(amount),
      category,
      date: new Date(date),
      gstNumber: req.body.gstNumber || null,
      invoiceNumber: req.body.invoiceNumber || null,
      description: req.body.description || '',
      companyId: TEST_USER_ID,
      transactionId: `TXN${Date.now()}`,
      gstRate: gstInfo.rate,
      gstAmount: gstInfo.gstAmount,
      cgst: gstInfo.cgst,
      sgst: gstInfo.sgst,
      total: gstInfo.total,
      isDeductible: Boolean(deductibilityInfo.isDeductible),
      taxSection: deductibilityInfo.section || null,
      customGstRate: req.body.customGstRate ? Number(req.body.customGstRate) : null
    };

    console.log('Creating transaction with data:', transactionData);

    const transaction = new Transaction(transactionData);
    await transaction.save();

    res.status(201).json({
      transaction,
      deductibilityInfo
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(400).json({
      message: 'Failed to create expense',
      error: error.message,
      details: error.errors
    });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate, isDeductible } = req.query;
    const companyId = TEST_USER_ID; // Using test ID for now

    let query = { companyId: TEST_USER_ID };

    if (category) query.category = category;
    if (isDeductible !== undefined) query.isDeductible = isDeductible === 'true';
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    console.log('Query:', query); // Debug log

    const expenses = await Transaction.find(query).sort({ date: -1 });
    
    // Calculate summary even if analytics fails
    const summary = {
      totalExpenses: expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0),
      totalDeductible: expenses.filter(exp => exp.isDeductible)
                              .reduce((sum, exp) => sum + (exp.amount || 0), 0),
      totalGST: expenses.reduce((sum, exp) => sum + (exp.gstAmount || 0), 0),
      categoryWise: []
    };

    // Try to get analytics, but don't fail if it errors
    try {
      const analytics = await aggregateExpenseAnalytics(companyId);
      summary.categoryWise = analytics;
    } catch (analyticsError) {
      console.error('Analytics error:', analyticsError);
    }

    res.json({
      expenses: expenses || [],
      summary
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({
      message: 'Failed to fetch expenses',
      error: error.message
    });
  }
};

export const uploadExpense = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const result = await processExpenseDocument(req.file, req.body);
    const transaction = new Transaction({
      ...req.body,
      ...result,
      companyId: TEST_USER_ID,
      transactionId: `TXN${Date.now()}`
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
