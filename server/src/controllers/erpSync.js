import { syncErpData, getAccountBalance, getTaxSummary } from '../services/erpService.js';

const TEST_USER_ID = '65bf631dc5b35d8d259a81c1';

export const syncData = async (req, res) => {
  try {
    const data = await syncErpData(TEST_USER_ID);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBalances = async (req, res) => {
  try {
    const { accounts, transactions } = await syncErpData(TEST_USER_ID);
    
    const balances = accounts.map(account => ({
      ...account,
      balance: getAccountBalance(account.code, transactions)
    }));

    res.json(balances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTaxReport = async (req, res) => {
  try {
    const { transactions, taxCodes } = await syncErpData(TEST_USER_ID);
    const taxSummary = getTaxSummary(transactions, taxCodes);
    
    res.json({
      summary: taxSummary,
      details: transactions.map(t => ({
        ...t,
        taxAmount: t.amount * (taxCodes.find(tc => tc.code === t.taxCode)?.rate || 0)
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
