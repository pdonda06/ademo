import React from 'react';
import { erpApi } from '../services/api';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ERPSync({ onSyncComplete }) {
  const [syncing, setSyncing] = React.useState(false);

  const handleSync = async () => {
    try {
      setSyncing(true);
      const result = await erpApi.sync();
      toast.success('Data synchronized successfully');
      if (onSyncComplete) onSyncComplete(result);
    } catch (error) {
      toast.error('Failed to sync data');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <button
      onClick={handleSync}
      disabled={syncing}
      className={`flex items-center px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 ${
        syncing ? 'cursor-not-allowed' : ''
      }`}
    >
      <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
      {syncing ? 'Syncing...' : 'Sync ERP Data'}
    </button>
  );
}
