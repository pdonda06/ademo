import React from 'react';
import { format } from 'date-fns';

export default function ExpenseList({ transactions }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tax Code</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {format(new Date(transaction.date), 'MMM d, yyyy')}
              </td>
              <td className="px-6 py-4">{transaction.description}</td>
              <td className="px-6 py-4">{transaction.aiClassification?.category}</td>
              <td className="px-6 py-4">${transaction.amount.toFixed(2)}</td>
              <td className="px-6 py-4">{transaction.taxCode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
