import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Smartphone, Lock, Briefcase } from 'lucide-react';
import api from '../../api.js';
import { useToast } from '../../components/ui/use-toast.js';
import { Toaster } from '../../components/ui/toaster';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    userType: 'customer',
    categoryId: '',
    rate:0,
    location:''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch categories when component mounts or when userType changes to provider
  useEffect(() => {
    if (formData.userType === 'provider') {
      fetchCategories();
    }
  }, [formData.userType]);

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await api.get('/categories');
      setCategories(response.data.categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      toast({
        title: "Error",
        description: "Failed to load service categories",
        variant: "destructive",
      });
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value,
      // Reset categoryId when switching from provider to customer
      ...(name === 'userType' && value === 'customer' && { categoryId: '' })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Format phone number by removing spaces
      const formattedPhone = formData.phone.replace(/\s+/g, '');

      // Create FormData object
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('phone', formattedPhone);
      formDataObj.append('password', formData.password);
      formDataObj.append('userType', formData.userType);
      formDataObj.append('rate', formData.rate);
      formDataObj.append('location', formData.location);
      
      if (formData.userType === 'provider' && formData.categoryId) {
        formDataObj.append('categoryId', formData.categoryId);
      }

      // Send registration request to Laravel backend
      const response = await api.post('/register', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Show success notification
      toast({
        title: "Registration successful",
        description: "Your account has been created!",
      });

      // Redirect to login page after a brief delay
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      toast({
        title: "Registration failed",
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
      <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              name="name"
              type="text"
              className="w-full pl-10 border rounded-md p-2"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <div className="relative">
            <Smartphone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              name="phone"
              type="tel"
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
              name="password"
              type="password"
              className="w-full pl-10 border rounded-md p-2"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">I want to:</label>
          <select
            name="userType"
            className="w-full border rounded-md p-2"
            value={formData.userType}
            onChange={handleChange}
          >
            <option value="customer">Find Services</option>
            <option value="provider">Offer Services</option>
          </select>
        </div>

        {formData.userType === 'provider' && (
          <div>
            <label className="block text-sm font-medium mb-1">Service Category</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                name="categoryId"
                className="w-full pl-10 border rounded-md p-2"
                value={formData.categoryId}
                onChange={handleChange}
                required={formData.userType === 'provider'}
                disabled={categoriesLoading}
              >
                <option value="">
                  {categoriesLoading ? "Loading categories..." : "Select your service category"}
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            {categoriesLoading && (
              <p className="text-xs text-gray-500 mt-1">Loading service categories...</p>
            )}
            <label className="block text-sm font-medium mb-1">Your Hourly rate ?</label>
            <input type="number" name="rate" id="rate" placeholder='hourly rate'  value={formData.rate} onChange={handleChange}/>
            <label className="block text-sm font-medium mb-1">Your Address</label>
            <textarea name="location" id="location" placeholder='type tour location here ...' value={formData.location} onChange={handleChange} />
          </div>
        )}

        <button
          type="submit"
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
            'Register'
          )}
        </button>

        <div className="text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}