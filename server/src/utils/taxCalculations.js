const HUGGINGFACE_TOKEN = process.env.HUGGINGFACE_TOKEN;
const TAX_RECOMMENDATION_MODEL = "google/flan-t5-xxl";

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

export const generateRecommendations = async (income, expenses, deductions) => {
  const prompt = `Generate tax optimization recommendations for an individual with:
  - Annual income: ${income}
  - Business expenses: ${expenses}
  - Tax deductions: ${deductions}
  Focus on Indian tax laws and provide practical, actionable suggestions.`;

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${TAX_RECOMMENDATION_MODEL}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGINGFACE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: prompt })
    });

    const data = await response.json();
    const recommendations = data[0].generated_text.split('\n').map((item, index) => ({
      title: `Recommendation ${index + 1}`,
      description: item.trim(),
      impact: 'Medium' // This could be determined by the model as well
    }));

    return recommendations;
  } catch (error) {
    console.error('Failed to generate recommendations:', error);
    return [];
  }
};