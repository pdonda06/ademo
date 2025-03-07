export const GST_RATES = {
  'IT and Software': {
    rate: 18,
    description: 'Software, IT services, and digital products',
    hsn: '9983'
  },
  'Office Supplies': {
    rate: 18,
    description: 'Stationery and office equipment',
    hsn: '4820'
  },
  'Professional Services': {
    rate: 18,
    description: 'Consulting, legal, and professional services',
    hsn: '9983'
  },
  'Travel and Conveyance': {
    rate: 5,
    description: 'Transportation services',
    hsn: '9964'
  },
  'Rent and Utilities': {
    rate: 18,
    description: 'Commercial rent and utility services',
    hsn: '9972'
  },
  'Marketing': {
    rate: 18,
    description: 'Advertising and marketing services',
    hsn: '9983'
  },
  'Other': {
    rate: null,
    description: 'Custom category',
    hsn: null
  }
};

export const calculateGSTAmounts = (baseAmount, category, customRate = null) => {
  const rate = category === 'Other' ? 
    (customRate || 0) : 
    GST_RATES[category]?.rate || 0;

  const gstAmount = (baseAmount * rate) / 100;
  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;
  const igst = gstAmount;

  return {
    rate,
    gstAmount,
    cgst,
    sgst,
    igst,
    total: baseAmount + gstAmount,
    hsn: GST_RATES[category]?.hsn || null
  };
};

export const validateGSTNumber = (gstNumber) => {
  // GST number format validation
  const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstPattern.test(gstNumber);
};
