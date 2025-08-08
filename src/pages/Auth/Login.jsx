import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Smartphone } from 'lucide-react';
import api from '../../api.js';
import { useToast } from '../../components/ui/use-toast.js';
import { Toaster } from '../../components/ui/toaster';

export default function LoginPage() {
  // Form state
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // Format phone number by removing spaces
      const formattedPhone = formData.phone.replace(/\s+/g, '');
      
      // Send login request to Laravel backend
      const response = await api.post('/login', {
        phone: formattedPhone,
        password: formData.password
      });

      // Store the token and user data
      localStorage.setItem('access_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Show success notification
      toast({
        title: "Login successful",
        description: "You are now logged in!",
      });

      // Redirect after a brief delay for better UX
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <Toaster />
      <h2 className="text-2xl font-bold text-center mb-6">Login to gJs</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <div className="relative">
            <Smartphone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="tel"
              name="phone"
              placeholder="+212612345678"
              className="w-full pl-10 border rounded-md p-2"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="^\+212[0-9]{9}$"
              title="Moroccan phone format: +212612345678"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Format: +212612345678 (no spaces)</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full pl-10 border rounded-md p-2"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex justify-center items-center disabled:opacity-70"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Login'
          )}
        </button>

        <div className="text-center text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}