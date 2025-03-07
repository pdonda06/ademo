import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Calculator, TrendingDown, AlertTriangle, Lightbulb } from 'lucide-react';
import { calculateTaxLiability, generateMonthlyProjections } from '../utils/taxCalculations';
import { generateRecommendations, calculateRiskScore } from '../utils/recommendations';
import TaxReport from '../components/TaxReport';

const mockData = [
  { month: 'Jan', baseline: 5000, optimized: 4200 },
  { month: 'Feb', baseline: 5200, optimized: 4300 },
  { month: 'Mar', baseline: 5400, optimized: 4400 },
  { month: 'Apr', baseline: 5600, optimized: 4500 },
];
const handleScenarioAnalysis = async () => {
  try {
    const scenarios = [
      { income: 150000, expenses: 50000, deductions: 20000 },
      { income: 160000, expenses: 55000, deductions: 22000 },
      { income: 140000, expenses: 45000, deductions: 18000 }
    ];

    const results = await api.post('/tax/scenario', { scenarios });
    setAnalysisResults(results.data);
  } catch (error) {
    console.error('Scenario analysis failed:', error);
  }
};
function TaxSimulation() {
  const [income, setIncome] = useState('150000');
  const [expenses, setExpenses] = useState('50000');
  const [deductions, setDeductions] = useState('20000');

  const calculations = useMemo(() => {
    return calculateTaxLiability(Number(income), Number(expenses), Number(deductions));
  }, [income, expenses, deductions]);

  const chartData = useMemo(() => {
    return generateMonthlyProjections(Number(income), Number(expenses), Number(deductions));
  }, [income, expenses, deductions]);

  const recommendations = useMemo(() => {
    return generateRecommendations(Number(income), Number(expenses), Number(deductions));
  }, [income, expenses, deductions]);

  const riskScore = useMemo(() => {
    return calculateRiskScore(Number(income), Number(expenses), Number(deductions));
  }, [income, expenses, deductions]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tax Simulation</h1>
          <p className="mt-1 text-sm text-gray-500">
            Simulate different tax scenarios and optimize your strategy
          </p>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">
          Save Simulation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-medium text-gray-900">Input Parameters</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Annual Income</label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Business Expenses</label>
              <input
                type="number"
                value={expenses}
                onChange={(e) => setExpenses(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Deductions</label>
              <input
                type="number"
                value={deductions}
                onChange={(e) => setDeductions(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Tax Liability Projection</h3>
          <LineChart width={600} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="baseline" stroke="#94a3b8" name="Baseline" />
            <Line type="monotone" dataKey="optimized" stroke="#2563eb" name="Optimized" />
          </LineChart>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <TaxReport calculations={calculations} />
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Assessment</h3>
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={riskScore > 50 ? "#EF4444" : "#10B981"}
                  strokeWidth="3"
                  strokeDasharray={`${riskScore}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-semibold">{riskScore}%</span>
              </div>
            </div>
            <div>
              <h4 className="font-medium">Risk Score</h4>
              <p className="text-sm text-gray-500">
                Based on your tax profile and deductions
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h3>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.title} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <Lightbulb className="w-5 h-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium">{rec.title}</h4>
                <p className="text-sm text-gray-500">{rec.description}</p>
                <span className="inline-block mt-2 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                  Impact: {rec.impact}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-medium text-gray-900">Potential Savings</h3>
          </div>
          <p className="text-2xl font-semibold text-green-600">
            £{Math.round(calculations.taxLiability).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">Effective tax rate: {calculations.effectiveRate.toFixed(1)}%</p>
        </div>
        {['Risk Analysis', 'Recommendations'].map((title) => (
          <div key={title} className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500">
              Analysis and insights will appear here based on your simulation parameters.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaxSimulation;
