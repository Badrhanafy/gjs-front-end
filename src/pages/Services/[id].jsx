import { useParams } from 'react-router-dom';
import { Star, MapPin, Clock, Calendar, Phone } from 'lucide-react';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const provider = {
    id: 1,
    name: 'Ali Plumber',
    rating: 4.8,
    jobs: 124,
    category: 'Plumbing',
    location: 'Casablanca',
    price: '150 DH/hr',
    bio: 'Professional plumber with 10 years of experience.'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-start gap-6">
            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold">
              {provider.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{provider.name}</h1>
              <div className="flex items-center mt-2">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
                <span className="font-medium">{provider.rating}</span>
                <span className="text-gray-500 ml-2">({provider.jobs} jobs)</span>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <p className="text-gray-700">{provider.bio}</p>
          </div>
        </div>
        
        <div className="border rounded-lg p-6 h-fit sticky top-4">
          <h3 className="text-xl font-semibold mb-4">Book Service</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Rate:</span>
              <span className="font-medium">{provider.price}</span>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input 
                type="date" 
                className="w-full border rounded-md p-2"
              />
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center">
              <Phone className="h-4 w-4 mr-2" />
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}