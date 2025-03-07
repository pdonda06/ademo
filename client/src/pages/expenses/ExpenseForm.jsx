import React from 'react';
import { Calendar } from 'lucide-react';

const GST_RATES = {
  'IT and Software': 18,
  'Office Supplies': 18,
  'Professional Services': 18,
  'Travel and Conveyance': 5,
  'Rent and Utilities': 18,
  'Marketing': 18,
  'Other': null
};

const formatAmount = (value) => {
  const num = Number(value);
  return isNaN(num) ? '0.00' : num.toFixed(2);
};

export default function ExpenseForm({ formData, setFormData, loading }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      updateGSTAmount(Number(value) || 0, formData.category, formData.customGstRate);
    } else if (name === 'category') {
      const rate = GST_RATES[value];
      updateGSTAmount(Number(formData.amount) || 0, value, rate);
    } else if (name === 'customGstRate') {
      updateGSTAmount(Number(formData.amount) || 0, formData.category, Number(value) || 0);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const updateGSTAmount = (amount, category, customRate = null) => {
    const rate = category === 'Other' ? (customRate || 0) : GST_RATES[category] || 0;
    const gstAmount = (amount * rate) / 100;
    const total = amount + gstAmount;

    setFormData(prev => ({
      ...prev,
      amount: amount,
      category: category,
      customGstRate: category === 'Other' ? customRate : null,
      gstAmount: gstAmount,
      gstRate: rate,
      total: total,
      cgst: gstAmount / 2,
      sgst: gstAmount / 2
    }));
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Vendor Name</label>
          <input
            type="text"
            name="vendorName"
            value={formData.vendorName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">GST Number</label>
          <input
            type="text"
            name="gstNumber"
            value={formData.gstNumber}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
            placeholder="e.g., 27AABCT3518Q1Z2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
          <input
            type="text"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <div className="relative mt-1">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              required
            />
            <Calendar className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Base Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">GST Amount</label>
            <input
              type="number"
              name="gstAmount"
              value={formData.gstAmount}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            required
          >
            <option value="">Select category</option>
            {Object.keys(GST_RATES).map(category => (
              <option key={category} value={category}>
                {category} {GST_RATES[category] ? `(${GST_RATES[category]}% GST)` : ''}
              </option>
            ))}
          </select>
        </div>

        {formData.category === 'Other' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Custom GST Rate (%)</label>
            <input
              type="number"
              name="customGstRate"
              value={formData.customGstRate || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              min="0"
              max="28"
              step="0.1"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">CGST</label>
            <input
              type="text"
              value={formatAmount(formData.cgst)}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">SGST</label>
            <input
              type="text"
              value={formatAmount(formData.sgst)}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Total Amount</label>
          <input
            type="text"
            value={formatAmount(formData.total)}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 font-medium shadow-sm sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
}
