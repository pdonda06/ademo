export const calculateOldRegimeTax = (income) => {
  let tax = 0;
  if (income <= 250000) {
    tax = 0;
  } else if (income <= 500000) {
    tax = (income - 250000) * 0.05;
  } else if (income <= 1000000) {
    tax = 12500 + (income - 500000) * 0.2;
  } else {
    tax = 112500 + (income - 1000000) * 0.3;
  }
  return { totalTax: tax, regime: 'old' };
};

export const calculateNewRegimeTax = (income) => {
  let tax = 0;
  if (income <= 300000) {
    tax = 0;
  } else if (income <= 600000) {
    tax = (income - 300000) * 0.05;
  } else if (income <= 900000) {
    tax = 15000 + (income - 600000) * 0.1;
  } else if (income <= 1200000) {
    tax = 45000 + (income - 900000) * 0.15;
  } else {
    tax = 150000 + (income - 1200000) * 0.2;
  }
  return { totalTax: tax, regime: 'new' };
};

export const generateMockStrategy = (data) => {
  return `
Tax Saving Recommendations for ${data.businessType}:

1. Section 80C Investments (Max ₹1.5L)
   - EPF Contribution: ₹${Math.min(data.income * 0.12, 150000)}
   - ELSS Mutual Funds: ₹50,000
   - Term Insurance: ₹25,000

2. Health Insurance (Section 80D)
   - Company Group Insurance: ₹25,000
   - Individual Policy: ₹50,000

3. NPS Investment (Section 80CCD)
   - Recommended: ₹${Math.min(data.income * 0.1, 50000)}
   - Additional Tax Benefit: ₹50,000

4. Business Deductions
   - Depreciation on Assets: ₹${Math.round(data.assets.equipment * 0.15)}
   - Office Rent: ₹${Math.round(data.expenses * 0.2)}
   - Employee Benefits: ₹${Math.round(data.employeeCount * 50000)}

Potential Annual Tax Savings: ₹${Math.round(data.income * 0.15)}
`;
};

export const generateAIRecommendations = (data) => {
  const recommendations = [
    {
      category: 'Tax Saving Investments',
      items: [
        {
          title: 'ELSS Investment',
          description: `Based on your income of ₹${data.income.toLocaleString()}, invest ₹${Math.min(150000, data.income * 0.1).toLocaleString()} in ELSS funds for optimal tax savings under 80C`,
          impact: 'High',
          potentialSavings: Math.min(150000, data.income * 0.1) * 0.3
        },
        {
          title: 'NPS Contribution',
          description: `Additional NPS investment of ₹${Math.min(50000, data.income * 0.05).toLocaleString()} recommended under 80CCD(1B)`,
          impact: 'Medium',
          potentialSavings: Math.min(50000, data.income * 0.05) * 0.3
        }
      ]
    },
    {
      category: 'Business Optimizations',
      items: [
        {
          title: 'Asset Depreciation',
          description: `Claim accelerated depreciation on equipment worth ₹${data.assets.equipment.toLocaleString()}`,
          impact: 'High',
          potentialSavings: data.assets.equipment * 0.15
        },
        {
          title: 'Employee Benefits',
          description: `Structured salary components for ${data.employeeCount} employees to maximize tax efficiency`,
          impact: 'Medium',
          potentialSavings: data.employeeCount * 25000
        }
      ]
    }
  ];

  // Calculate total potential savings
  const totalSavings = recommendations.reduce((total, category) => {
    return total + category.items.reduce((catTotal, item) => catTotal + item.potentialSavings, 0);
  }, 0);

  return {
    recommendations,
    totalPotentialSavings: totalSavings,
    aiConfidenceScore: 85, // Mock AI confidence score
    customInsights: generateCustomInsights(data)
  };
};

const generateCustomInsights = (data) => [
  {
    title: 'Tax Regime Analysis',
    insight: `Based on your business profile and deduction patterns, the ${data.income > 7500000 ? 'Old' : 'New'} tax regime appears more beneficial`,
    confidence: 92
  },
  {
    title: 'Industry-Specific Benefits',
    insight: `As a ${data.businessType} company, you can maximize benefits under Section 35(2AB) for R&D expenses`,
    confidence: 88
  }
];
