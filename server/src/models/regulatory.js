import mongoose from 'mongoose';

const regulatorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['alert', 'update'],
    default: 'alert'
  },
  impact: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'dismissed'],
    default: 'active'
  },
  category: {
    type: String,
    enum: ['tax', 'compliance', 'deadline', 'policy'],
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('RegulatoryAlert', regulatorySchema);
