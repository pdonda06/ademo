import React, { useState } from 'react';
import { Upload, Receipt, AlertCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import ExpenseForm from './ExpenseForm';
import { populateRandomExpense } from '../../data/demoExpenses';
import { expenseApi } from '../../services/api';

export default function ExpenseUpload({ onUploadComplete }) {
  const [mode, setMode] = useState(null); // 'upload' or 'form'
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    vendorName: '',
    gstNumber: '',
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    gstAmount: 0,
    category: '',
    description: '',
    customGstRate: 0,
    cgst: 0,
    sgst: 0,
    total: 0,
    gstRate: 0
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form data
      if (!formData.vendorName || !formData.amount || !formData.category) {
        throw new Error('Please fill in all required fields');
      }

      // Convert amount to number
      const expenseData = {
        ...formData,
        amount: Number(formData.amount),
        date: formData.date || new Date().toISOString().split('T')[0]
      };

      let data;
      if (mode === 'upload') {
        const formPayload = new FormData();
        formPayload.append('receipt', file);
        Object.entries(expenseData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formPayload.append(key, value);
          }
        });
        
        data = await expenseApi.upload(formPayload);
      } else {
        console.log('Submitting expense data:', expenseData);
        data = await expenseApi.create(expenseData);
      }

      toast.success(mode === 'upload' ? 'Receipt analyzed successfully' : 'Expense saved successfully');
      onUploadComplete(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoData = () => {
    setFormData(populateRandomExpense());
    toast.success('Demo data loaded');
  };

  if (!mode) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Add New Expense</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* <button
            onClick={() => setMode('upload')}
            className="p-6 border-2 border-dashed rounded-lg hover:border-primary hover:bg-primary/5 flex flex-col items-center"
          >
            <Receipt className="w-8 h-8 mb-2 text-primary" />
            <span className="font-medium">Upload Receipt</span>
            <span className="text-sm text-gray-500">Scan and analyze receipt automatically</span>
          </button> */}
          <button
            onClick={() => setMode('form')}
            className="p-6 border-2 border-dashed rounded-lg hover:border-primary hover:bg-primary/5 flex flex-col items-center"
          >
            <FileText className="w-8 h-8 mb-2 text-primary" />
            <span className="font-medium">Manual Entry</span>
            <span className="text-sm text-gray-500">Enter expense details manually</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">
          {mode === 'upload' ? 'Upload Receipt' : 'Manual Entry'}
        </h3>
        <button
          onClick={() => setMode(null)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Switch Mode
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {mode === 'upload' ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {preview ? (
              <div className="relative">
                <img src={preview} alt="Receipt preview" className="max-h-64 mx-auto" />
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Receipt className="w-12 h-12 mx-auto text-gray-400" />
                <div className="text-sm text-gray-600">
                  Drag and drop or click to upload receipt
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="receipt-upload"
                />
                <label
                  htmlFor="receipt-upload"
                  className="inline-block px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary/90"
                >
                  Select File
                </label>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <ExpenseForm 
              formData={formData}
              setFormData={setFormData}
              loading={loading}
            />
            <button
              type="button"
              onClick={handleDemoData}
              className="text-sm text-primary hover:text-primary/80"
            >
              Load Demo Data
            </button>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          {mode === 'upload' && (
            <div className="flex items-center text-sm text-gray-500">
              <AlertCircle className="w-4 h-4 mr-1" />
              Supports: JPG, PNG, PDF (max 5MB)
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50 flex items-center ml-auto"
          >
            {loading ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Save Expense'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
