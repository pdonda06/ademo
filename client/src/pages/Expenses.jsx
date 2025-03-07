import { useState, useEffect } from 'react';
import { Plus, Filter, Download } from 'lucide-react';
import ExpenseUpload from './expenses/ExpenseUpload';
import { expenseApi } from '../services/api';
import toast from 'react-hot-toast';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: '',
    isDeductible: ''
  });
  const [gstCredits, setGstCredits] = useState([]);

  useEffect(() => {
    const fetchCredits = async () => {
      const response = await expenseApi.getGstCredits();
      setGstCredits(response.data);
    };
    fetchCredits();
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [filters]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(
        Object.entries(filters)
          .filter(([_, v]) => v !== null && v !== undefined && v !== '')
      );
      
      const { expenses = [], summary = {} } = await expenseApi.getExpenses(queryParams);
      setExpenses(expenses);
      setSummary(summary);
    } catch (error) {
      console.error('Load expenses error:', error);
      toast.error('Failed to load expenses');
      setExpenses([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount) => {
    return typeof amount === 'number' ? 
      amount.toFixed(2) : 
      '0.00';
  };

  const handleFilter = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleExport = () => {
    const csv = expenses.map(expense => ({
      Date: new Date(expense.date).toLocaleDateString(),
      Vendor: expense.vendorName,
      Description: expense.description,
      Amount: expense.amount,
      GST: expense.gstAmount,
      Category: expense.category,
      Deductible: expense.isDeductible ? 'Yes' : 'No',
      'Tax Section': expense.taxSection
    }));

    const csvString = [
      Object.keys(csv[0]).join(','),
      ...csv.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Expenses</h1>
          {summary && (
            <div className="mt-2 text-sm text-gray-600">
              Total: ₹{formatAmount(summary.totalExpenses)} | 
              Deductible: ₹{formatAmount(summary.totalDeductible)} |
              GST: ₹{formatAmount(summary.totalGST)}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </button>
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex gap-4 bg-white p-4 rounded-lg">
        {/* ...existing filter UI... */}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <ExpenseUpload 
          onUploadComplete={(data) => {
            setExpenses(prev => [data.transaction, ...prev]);
            setShowUpload(false);
            loadExpenses(); // Refresh summary
          }} 
        />
      )}

      {/* Expenses List */}
      <div className="grid gap-6">
        {loading ? (
          <div>Loading...</div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No expenses found. Add your first expense!
          </div>
        ) : (
          expenses.map((expense) => (
            <div
              key={expense._id}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{expense.description}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(expense.date).toLocaleDateString()} • {expense.vendorName}
                  </div>
                  {expense.gstNumber && (
                    <div className="text-xs text-gray-400">
                      GST: {expense.gstNumber}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-medium">₹{expense.amount.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">{expense.category}</div>
                  <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1
                    ${expense.isDeductible ? 
                      'bg-green-100 text-green-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                    {expense.isDeductible ? 
                      `Deductible (${expense.taxSection})` : 
                      'Non-deductible'}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}