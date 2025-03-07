import { 
  demoAccounts, 
  demoTransactions, 
  demoVendors, 
  demoTaxCodes 
} from '../data/demoErpData.js';
import ErpSync from '../models/erpSync.js';
import { classifyTransaction } from './expenseClassifier.js';

const TEST_USER_ID = '65bf631dc5b35d8d259a81c1'; // Add a default test user ID

export async function syncErpData(userId = TEST_USER_ID) {
  try {
    // Simulate ERP sync delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Process transactions and classify them
    const processedTransactions = await Promise.all(
      demoTransactions.map(async (transaction) => {
        const classification = await classifyTransaction(transaction.description, transaction.vendor);
        return {
          ...transaction,
          aiClassification: classification
        };
      })
    );

    // Create sync record
    const syncRecord = new ErpSync({
      userId,
      lastSyncDate: new Date(),
      dataSource: 'DEMO',
      syncStatus: 'SUCCESS',
      syncedRecords: {
        transactions: processedTransactions.length,
        accounts: demoAccounts.length,
        vendors: demoVendors.length
      }
    });

    await syncRecord.save();

    return {
      accounts: demoAccounts,
      transactions: processedTransactions,
      vendors: demoVendors,
      taxCodes: demoTaxCodes,
      syncRecord
    };
  } catch (error) {
    console.error('ERP sync error:', error);
    throw new Error('Failed to sync ERP data');
  }
}

export function getAccountBalance(accountCode, transactions) {
  return transactions
    .filter(t => t.account === accountCode)
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getTaxSummary(transactions, taxCodes) {
  return transactions.reduce((summary, t) => {
    const taxCode = taxCodes.find(tc => tc.code === t.taxCode);
    if (!taxCode) return summary;
    
    const taxAmount = t.amount * taxCode.rate;
    return {
      ...summary,
      [taxCode.code]: (summary[taxCode.code] || 0) + taxAmount
    };
  }, {});
}
