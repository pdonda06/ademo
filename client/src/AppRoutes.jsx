import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authApi } from './services/api';
import { setAuth, logout, setLoading } from './store/slices/authSlice';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Dashboard from './pages/Dashboard';
import TaxCalculator from './pages/TaxCalculator';
import Expenses from './pages/Expenses';
import Planning from './pages/Planning';
import Documents from './pages/Documents';
import TaxAssistant from './pages/TaxAssistant';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ExpenseDashboard from './pages/ExpenseDashboard';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Landing from './pages/Landing';

// Components
import PrivateRoute from './components/auth/PrivateRoute';

function AppRoutes() {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        dispatch(setLoading(true));
        try {
          const response = await authApi.getProfile();
          dispatch(setAuth({
            user: response.user,
            company: response.company,
            token
          }));
        } catch (error) {
          console.error('Auto-login failed:', error);
          dispatch(logout());
        } finally {
          dispatch(setLoading(false));
        }
      } else {
        dispatch(setLoading(false));
      }
    };

    initializeAuth();
  }, [dispatch]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calculator" element={<TaxCalculator />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/assistant" element={<TaxAssistant />} />
          <Route path="/expense-dashboard" element={<ExpenseDashboard />} />
          <Route path="/settings" element={<Settings/>} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
