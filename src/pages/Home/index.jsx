import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Hammer, Zap, Sparkles, ChevronLeft, ChevronRight, CheckCircle, Star } from 'lucide-react';
import api from '../../api';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data.categories);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  };

  function SampleNextArrow(props) {
    const { onClick } = props;
    return (
      <button 
        onClick={onClick}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button>
    );
  }

  function SamplePrevArrow(props) {
    const { onClick } = props;
    return (
      <button 
        onClick={onClick}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>
    );
  }

  // Default icons for categories
  const categoryIcons = {
    plumbing: <Hammer className="w-6 h-6" />,
    electrical: <Zap className="w-6 h-6" />,
    cleaning: <Sparkles className="w-6 h-6" />,
    painting: <Zap className="w-6 h-6" />,
    carpentry: <Hammer className="w-6 h-6" />,
    gardening: <Sparkles className="w-6 h-6" />,
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-gray-50">
      {/* Hero Slider Section */}
      <section className="relative">
        <Slider {...sliderSettings} className="overflow-hidden">
          {/* Slide 1 */}
          <div className="relative h-96 md:h-[500px]">
            <div className="absolute inset-0 bg-blue-900/70 flex items-center">
              <div className="container mx-auto px-6 text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Trusted Professionals</h1>
                <p className="text-xl mb-8 max-w-2xl">Connect with skilled service providers for all your home needs</p>
                <Link 
                  to="/services" 
                  className="inline-block bg-white text-blue-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
                >
                  Browse Services
                </Link>
              </div>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="Home services" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Slide 2 */}
          <div className="relative h-96 md:h-[500px]">
            <div className="absolute inset-0 bg-green-900/70 flex items-center">
              <div className="container mx-auto px-6 text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Quality Services Guaranteed</h1>
                <p className="text-xl mb-8 max-w-2xl">We verify all professionals to ensure you get the best service</p>
                <Link 
                  to="/how-it-works" 
                  className="inline-block bg-white text-green-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
                >
                  Learn How It Works
                </Link>
              </div>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="Quality services" 
              className="w-full h-full object-cover"
            />
          </div>
        </Slider>
      </section>

      {/* Search Bar Section */}
      <section className="container mx-auto px-4 -mt-10 z-10 relative">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">What service do you need?</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search for services..." 
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Professional services for all your needs
          </p>
        </div>
        
        {/* Residential Services */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <div className="h-px bg-gray-300 flex-1"></div>
            <h3 className="text-2xl font-semibold px-4 text-gray-800">Home Services</h3>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.filter(c => c.type === 'residential' || !c.type).map((category) => (
              <Link
                key={category.id}
                to={`/services?category=${category.slug || category.name.toLowerCase()}`}
                className="bg-white border rounded-xl p-6 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  {categoryIcons[category.slug] || <Hammer className="w-8 h-8 text-blue-600" />}
                </div>
                <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                <p className="text-gray-500 text-sm">{category.service_providers_count || 0} professionals</p>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Commercial Services */}
        {categories.some(c => c.type === 'commercial') && (
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <div className="h-px bg-gray-300 flex-1"></div>
              <h3 className="text-2xl font-semibold px-4 text-gray-800">Business Services</h3>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.filter(c => c.type === 'commercial').map((category) => (
                <Link
                  key={category.id}
                  to={`/services?category=${category.slug || category.name.toLowerCase()}`}
                  className="bg-white border rounded-xl p-6 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
                >
                  <div className="bg-blue-100 p-4 rounded-full mb-4">
                    {categoryIcons[category.slug] || <Hammer className="w-8 h-8 text-blue-600" />}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                  <p className="text-gray-500 text-sm">{category.service_providers_count || 0} professionals</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Value Proposition Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We make finding quality professionals easy</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Verified Providers</h3>
              <p className="text-gray-600">
                All professionals are thoroughly vetted and background checked
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-blue-600 fill-current" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Transparent Ratings</h3>
              <p className="text-gray-600">
                See real customer reviews and ratings for each provider
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Quick Service</h3>
              <p className="text-gray-600">
                Most requests are fulfilled within 24 hours
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Help With a Project?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Find the right professional for your needs today</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/services" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              Browse Services
            </Link>
            <Link 
              to="/contact" 
              className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}