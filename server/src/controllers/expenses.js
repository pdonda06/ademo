import { Expense } from '../models/Expense.js';

export const getExpenses = async (userId) => {
  return await Expense.find({ userId })
    .sort({ date: -1 });
};

export const createExpense = async (userId, data) => {
  const expense = new Expense({
    userId,
    ...data,
  });
  return await expense.save();
};

export const updateExpense = async (expenseId, updates) => {
  return await Expense.findByIdAndUpdate(
    expenseId,
    { $set: updates },
    { new: true }
  );
};

export const deleteExpense = async (expenseId) => {
  return await Expense.findByIdAndDelete(expenseId);
};

export const getExpenseStats = async (userId) => {
  const stats = await Expense.aggregate([
    { $match: { userId: userId } },
    { $group: {
      _id: '$category',
      total: { $sum: '$amount' },
      count: { $sum: 1 }
    }},
    { $sort: { total: -1 } }
  ]);
  
  return stats;
};
