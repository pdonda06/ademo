import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { expenseApi } from '../services/api';

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({
    totalExpenses: 0,
    totalDeductible: 0,
    totalGST: 0,
    categoryWise: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { expenses, summary } = await expenseApi.getExpenses();
      setExpenses(expenses);
      setSummary(summary);
    } catch (error) {
      console.error('Dashboard data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Calculate month-wise expense data
  const monthlyData = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {});

  const chartData = Object.entries(monthlyData).map(([month, amount]) => ({
    month,
    amount
  }));

  const metrics = [
    {
      name: 'Total Expenses',
      value: formatAmount(summary.totalExpenses),
      change: '12%',
      trend: 'up',
    },
    {
      name: 'Tax Deductions',
      value: formatAmount(summary.totalDeductible),
      change: `${((summary.totalDeductible / summary.totalExpenses) * 100).toFixed(1)}%`,
      trend: 'up',
    },
    {
      name: 'Total GST',
      value: formatAmount(summary.totalGST),
      change: `${((summary.totalGST / summary.totalExpenses) * 100).toFixed(1)}%`,
      trend: 'up',
    },
  ];

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <div
            key={metric.name}
            className="p-6 bg-white rounded-lg shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">
                {metric.name}
              </h3>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className="mt-2 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {metric.value}
              </p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {metric.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {metric.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Monthly Expenses
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatAmount(value)} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Category-wise Breakdown
          </h3>
          <div className="space-y-4">
            {summary.categoryWise.map((cat) => (
              <div key={cat.category} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{cat.category}</span>
                <div className="text-right">
                  <div className="font-medium">{formatAmount(cat.total)}</div>
                  <div className="text-xs text-gray-500">
                    {cat.count} transactions
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
