export const demoExpenses = [
  {
    vendorName: 'Swiggy Business',
    gstNumber: '06AADCS1234H1ZP',
    invoiceNumber: 'SWIBC/23-24/1234',
    date: '2024-02-20',
    amount: '2499.00',
    gstAmount: '449.82',
    category: 'Professional Services',
    description: 'Team Lunch - Client Meeting'
  },
  {
    vendorName: 'Microsoft India',
    gstNumber: '27AAACM7257A1ZV',
    invoiceNumber: 'MSFT/2024/45678',
    date: '2024-02-18',
    amount: '14999.00',
    gstAmount: '2699.82',
    category: 'IT and Software',
    description: 'Microsoft 365 Business Premium Annual'
  }
];

export const populateRandomExpense = () => {
  return demoExpenses[Math.floor(Math.random() * demoExpenses.length)];
};
