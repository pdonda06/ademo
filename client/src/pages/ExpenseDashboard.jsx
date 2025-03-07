import React, { useState, useEffect } from 'react';
import { erpApi } from '../services/api';
import { LineChart, PieChart, DollarSign, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ExpenseDashboard() {
  const [balances, setBalances] = useState([]);
  const [taxReport, setTaxReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [balancesData, taxData] = await Promise.all([
        erpApi.getBalances(),
        erpApi.getTaxReport()
      ]);
      setBalances(balancesData);
      setTaxReport(taxData);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Expense Dashboard</h1>
      
      {/* Account Balances */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {balances.map(account => (
          <div key={account.code} className="p-4 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{account.name}</h3>
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold mt-2">
              ${account.balance.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Tax Summary */}
      {taxReport && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Tax Summary</h2>
          <div className="space-y-4">
            {Object.entries(taxReport.summary).map(([code, amount]) => (
              <div key={code} className="flex justify-between items-center">
                <span className="text-gray-600">{code}</span>
                <span className="font-medium">${amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
