import { calculateTaxLiability, generateRecommendations } from '../utils/taxCalculations.js';

export const analyze = async (req, res) => {
  try {
    const { income, expenses, investments, deductions } = req.body;

    // Calculate tax liability
    const taxLiability = calculateTaxLiability(income, expenses, deductions);

    // Generate recommendations
    const recommendations = generateRecommendations(income, expenses, deductions);

    // Prepare the analysis result
    const analysisResult = {
      currentTax: taxLiability.taxLiability,
      recommendations: recommendations
    };

    res.json(analysisResult);
  } catch (error) {
    console.error('Tax analysis error:', error);
    res.status(500).json({ message: 'Failed to analyze tax situation' });
  }
};