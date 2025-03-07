import { TaxCalculation } from '../models/Tax.js';
export const calculateTax = async (userId, data) => {
  const { income, expenses, deductions, filingStatus } = data;
  
  // Basic tax calculation logic
  const taxableIncome = Math.max(income - expenses - deductions, 0);
  const basicRate = 0.2;
  const higherRate = 0.4;
  
  let taxLiability = 0;
  if (taxableIncome <= 50000) {
    taxLiability = taxableIncome * basicRate;
  } else {
    taxLiability = (50000 * basicRate) + ((taxableIncome - 50000) * higherRate);
  }
  
  const calculation = {
    userId,
    income,
    expenses,
    deductions,
    filingStatus,
    taxableIncome,
    taxLiability,
    effectiveRate: (taxLiability / income) * 100,
    calculatedAt: new Date()
  };

  return calculation;
};

export const getTaxHistory = async (userId) => {
  return await TaxCalculation.find({ userId })
    .sort({ calculatedAt: -1 })
    .limit(10);
};


export const saveTaxCalculation = async (userId, calculationData) => {
  const calculation = new TaxCalculation({
    userId,
    ...calculationData,
    savedAt: new Date()
  });
  
  return await calculation.save();
};
