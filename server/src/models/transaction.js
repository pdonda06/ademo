import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
    set: v => new Date(v)
  },
  vendorName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  invoiceNumber: {
    type: String,
    required: false
  },
  gstNumber: {
    type: String,
    required: false
  },
  category: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
    set: v => Number(v)
  },
  gstRate: {
    type: Number,
    default: 0
  },
  gstAmount: {
    type: Number,
    default: 0,
    min: 0,
    set: v => Number(v)
  },
  cgst: {
    type: Number,
    default: 0
  },
  sgst: {
    type: Number,
    default: 0
  },
  igst: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  isDeductible: {
    type: Boolean,
    default: false,
    set: v => {
      if (typeof v === 'string') {
        return v.toLowerCase() === 'true';
      }
      return Boolean(v);
    }
  },
  taxSection: {
    type: String,
    default: null
  },
  customGstRate: {
    type: Number,
    default: null
  },
  gstCreditclaimed: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
});

// Add a pre-save hook for additional validation
transactionSchema.pre('save', function(next) {
  // Ensure numeric fields are valid
  if (isNaN(this.amount) || isNaN(this.gstAmount)) {
    next(new Error('Invalid numeric value'));
  }
  // Ensure date is valid
  if (isNaN(this.date.getTime())) {
    next(new Error('Invalid date'));
  }
  next();
});

export default mongoose.model('Transaction', transactionSchema);
