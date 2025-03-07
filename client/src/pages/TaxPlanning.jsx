import { useState, useEffect } from 'react';
import { api } from '../services/api';

const TaxPlanning = () => {
  const [plan, setPlan] = useState('');

  const generatePlan = async () => {
    try {
      const response = await api.post('/tax/generate-plan', {
        income: 150000,
        expenses: 50000,
        deductions: 20000
      });
      setPlan(response.data);
    } catch (error) {
      console.error('Plan generation error:', error);
    }
  };

  return (
    <div>
      <button onClick={generatePlan}>Generate Tax Plan</button>
      <pre>{plan}</pre>
    </div>
  );
};