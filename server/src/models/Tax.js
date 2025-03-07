import mongoose from 'mongoose';

const taxCalculationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  income: {
    type: Number,
    required: true
  },
  expenses: {
    type: Number,
    required: true
  },
  deductions: {
    type: Number,
    required: true
  },
  filingStatus: {
    type: String,
    enum: ['single', 'married', 'head_of_household'],
    required: true
  },
  taxableIncome: {
    type: Number,
    required: true
  },
  taxLiability: {
    type: Number,
    required: true
  },
  effectiveRate: {
    type: Number,
    required: true
  },
  calculatedAt: {
    type: Date,
    default: Date.now
  },
  savedAt: {
    type: Date,
    default: Date.now
  },
  notes: String
}, {
  timestamps: true
});

export const TaxCalculation = mongoose.model('TaxCalculation', taxCalculationSchema);
