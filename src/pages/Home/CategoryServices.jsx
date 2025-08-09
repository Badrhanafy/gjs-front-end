import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Clock, CheckCircle } from 'lucide-react';
import api from '../../api';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

export default function CategoryServices() {
  const { categoryName } = useParams();
  const [category, setCategory] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    

  useEffect(() => {
    const fetchCategoryServices = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/category-name/${categoryName}`);
        setCategory(response.data.category);
        setProviders(response.data.service_providers);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryServices();
   

    
  }, [categoryName]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-24" />
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-12 text-center"
      >
        <div className="bg-red-100 text-red-700 p-6 rounded-lg inline-block max-w-md">
          <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
          <p className="mb-4">{error}</p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  if (!providers.length) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-12 text-center"
      >
        <div className="bg-blue-100 text-blue-700 p-6 rounded-lg inline-block max-w-md">
          <h3 className="text-xl font-semibold mb-2">No providers available</h3>
          <p className="mb-4">We couldn't find any service providers for {category?.name} at this time.</p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Browse other categories
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-12"
    >
      <div className="mb-12 text-center md:text-left">
        <Link to="/" className="inline-block mb-6">
          <Button variant="ghost" className="hover:bg-gray-100">
            <ArrowLeft className="mr-2 h-4 w-4" />
            All Categories
          </Button>
        </Link>
        
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-4 text-gray-900"
        >
          {category.name} Professionals
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-600 max-w-3xl mx-auto md:mx-0"
        >
          {category.description || `Browse our verified ${category.name} professionals. Each provider is carefully vetted to ensure quality service.`}
        </motion.p>
      </div>

      <AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {providers.map((provider, index) => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="h-full"
            >
              <Card className="h-full flex flex-col border border-gray-200 hover:border-primary/50 transition-all">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
                      {provider.user?.name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{provider.user?.name}</CardTitle>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="text-sm font-medium">
                          {provider.rating || 'New'}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">
                          ({provider.reviews_count || 0} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-grow">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{provider.location || 'Various locations'}</span>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{provider.availability || 'Flexible availability'}</span>
                    </div>
                    
                    {provider.is_verified && (
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-green-600 font-medium">Verified Professional</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <span className="text-lg font-bold text-primary">${provider.hourly_rate}/hr</span>
                    {provider.min_hours && (
                      <span className="text-sm text-gray-500 ml-2">(min {provider.min_hours} hrs)</span>
                    )}
                  </div>
                  <Link to={`/providers/${provider.id}`}>
  <Button
    size="sm"
    className="bg-blue-500 text-white hover:bg-blue-600"
  >
    View Profile
  </Button>
</Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </motion.div>
  );
}