import mongoose from 'mongoose';

const erpSyncSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  lastSyncDate: {
    type: Date,
    required: true
  },
  dataSource: {
    type: String,
    enum: ['DEMO', 'ODOO', 'QUICKBOOKS', 'XERO'],
    default: 'DEMO'
  },
  syncStatus: {
    type: String,
    enum: ['SUCCESS', 'FAILED', 'IN_PROGRESS'],
    default: 'SUCCESS'
  },
  syncedRecords: {
    transactions: Number,
    accounts: Number,
    vendors: Number
  }
}, {
  timestamps: true
});

export default mongoose.model('ErpSync', erpSyncSchema);
