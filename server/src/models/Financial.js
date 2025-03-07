import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense', 'deduction'],
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: String,
  date: {
    type: Date,
    default: Date.now,
  },
  tags: [String],
  attachments: [{
    filename: String,
    url: String,
  }],
}, {
  timestamps: true,
});

const projectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  year: Number,
  month: Number,
  income: Number,
  expenses: Number,
  deductions: Number,
  taxLiability: Number,
  effectiveRate: Number,
}, {
  timestamps: true,
});

export const Transaction = mongoose.model('Transaction', transactionSchema);
export const Projection = mongoose.model('Projection', projectionSchema);
