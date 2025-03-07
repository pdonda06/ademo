import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  calculations: null,
  history: [],
  isLoading: false,
  error: null,
};

const taxSlice = createSlice({
  name: 'tax',
  initialState,
  reducers: {
    calculateTaxStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    calculateTaxSuccess: (state, action) => {
      state.isLoading = false;
      state.calculations = action.payload;
      state.history.push({
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    calculateTaxFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearCalculations: (state) => {
      state.calculations = null;
    },
  },
});

export const {
  calculateTaxStart,
  calculateTaxSuccess,
  calculateTaxFailure,
  clearCalculations,
} = taxSlice.actions;
export default taxSlice.reducer;
