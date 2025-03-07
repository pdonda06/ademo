import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));
const company = JSON.parse(localStorage.getItem('company'));

const initialState = {
  user: user,
  company: company,
  token: token,
  isAuthenticated: !!token && !!user,
  loading: true
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { user, company, token } = action.payload;
      state.user = user;
      state.company = company;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('company', JSON.stringify(company));
      localStorage.setItem('token', token);
    },
    logout: (state) => {
      state.user = null;
      state.company = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('company');
      localStorage.removeItem('token');
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const { setAuth, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
