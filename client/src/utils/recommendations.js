export const generateRecommendations = (income, expenses, deductions) => {
  const recommendations = [];

  if (income > 100000) {
    recommendations.push({
      title: 'Pension Contributions',
      description: 'Consider increasing pension contributions to reduce taxable income',
      impact: 'High',
    });
  }

  if (expenses < income * 0.2) {
    recommendations.push({
      title: 'Business Expenses Review',
      description: 'You might be missing out on legitimate business expenses',
      impact: 'Medium',
    });
  }

  if (deductions < 10000) {
    recommendations.push({
      title: 'Tax Deductions',
      description: 'Explore additional tax deductions you might be eligible for',
      impact: 'Medium',
    });
  }

  return recommendations;
};

export const calculateRiskScore = (income, expenses, deductions) => {
  let score = 0;
  
  // High expense ratio
  if (expenses > income * 0.7) score += 30;
  
  // High deductions
  if (deductions > income * 0.3) score += 20;
  
  // Complex tax situation
  if (income > 150000) score += 15;
  
  return Math.min(score, 100);
};
