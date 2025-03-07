import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../store/slices/authSlice';
import { authApi } from '../../services/api';
import toast from 'react-hot-toast';

const slogans = [
  "Smart Tax Management for Modern Businesses",
  "Simplify Your Tax Compliance",
  "Track, Plan, and Save on Taxes",
  "Your Business Tax Assistant",
  "Tax Efficiency Made Simple"
];

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [sloganIndex, setSloganIndex] = useState(0);

  useEffect(() => {
    const storedIndex = localStorage.getItem('sloganIndex');
    const nextIndex = storedIndex ? (parseInt(storedIndex) + 1) % slogans.length : 0;
    setSloganIndex(nextIndex);
    localStorage.setItem('sloganIndex', nextIndex);
  }, []);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await authApi.login(formData);
      dispatch(setAuth({
        user: response.user,
        company: response.company,
        token: response.token
      }));
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Login Form */}
      <div className="w-full md:w-[70%] flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-600">{slogans[sloganIndex]}</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary hover:text-primary/90">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Image/Illustration */}
      <div className="hidden md:block md:w-[30%] bg-primary">
        <div className="h-full flex items-center justify-center p-8">
          <div className="max-w-md text-white">
            <h2 className="text-3xl font-bold mb-6">Manage Your Business Taxes with Confidence</h2>
            <ul className="space-y-4">
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Track expenses and claims
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Real-time tax calculations
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Smart tax planning tools
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Compliance monitoring
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;