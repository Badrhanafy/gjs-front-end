import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  DollarSign,
  MapPin,
  Edit,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import api from '../../api';

export default function ProfileCompletionWizard({ provider, onComplete }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(25);
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      name: provider?.name || '',
      email: provider?.email || '',
      phone: provider?.phone || '',
      bio: provider?.bio || '',
      hourly_rate: provider?.hourly_rate || '',
      location: provider?.location || '',
      is_available: provider?.is_available || true,
    }
  });

  const steps = [
    { id: 1, title: t('wizard.personal_info'), icon: <User className="h-5 w-5" /> },
    { id: 2, title: t('wizard.professional_info'), icon: <Briefcase className="h-5 w-5" /> },
    { id: 3, title: t('wizard.service_details'), icon: <DollarSign className="h-5 w-5" /> },
    { id: 4, title: t('wizard.review'), icon: <Check className="h-5 w-5" /> },
  ];

  const calculateCompletion = () => {
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
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await api.put('/provider/profile', data);
      onComplete();
      setProgress(100);
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < steps.length) {
      setStep(step + 1);
      setProgress(progress + 25);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setProgress(progress - 25);
    }
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-display">
          <div className="p-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100">
            {steps[step - 1].icon}
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-gradient">
            {steps[step - 1].title}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Progress value={progress} className="h-2 mb-6 bg-gray-100" />
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                  <User className="h-4 w-4" />
                  {t('wizard.full_name')}
                </Label>
                <Input
                  id="name"
                  className="pl-10"
                  {...register('name', { required: t('wizard.required_field') })}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="h-4 w-4" />
                  {t('wizard.email')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="pl-10"
                  {...register('email', { 
                    required: t('wizard.required_field'),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t('wizard.invalid_email')
                    }
                  })}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
                  <Phone className="h-4 w-4" />
                  {t('wizard.phone')}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  className="pl-10"
                  {...register('phone', { required: t('wizard.required_field') })}
                />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="bio" className="flex items-center gap-2 text-sm font-medium">
                  <Edit className="h-4 w-4" />
                  {t('wizard.bio')}
                </Label>
                <Textarea
                  id="bio"
                  className="min-h-[120px]"
                  {...register('bio', { required: t('wizard.required_field') })}
                  placeholder={t('wizard.bio_placeholder')}
                />
                {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4" />
                  {t('wizard.location')}
                </Label>
                <Input
                  id="location"
                  className="pl-10"
                  {...register('location', { required: t('wizard.required_field') })}
                />
                {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="hourly_rate" className="flex items-center gap-2 text-sm font-medium">
                  <DollarSign className="h-4 w-4" />
                  {t('wizard.hourly_rate')}
                </Label>
                <Input
                  id="hourly_rate"
                  type="number"
                  step="0.01"
                  className="pl-10"
                  {...register('hourly_rate', { 
                    required: t('wizard.required_field'),
                    min: { value: 0, message: t('wizard.invalid_rate') }
                  })}
                />
                {errors.hourly_rate && <p className="text-sm text-destructive">{errors.hourly_rate.message}</p>}
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch 
                  id="is_available" 
                  {...register('is_available')}
                />
                <Label htmlFor="is_available" className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  {t('wizard.available')}
                </Label>
              </div>
            </div>
          )}
          
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="rounded-lg border p-4 bg-gradient-to-br from-blue-50 to-purple-50">
                <h4 className="font-display font-medium mb-2">{t('wizard.review_title')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('wizard.completion_percentage', { percent: calculateCompletion() })}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3 p-3 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t('wizard.personal_info')}
                  </p>
                  <p className="text-sm">{watch('name')}</p>
                  <p className="text-sm">{watch('email')}</p>
                  <p className="text-sm">{watch('phone')}</p>
                </div>
                
                <div className="space-y-3 p-3 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    {t('wizard.professional_info')}
                  </p>
                  <p className="text-sm">{watch('bio') || t('wizard.not_provided')}</p>
                  <p className="text-sm">{watch('location')}</p>
                  <p className="text-sm flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {watch('hourly_rate')} {t('wizard.per_hour')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {step > 1 && (
          <Button variant="outline" onClick={prevStep} className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            {t('wizard.previous')}
          </Button>
        )}
        
        {step < steps.length ? (
          <Button onClick={nextStep} className="gap-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            {t('wizard.next')}
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            type="submit" 
            onClick={handleSubmit(onSubmit)} 
            loading={loading}
            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
          >
            {t('wizard.complete_profile')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}