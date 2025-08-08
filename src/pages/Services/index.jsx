import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Star, MapPin } from 'lucide-react';
import api from '../../api';

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const endpoint = categoryParam 
          ? `/service-providers?category=${categoryParam}`
          : '/service-providers';
        
        const response = await api.get(endpoint);
        setProviders(response.data);
      } catch (err) {
        console.error('Error fetching providers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [categoryParam]);

  const filteredProviders = providers.filter(provider => 
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    provider.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-8">Loading providers...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and filter UI (unchanged) */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProviders.map((provider) => (
          <div key={provider.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{provider.name}</h3>
                  <p className="text-gray-500">{provider.category}</p>
                </div>
                <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                  <span>{provider.rating || 'New'}</span>
                </div>
              </div>
              
              <div className="mt-4 flex items-center text-sm">
                <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                <span>{provider.location}</span>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <span className="font-medium">{provider.hourly_rate} DH/hr</span>
                <Link 
                  to={`/services/${provider.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}