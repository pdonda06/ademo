import { useState, useEffect } from 'react';
import { Plus, ArrowRight, RefreshCw, Edit2, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Demo financial data
const demoData = {
  businessType: 'Software Services', // Try different business types
  income: 2500000, // Try different income levels
  expenses: 1200000,
  deductions: 35000,
  employeeCount: 40,
  assets: {
    property: 800000,
    equipment: 300000,
    inventory: 100000,
    cashAndBank: 500000,
    investments: 400000
  }
};

const mockStrategies = [
  {
    id: 1,
    title: 'Pension Optimization',
    description: 'Maximize pension contributions for tax relief',
    status: 'active',
    savings: 2500,
  },
  {
    id: 2,
    title: 'Business Expense Review',
    description: 'Identify and categorize all allowable expenses',
    status: 'pending',
    savings: 1800,
  },
  {
    id: 3,
    title: 'Investment Planning',
    description: 'Structure investments for tax efficiency',
    status: 'completed',
    savings: 3200,
  },
];

function Planning() {
  const navigate = useNavigate();
  const [financialData, setFinancialData] = useState(demoData);
  const [taxStrategy, setTaxStrategy] = useState(null);
  const [regimeComparison, setRegimeComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [strategies] = useState(mockStrategies);
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(demoData);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const generateTaxPlan = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const [strategyRes, regimeRes, aiRes] = await Promise.all([
        api.post('/tax/generate-strategy', financialData),
        api.post('/tax/compare-regimes', {
          income: financialData.income,
          deductions: financialData.deductions
        }),
        api.post('/tax/ai-recommendations', financialData)
      ]);
      
      setTaxStrategy(strategyRes.data.strategy);
      setRegimeComparison(regimeRes.data);
      setAiRecommendations(aiRes.data);
    } catch (error) {
      console.error('Failed to generate tax plan:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDataChange = (key, value, isAsset = false) => {
    if (isAsset) {
      setEditedData(prev => ({
        ...prev,
        assets: { ...prev.assets, [key]: Number(value) }
      }));
    } else {
      setEditedData(prev => ({ ...prev, [key]: Number(value) }));
    }
  };

  const handleSaveData = () => {
    setFinancialData(editedData);
    setIsEditing(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">AI Tax Planning</h1>
        <button
          onClick={generateTaxPlan}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg"
        >
          {loading ? (
            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Plus className="w-5 h-5 mr-2" />
          )}
          Generate Tax Plan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Overview */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Business Financial Data</h2>
            <button
              onClick={() => isEditing ? handleSaveData() : setIsEditing(true)}
              className="flex items-center gap-2 text-sm text-primary"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  Save
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  Edit
                </>
              )}
            </button>
          </div>

          <div className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Type</label>
                  <input
                    type="text"
                    value={editedData.businessType}
                    onChange={(e) => handleDataChange('businessType', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Annual Income</label>
                  <input
                    type="number"
                    value={editedData.income}
                    onChange={(e) => handleDataChange('income', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Expenses</label>
                  <input
                    type="number"
                    value={editedData.expenses}
                    onChange={(e) => handleDataChange('expenses', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Deductions</label>
                  <input
                    type="number"
                    value={editedData.deductions}
                    onChange={(e) => handleDataChange('deductions', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Employee Count</label>
                  <input
                    type="number"
                    value={editedData.employeeCount}
                    onChange={(e) => handleDataChange('employeeCount', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assets</label>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(editedData.assets).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-xs text-gray-500 capitalize">{key}</label>
                        <input
                          type="number"
                          value={value}
                          onChange={(e) => handleDataChange(key, e.target.value, true)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              // Existing view mode display
              <>
                {Object.entries(financialData).map(([key, value]) => (
                  key !== 'assets' && (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="font-medium">
                        {typeof value === 'number' ? `₹${value.toLocaleString()}` : value}
                      </span>
                    </div>
                  )
                ))}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Assets</h3>
                  <div className="space-y-2">
                    {Object.entries(financialData.assets).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-600 capitalize">{key}</span>
                        <span className="font-medium">₹{value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Tax Regime Comparison */}
        {regimeComparison && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Tax Regime Comparison</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium">Old Regime</h3>
                  <p className="text-2xl font-bold">₹{regimeComparison.oldRegime.totalTax.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium">New Regime</h3>
                  <p className="text-2xl font-bold">₹{regimeComparison.newRegime.totalTax.toLocaleString()}</p>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-800">
                  Recommended: {regimeComparison.recommendation}
                </p>
                <p className="text-sm text-blue-600">
                  Potential Savings: ₹{regimeComparison.potentialSavings.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Recommendations Section */}
      {aiRecommendations && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">AI Tax Recommendations</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">AI Confidence</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                {aiRecommendations.aiConfidenceScore}%
              </span>
            </div>
          </div>

          {aiRecommendations.recommendations.map((category, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="text-md font-medium mb-3">{category.category}</h3>
              <div className="grid gap-4">
                {category.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.impact === 'High' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.impact} Impact
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-green-600">
                      Potential Savings: ₹{item.potentialSavings.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Total Potential Savings</span>
              <span className="text-xl font-bold text-green-600">
                ₹{aiRecommendations.totalPotentialSavings.toLocaleString()}
              </span>
            </div>

            {/* Custom Insights */}
            <div className="mt-4">
              <h3 className="text-md font-medium mb-3">Custom Insights</h3>
              <div className="space-y-3">
                {aiRecommendations.customInsights.map((insight, idx) => (
                  <div key={idx} className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium text-sm">{insight.title}</span>
                      <span className="text-xs text-blue-600">{insight.confidence}% confidence</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{insight.insight}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Generated Tax Strategy */}
      {/* {taxStrategy && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">AI-Generated Tax Strategy</h2>
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: taxStrategy.replace(/\n/g, '<br/>') }} />
          </div>
        </div>
      )} */}

      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-4">
            {strategies.map((strategy) => (
              <div
                key={strategy.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {strategy.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {strategy.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(strategy.status)}`}>
                      {getStatusText(strategy.status)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Potential savings: £{strategy.savings.toLocaleString()}
                    </span>
                  </div>
                </div>
                <button className="ml-4 p-2 text-gray-400 hover:text-primary">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {['Annual Review', 'Risk Analysis', 'Action Items'].map((title) => (
          <div key={title} className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500">
              More details will be available soon.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Planning;
