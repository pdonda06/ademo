import { useState } from 'react';
import { RefreshCw, Link2, AlertCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const alerts = [
  {
    id: 'tax_rate_change',
    title: 'New Tax Rate Change',
    description: 'Corporate tax rate changes effective from Q2 2024',
    date: '2024-03-15',
    impact: 'high',
  },
  {
    id: 'deduction_rules',
    title: 'Updated Deduction Rules',
    description: 'New guidelines for home office deductions',
    date: '2024-03-14',
    impact: 'medium',
  },
  {
    id: 'compliance',
    title: 'Compliance Update',
    description: 'Your business meets new regulatory requirements',
    date: '2024-03-13',
    impact: 'low',
  },
];

function TaxCalculator() {
  const [income, setIncome] = useState(75000);
  const [filingStatus, setFilingStatus] = useState('single');
  const [standardDeduction, setStandardDeduction] = useState(75000); // Updated Standard Deduction for India

  const taxSlabs = [
    { limit: 400000, rate: 0 },
    { limit: 800000, rate: 0.05 },
    { limit: 1200000, rate: 0.10 },
    { limit: 1600000, rate: 0.15 },
    { limit: 2000000, rate: 0.20 },
    { limit: 2400000, rate: 0.25 },
    { limit: Infinity, rate: 0.30 },
  ];

  const calculateTax = () => {
    const taxableIncome = Math.max(income - standardDeduction, 0);
    let tax = 0;
    let remainingIncome = taxableIncome;

    for (let i = 0; i < taxSlabs.length; i++) {
      const { limit, rate } = taxSlabs[i];
      const previousLimit = i === 0 ? 0 : taxSlabs[i - 1].limit;
      const incomeInSlab = Math.min(remainingIncome, limit - previousLimit);
      
      if (incomeInSlab > 0) {
        tax += incomeInSlab * rate;
        remainingIncome -= incomeInSlab;
      }

      if (remainingIncome <= 0) break;
    }

    return tax.toFixed(2);
  };

  const getAlertColor = (impact) => {
    switch (impact) {
      case 'high':
        return 'bg-yellow-50 border-yellow-200';
      case 'medium':
        return 'bg-blue-50 border-blue-200';
      case 'low':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const [integrations, setIntegrations] = useState([
    { id: '1', name: 'QuickBooks', status: 'connected', lastSync: '2024-03-15 14:30' },
    { id: '2', name: 'SBI Bank', status: 'disconnected' },
    { id: '3', name: 'Bank of India', status: 'connected', lastSync: '2024-03-15 15:45' },
    { id: '4', name: 'Chase Business', status: 'disconnected' },
    { id: '5', name: 'Odoo ERP', status: 'connected', lastSync: '2024-03-15 13:15' },
  ]);

  const handleConnect = (id) => {
    setIntegrations(prevIntegrations =>
      prevIntegrations.map(integration =>
        integration.id === id
          ? { ...integration, status: 'connected', lastSync: new Date().toLocaleString() }
          : integration
      )
    );
    toast.success('Integration connected successfully!');
  };

  const handleSync = (id) => {
    setIntegrations(prevIntegrations =>
      prevIntegrations.map(integration =>
        integration.id === id
          ? { ...integration, lastSync: new Date().toLocaleString() }
          : integration
      )
    );
    toast.success('Data synchronized successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Input Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Annual Income</label>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Filing Status</label>
                <select
                  value={filingStatus}
                  onChange={(e) => setFilingStatus(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                >
                  <option value="single">Single</option>
                  <option value="married">Married Filing Jointly</option>
                  <option value="head">Head of Household</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Standard Deduction</label>
                <input
                  type="number"
                  value={standardDeduction}
                  onChange={(e) => setStandardDeduction(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4 animate-pulse">Tax Calculation</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Estimated Tax:</span>
                <span className="font-medium text-gray-900">₹{calculateTax()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* <div className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Integrations</h2>
            {integrations.map((integration) => (
              <div key={integration.id} className="flex justify-between text-sm border-b py-2">
                <span>{integration.name}</span>
                <span className={integration.status === 'connected' ? 'text-green-500' : 'text-red-500'}>
                  {integration.status}
                </span>
              </div>
            ))}
          </div> */}

          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Alerts</h2>
            {alerts.map((alert) => (
              <div key={alert.id} className={`border-l-4 p-4 mb-4 ${getAlertColor(alert.impact)}`}>
                <h3 className="text-sm font-medium">{alert.title}</h3>
                <p className="text-sm text-gray-600">{alert.description}</p>
                <p className="text-xs text-gray-500">{alert.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Integrations Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Financial Integrations</h2>
            <p className="text-sm text-gray-600">Connect your financial accounts for automated tax data</p>
          </div>
          <button
            onClick={() => toast.success('Scanning for new integrations...')}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
          >
            <Link2 className="h-4 w-4" />
            Add New Integration
          </button>
        </div>

        <div className="space-y-4">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Link2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{integration.name}</h3>
                  {integration.lastSync && (
                    <p className="text-sm text-gray-500">Last synced: {integration.lastSync}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {integration.status === 'connected' ? (
                  <>
                    <button
                      onClick={() => handleSync(integration.id)}
                      className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Sync
                    </button>
                    <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                      <CheckCircle2 className="h-4 w-4" />
                      Connected
                    </span>
                  </>
                ) : (
                  <button
                    onClick={() => handleConnect(integration.id)}
                    className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary/90"
                  >
                    <Link2 className="h-4 w-4" />
                    Connect
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TaxCalculator;