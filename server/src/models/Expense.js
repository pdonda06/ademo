import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['housing', 'transportation', 'education', 'healthcare', 'business', 'other']
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  description: String,
  deductible: {
    type: Boolean,
    default: false
  },
  receipt: {
    filename: String,
    url: String
  },
  tags: [String],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

export const Expense = mongoose.model('Expense', expenseSchema);
