import mongoose from 'mongoose';
import Transaction from '../models/transaction.js';

const DEDUCTIBLE_CATEGORIES = {
  'Office Supplies': {
    section: '37(1)',
    maxLimit: null,
    description: 'General business expenditure'
  },
  'IT and Software': {
    section: '37(1)',
    maxLimit: null,
    description: 'Business software and technology'
  },
  'Travel and Conveyance': {
    section: '37(1)',
    maxLimit: null,
    description: 'Business travel expenses'
  },
  'Professional Services': {
    section: '44AA',
    maxLimit: null,
    description: 'Professional fees and consultancy'
  },
  'Rent and Utilities': {
    section: '37(1)',
    maxLimit: null,
    description: 'Office rent and utilities'
  }
};

export const calculateDeductibility = (expense) => {
  const category = DEDUCTIBLE_CATEGORIES[expense.category];
  
  if (!category) {
    return {
      isDeductible: false,
      section: 'N/A',
      reason: 'Category not eligible for deduction'
    };
  }

  // Check GST compliance
  const isGSTCompliant = expense.gstNumber && expense.gstAmount > 0;

  // Check proper documentation
  const hasProperDocs = expense.invoiceNumber && expense.date;

  return {
    isDeductible: isGSTCompliant && hasProperDocs,
    section: category.section,
    reason: !isGSTCompliant ? 'Missing GST details' : 
            !hasProperDocs ? 'Incomplete documentation' : 
            'Eligible for deduction',
    maxLimit: category.maxLimit,
    description: category.description
  };
};

export const aggregateExpenseAnalytics = async (companyId) => {
  try {
    const analytics = await Transaction.aggregate([
      { 
        $match: { 
          companyId: new mongoose.Types.ObjectId(companyId.toString())
        } 
      },
      { 
        $group: {
          _id: '$category',
          total: { 
            $sum: { 
              $cond: [
                { $type: '$amount' },
                '$amount',
                0
              ]
            }
          },
          gstTotal: { 
            $sum: { 
              $cond: [
                { $type: '$gstAmount' },
                '$gstAmount',
                0
              ]
            }
          },
          count: { $sum: 1 },
          deductibleAmount: {
            $sum: {
              $cond: [
                { $and: [
                  '$isDeductible',
                  { $type: '$amount' }
                ]},
                '$amount',
                0
              ]
            }
          }
        }
      },
      { 
        $project: {
          category: '$_id',
          total: 1,
          gstTotal: 1,
          count: 1,
          deductibleAmount: 1,
          _id: 0
        }
      },
      { $sort: { total: -1 } }
    ]);

    return analytics;
  } catch (error) {
    console.error('Analytics aggregation error:', error);
    return [];
  }
};
