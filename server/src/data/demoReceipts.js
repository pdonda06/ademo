export const demoReceipts = [
  {
    id: 'RCP001',
    vendorName: 'Reliance Digital',
    gstNumber: '27AABCT3518Q1Z2',
    date: '2024-02-15',
    amount: 45999.00,
    cgst: 4140.00,
    sgst: 4140.00,
    total: 54279.00,
    items: [
      {
        description: 'HP Laptop 15s',
        hsn: '847130',
        quantity: 1,
        rate: 45999.00,
        amount: 45999.00
      }
    ],
    category: 'IT and Software',
    isITCEligible: true,
    paymentMode: 'Card'
  },
  {
    id: 'RCP002',
    vendorName: 'Uber India',
    date: '2024-02-16',
    amount: 450.00,
    cgst: 40.50,
    sgst: 40.50,
    total: 531.00,
    description: 'Trip to Client Meeting - Mumbai',
    category: 'Travel and Conveyance',
    isITCEligible: true,
    paymentMode: 'UPI'
  },
  // Add more demo receipts...
];

export const receiptTemplates = {
  retail: `
    RELIANCE DIGITAL
    Store: Mumbai Central
    GSTIN: 27AABCT3518Q1Z2
    Tax Invoice
    --------------------------------
    Date: {{date}}
    Invoice No: {{invoiceNo}}
    --------------------------------
    {{items}}
    --------------------------------
    Subtotal:     ₹{{subtotal}}
    CGST @9%:     ₹{{cgst}}
    SGST @9%:     ₹{{sgst}}
    --------------------------------
    Total:        ₹{{total}}
    --------------------------------
    Payment Mode: {{paymentMode}}
    Thank you for shopping!
  `,
  // Add more templates...
};
