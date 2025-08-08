import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Check, X,Edit,  Star, MapPin, Clock, DollarSign } from 'lucide-react';
import api from '../../api';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import ProfileCompletionWizard from './ProfileCompletionWizard';

export default function ProfilePage() {
  const { t } = useTranslation();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/provider/profile');
        setProvider(response.data);
      } catch (err) {
        setError(t('profile.fetch_error'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [t]);

  const handleProfileComplete = () => {
    setSuccess(t('profile.update_success'));
    fetchProfile();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6 animate-fade-in">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 animate-fade-in">
      {error && (
        <Alert variant="destructive" className="animate-slide-up">
          <X className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="animate-slide-up">
          <Check className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-slide-up">
        <TabsList className="grid grid-cols-2 w-full max-w-xs bg-gradient-to-r from-blue-50 to-purple-50">
          <TabsTrigger value="profile" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            {t('profile.my_profile')}
          </TabsTrigger>
          <TabsTrigger value="complete" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            {t('profile.complete_profile')}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === 'profile' && (
        <Card className="animate-slide-up animate-delay-100 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="font-display text-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-gradient">
              {t('profile.profile_info')}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Progress 
                value={calculateCompletion(provider)} 
                className="h-2 w-full max-w-[200px]" 
              />
              <span>{t('profile.completion_status', { percent: calculateCompletion(provider) })}</span>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg">
                <h3 className="font-display font-medium text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  {t('profile.personal_info')}
                </h3>
                <div className="mt-3 space-y-3">
                  <p className="flex items-start gap-2">
                    <span className="text-muted-foreground min-w-[80px]">{t('profile.name')}:</span>
                    <span className="font-medium">{provider?.name}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-muted-foreground min-w-[80px]">{t('profile.email')}:</span>
                    <span className="font-medium">{provider?.email || '-'}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-muted-foreground min-w-[80px]">{t('profile.phone')}:</span>
                    <span className="font-medium">{provider?.phone}</span>
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg">
                <h3 className="font-display font-medium text-lg flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-200" />
                  {t('profile.service_info')}
                </h3>
                <div className="mt-3 space-y-3">
                  <p className="flex items-start gap-2">
                    <span className="text-muted-foreground min-w-[80px]">{t('profile.category')}:</span>
                    <Badge variant="outline" className="text-sm">
                      {provider?.category?.name || '-'}
                    </Badge>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-muted-foreground min-w-[80px]">{t('profile.hourly_rate')}:</span>
                    <span className="font-medium flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {provider?.hourly_rate}
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-muted-foreground min-w-[80px]">{t('profile.availability')}:</span>
                    <Badge variant={provider?.is_available ? 'default' : 'secondary'}>
                      {provider?.is_available ? t('profile.available') : t('profile.not_available')}
                    </Badge>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg h-full">
                <h3 className="font-display font-medium text-lg flex items-center gap-2">
                  <Edit className="h-5 w-5 text-purple-600" />
                  {t('profile.about')}
                </h3>
                <p className="mt-3 text-muted-foreground">
                  {provider?.bio || t('profile.no_bio')}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg">
                <h3 className="font-display font-medium text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-red-500" />
                  {t('profile.location')}
                </h3>
                <p className="mt-3 text-muted-foreground">
                  {provider?.location || t('profile.no_location')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'complete' && (
        <ProfileCompletionWizard 
          provider={provider} 
          onComplete={handleProfileComplete}
        />
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