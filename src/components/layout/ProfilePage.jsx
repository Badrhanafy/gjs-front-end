import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, Briefcase, DollarSign, MapPin, Edit, Star } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../api';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProfileCompletionWizard from './ProfileCompletionWizard';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Component to handle map view changes
function MapViewUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [mapCenter, setMapCenter] = useState([31.63, -7.99]); // Default to Morocco center
  const [serviceRadius, setServiceRadius] = useState(5000); // Default 5km radius
  const [hasLocation, setHasLocation] = useState(false);
  const [locationDetails, setLocationDetails] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/provider/profile');
        setProvider(response.data);
        
        // Try to geocode the location if available
        if (response.data?.location) {
          const { coords, details } = await geocodeLocation(response.data.location);
          if (coords) {
            setMapCenter(coords);
            setLocationDetails(details);
            setHasLocation(true);
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const geocodeLocation = async (location) => {
    try {
      // Use OpenCage Geocoding API
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=0fa2bdef9dc54335a8845e4906dd8e81&language=en&pretty=1`
      );
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return {
          coords: [result.geometry.lat, result.geometry.lng],
          details: {
            formatted: result.formatted,
            components: result.components
          }
        };
      }
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  const getLocationDisplay = () => {
    if (!provider?.location) return t('profile.location_not_set');
    if (locationDetails?.components) {
      const { city, town, village, county, state, country } = locationDetails.components;
      return city || town || village || county || state || country || provider.location;
    }
    return provider.location;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse h-64"></div>
          </div>
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse h-40"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header with completion status */}
      <div className="mb-8 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{t('profile.your_profile')}</h1>
          <Badge variant="outline" className="px-3 py-1 text-sm">
            {t('profile.completion_status', { percent: calculateCompletion(provider) })}
          </Badge>
        </div>
        <Progress 
          value={calculateCompletion(provider)} 
          className="h-2 bg-gray-100"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar - Profile card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-0 shadow-sm rounded-xl overflow-hidden animate-slide-up">
            <div className=" h-24"
            style={{
              backgroundImage:"url('Dari Company.svg')",
             
            }}
            ></div>
            <CardHeader className="relative -mt-12">
              <div className="mx-auto rounded-full border-4 border-white bg-white p-1 w-24 h-24 shadow-md">
                <div className="bg-gray-200 rounded-full w-full h-full flex items-center justify-center">
                  <User className="h-10 w-10 text-gray-500" />
                </div>
              </div>
              <CardTitle className="text-center mt-4 text-xl font-semibold">
                {provider?.name}
              </CardTitle>
              <p className="text-center text-gray-500 text-sm">
                {provider?.category?.name || t('profile.service_provider')}
              </p>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">{provider?.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">{provider?.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">{getLocationDisplay()}</span>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4 border-blue-500 text-blue-600 hover:bg-blue-50"
                onClick={() => setActiveTab('complete')}
              >
                <Edit className="h-4 w-4 mr-2" />
                {t('profile.edit_profile')}
              </Button>
            </CardContent>
          </Card>

          {/* Availability card */}
          <Card className="border-0 shadow-sm rounded-xl animate-slide-up animate-delay-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span>{t('profile.availability')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge 
                variant={provider?.is_available ? 'default' : 'secondary'} 
                className="text-sm px-3 py-1 rounded-full"
              >
                {provider?.is_available ? t('profile.available') : t('profile.not_available')}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Right content area */}
        <div className="lg:col-span-2 space-y-6">
          {/* About section */}
          <Card className="border-0 shadow-sm rounded-xl animate-slide-up animate-delay-150">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-500" />
                <span>{t('profile.about_me')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                {provider?.bio || t('profile.no_bio')}
              </p>
            </CardContent>
          </Card>

          {/* Service details */}
          <Card className="border-0 shadow-sm rounded-xl animate-slide-up animate-delay-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-purple-500" />
                <span>{t('profile.service_details')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">{t('profile.hourly_rate')}</h3>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <span className="text-2xl font-semibold">{provider?.hourly_rate || '0'}</span>
                  <span className="text-gray-500">/ {t('profile.hour')}</span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">{t('profile.specialization')}</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="px-3 py-1">
                    {provider?.category?.name || t('profile.not_specified')}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Map */}
          <Card className="border-0 shadow-sm rounded-xl overflow-hidden animate-slide-up animate-delay-250">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-red-500" />
                <span>{t('profile.service_area')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {hasLocation ? (
                <div className="h-64 w-full relative">
                  <MapContainer 
                    center={mapCenter} 
                    zoom={12} 
                    style={{ height: '100%', width: '100%' }}
                    className="rounded-b-xl z-0"
                  >
                    <MapViewUpdater center={mapCenter} />
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={mapCenter}>
                      <Popup>
                        <div className="space-y-1">
                          <div className="font-semibold">{provider?.name}</div>
                          <div className="text-sm">{locationDetails?.formatted || provider?.location}</div>
                          <div className="text-xs text-gray-500">
                            {provider?.category?.name || 'Service Provider'}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                    <Circle
                      center={mapCenter}
                      radius={serviceRadius}
                      pathOptions={{ color: 'blue', fillColor: 'blue' }}
                      fillOpacity={0.1}
                    />
                  </MapContainer>
                  <div className="absolute bottom-4 right-4 bg-white p-2 rounded-md shadow-md z-10">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Service Radius:</span>
                      <select 
                        value={serviceRadius} 
                        onChange={(e) => setServiceRadius(Number(e.target.value))}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="1000">1 km</option>
                        <option value="5000">5 km</option>
                        <option value="10000">10 km</option>
                        <option value="20000">20 km</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center bg-gray-50 text-gray-400 rounded-b-xl">
                  <MapPin className="h-10 w-10 mb-2" />
                  <p>{t('profile.no_location_set')}</p>
                  <Button 
                    variant="ghost" 
                    className="mt-4 text-blue-600"
                    onClick={() => setActiveTab('complete')}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {t('profile.set_location')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Profile completion wizard */}
      {activeTab === 'complete' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <ProfileCompletionWizard 
              provider={provider} 
              onComplete={() => {
                setActiveTab('overview');
                fetchProfile();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function calculateCompletion(provider) {
  const requiredFields = [
    provider?.name,
    provider?.email,
    provider?.phone,
    provider?.bio,
    provider?.hourly_rate,
    provider?.location
  ];
  
  const completed = requiredFields.filter(field => field).length;
  return Math.round((completed / requiredFields.length) * 100);
}