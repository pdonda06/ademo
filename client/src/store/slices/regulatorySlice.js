import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  alerts: [],
  updates: [],
  isLoading: false,
  error: null,
};

const regulatorySlice = createSlice({
  name: 'regulatory',
  initialState,
  reducers: {
    setAlerts: (state, action) => {
      state.alerts = action.payload;
    },
    addAlert: (state, action) => {
      state.alerts.push(action.payload);
    },
    dismissAlert: (state, action) => {
      state.alerts = state.alerts.filter(alert => alert.id !== action.payload);
    },
    setUpdates: (state, action) => {
      state.updates = action.payload;
    },
  },
});

export const { setAlerts, addAlert, dismissAlert, setUpdates } = regulatorySlice.actions;
export default regulatorySlice.reducer;
