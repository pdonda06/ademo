import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  expenses: [],
  isLoading: false,
  error: null,
};

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action) => {
      state.expenses.push(action.payload);
    },
    updateExpense: (state, action) => {
      const index = state.expenses.findIndex(exp => exp.id === action.payload.id);
      if (index !== -1) {
        state.expenses[index] = action.payload;
      }
    },
    deleteExpense: (state, action) => {
      state.expenses = state.expenses.filter(exp => exp.id !== action.payload);
    },
    setExpenses: (state, action) => {
      state.expenses = action.payload;
    },
  },
});

export const { addExpense, updateExpense, deleteExpense, setExpenses } = expenseSlice.actions;
export default expenseSlice.reducer;
