import api from './api';
import axios from 'axios';
export const taxAssistantApi = {
  analyze: async (financialData) => {
    const response = await api.post('/tax-assistant/analyze', financialData);
    return response.data;
  },

  optimizeSalary: async (data) => {
    const response = await api.post('/tax-assistant/optimize-salary', {
      annualSalary: Number(data.annualSalary),
      location: data.location || 'metro',
      haveHRA: data.haveHRA ?? true
    });
    return response.data;
  },

  simulateScenario: async (scenario) => {
    const response = await api.post('/tax-assistant/analyze-scenario', scenario);
    return response.data;
  },

  getTaxSavingStrategies: async (profile) => {
    const response = await api.post('/tax-assistant/strategies', profile);
    return response.data;
  },

  chat: async (message) => {
    const response = await api.post('/tax-assistant/chat', { message });
    return response.data;
  },

  analyzeBusinessStructure: async (data) => {
    const response = await api.post('/tax-assistant/analyze-business', data);
    return response.data;
  }
};

export default taxAssistantApi;
