export const calculateTaxLiability = (income, expenses, deductions) => {
  const taxableIncome = Math.max(income - expenses - deductions, 0);
  const basicTaxRate = 0.2; // 20% basic rate
  const higherTaxRate = 0.4; // 40% higher rate
  
  let taxLiability = 0;
  if (taxableIncome <= 50000) {
    taxLiability = taxableIncome * basicTaxRate;
  } else {
    taxLiability = (50000 * basicTaxRate) + ((taxableIncome - 50000) * higherTaxRate);
  }
  
  return {
    taxableIncome,
    taxLiability,
    effectiveRate: (taxLiability / income) * 100
  };
};

export const generateMonthlyProjections = (income, expenses, deductions) => {
  const monthlyIncome = income / 12;
  const monthlyExpenses = expenses / 12;
  const monthlyDeductions = deductions / 12;
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    month,
    baseline: Math.round(monthlyIncome * 0.3), // 30% baseline tax
    optimized: Math.round(calculateTaxLiability(monthlyIncome, monthlyExpenses, monthlyDeductions).taxLiability)
  }));
};

export const calculateDetailedBreakdown = (income, expenses, deductions) => {
  const { taxableIncome, taxLiability, effectiveRate } = calculateTaxLiability(income, expenses, deductions);
  
  return {
    summary: {
      grossIncome: income,
      totalDeductions: deductions,
      totalExpenses: expenses,
      taxableIncome,
      taxLiability,
      effectiveRate,
      netIncome: income - taxLiability
    },
    taxBands: [
      {
        band: 'Basic Rate',
        rate: '20%',
        amount: Math.min(taxableIncome, 50000) * 0.2
      },
      {
        band: 'Higher Rate',
        rate: '40%',
        amount: Math.max(0, (taxableIncome - 50000) * 0.4)
      }
    ]
  };
};
