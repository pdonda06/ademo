import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import taxReducer from './slices/taxSlice';
import expenseReducer from './slices/expenseSlice';
import regulatoryReducer from './slices/regulatorySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tax: taxReducer,
    expenses: expenseReducer,
    regulatory: regulatoryReducer,
  },
});
