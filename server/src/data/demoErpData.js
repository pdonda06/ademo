export const demoAccounts = [
  { code: '1000', name: 'Cash' },
  { code: '1100', name: 'Accounts Receivable' },
  { code: '2000', name: 'Accounts Payable' },
  { code: '4000', name: 'Sales Revenue' },
  { code: '5000', name: 'Cost of Goods Sold' },
  { code: '6000', name: 'Operating Expenses' }
];

export const demoTransactions = [
  {
    id: 'T001',
    date: '2024-01-15',
    description: 'Office supplies and printer paper',
    amount: 456.78,
    account: '6000',
    reference: 'INV-2024-001',
    vendor: 'Staples',
    taxCode: 'STD',
    lineItems: [
      { description: 'Printer Paper', amount: 89.99, quantity: 2 },
      { description: 'Ink Cartridges', amount: 276.80, quantity: 4 }
    ]
  },
  {
    id: 'T002',
    date: '2024-01-16',
    description: 'Uber ride to client meeting',
    amount: 45.50,
    account: '6000',
    reference: 'INV-2024-002',
    vendor: 'Uber',
    taxCode: 'STD'
  },
  {
    id: 'T003',
    date: '2024-01-17',
    description: 'Software subscription - Annual',
    amount: 599.99,
    account: '6000',
    reference: 'INV-2024-003',
    vendor: 'Adobe',
    taxCode: 'STD'
  }
];

export const demoVendors = [
  {
    id: 'V001',
    name: 'Staples',
    taxId: '123456789',
    category: 'Office Supplies',
    paymentTerms: 'NET30'
  },
  // Add more vendors...
];

export const demoTaxCodes = [
  {
    code: 'STD',
    description: 'Standard Rate',
    rate: 0.20,
    category: 'VAT'
  },
  // Add more tax codes...
];
