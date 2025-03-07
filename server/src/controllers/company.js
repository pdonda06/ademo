import Company from '../models/company.js';
import Transaction from '../models/transaction.js';
import { classifyTransaction } from '../services/expenseClassifier.js';

export const registerCompany = async (req, res) => {
  try {
    const company = new Company({
      ...req.body,
      createdBy: req.user.id
    });
    await company.save();
    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addTransaction = async (req, res) => {
  try {
    const { companyId, description, amount, companyName, date } = req.body;

    // Get AI classification
    const classification = await classifyTransaction(description, companyName);

    const transaction = new Transaction({
      companyId,
      transactionId: `TXN${Date.now()}`,
      description,
      amount,
      companyName,
      date,
      category: classification.category,
      isDeductible: classification.isDeductible,
      aiConfidence: classification.confidence
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const { companyId } = req.params;
    const transactions = await Transaction.find({ companyId });
    
    const summary = transactions.reduce((acc, curr) => {
      const category = curr.category;
      if (!acc[category]) {
        acc[category] = {
          total: 0,
          deductible: 0,
          count: 0
        };
      }
      acc[category].total += curr.amount;
      if (curr.isDeductible) acc[category].deductible += curr.amount;
      acc[category].count++;
      return acc;
    }, {});

    res.json({ transactions, summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
