import { Download } from 'lucide-react';

function TaxReport({ calculations }) {
  const {
    taxableIncome,
    taxLiability,
    effectiveRate
  } = calculations;

  const reportItems = [
    { label: 'Taxable Income', value: `£${Math.round(taxableIncome).toLocaleString()}` },
    { label: 'Tax Liability', value: `£${Math.round(taxLiability).toLocaleString()}` },
    { label: 'Effective Tax Rate', value: `${effectiveRate.toFixed(1)}%` },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Tax Report</h3>
        <button className="flex items-center gap-2 text-sm text-primary hover:text-primary/90">
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </div>
      <div className="space-y-4">
        {reportItems.map(({ label, value }) => (
          <div key={label} className="flex justify-between py-2 border-b">
            <span className="text-gray-600">{label}</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaxReport;
