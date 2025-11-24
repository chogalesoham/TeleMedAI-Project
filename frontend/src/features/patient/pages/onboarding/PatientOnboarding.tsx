import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import OnboardingStep1 from './OnboardingStep1';
import OnboardingStep2 from './OnboardingStep2';
import OnboardingStep3 from './OnboardingStep3';
import OnboardingStep4 from './OnboardingStep4';
import { getOnboardingStatus, saveOnboardingData } from '@/services/onboarding.service';
import { Loader2 } from 'lucide-react';

const PatientOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [onboardingData, setOnboardingData] = useState<any>({
    step1: null,
    step2: null,
    step3: null,
    step4: null
  });

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const response = await getOnboardingStatus();
      
      if (response.data.isCompleted) {
        // Already completed, redirect to dashboard
        navigate('/patient/dashboard');
        return;
      }

      if (response.data.exists) {
        // Continue from where they left off
        setCurrentStep(response.data.currentStep);
        
        // Load existing data if available
        if (response.data.onboardingData) {
          setOnboardingData({
            step1: response.data.onboardingData.basicHealthProfile,
            step2: response.data.onboardingData.medicalHistory,
            step3: response.data.onboardingData.currentHealthStatus,
            step4: response.data.onboardingData.telemedicinePreferences
          });
        }
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      toast({
        title: 'Error',
        description: 'Failed to load onboarding status. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStep1Complete = async (data: any) => {
    setSaving(true);
    try {
      await saveOnboardingData(1, data);
      setOnboardingData({ ...onboardingData, step1: data });
      setCurrentStep(2);
      
      toast({
        title: 'Progress Saved',
        description: 'Your basic health profile has been saved.'
      });
    } catch (error: any) {
      toast({
        title: 'Save Failed',
        description: error.message || 'Failed to save your data. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleStep2Complete = async (data: any) => {
    setSaving(true);
    try {
      await saveOnboardingData(2, data);
      setOnboardingData({ ...onboardingData, step2: data });
      setCurrentStep(3);
      
      toast({
        title: 'Progress Saved',
        description: 'Your medical history has been saved.'
      });
    } catch (error: any) {
      toast({
        title: 'Save Failed',
        description: error.message || 'Failed to save your data. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleStep3Complete = async (data: any) => {
    setSaving(true);
    try {
      await saveOnboardingData(3, data);
      setOnboardingData({ ...onboardingData, step3: data });
      setCurrentStep(4);
      
      toast({
        title: 'Progress Saved',
        description: 'Your current health status has been saved.'
      });
    } catch (error: any) {
      toast({
        title: 'Save Failed',
        description: error.message || 'Failed to save your data. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleStep4Complete = async (data: any) => {
    setSaving(true);
    try {
      await saveOnboardingData(4, data);
      setOnboardingData({ ...onboardingData, step4: data });
      
      toast({
        title: 'Onboarding Complete!',
        description: 'Your profile is complete. Redirecting to dashboard...'
      });

      // Redirect to completion page
      setTimeout(() => {
        navigate('/onboarding-complete');
      }, 1500);
    } catch (error: any) {
      toast({
        title: 'Save Failed',
        description: error.message || 'Failed to complete onboarding. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-500" />
          <p className="text-muted-foreground">Loading your onboarding...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12 px-4">
      {/* Progress Indicator */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step === currentStep
                      ? 'bg-blue-500 text-white'
                      : step < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step}
                </div>
                <span className="text-xs mt-2 text-muted-foreground">
                  {step === 1 && 'Health Profile'}
                  {step === 2 && 'Medical History'}
                  {step === 3 && 'Current Status'}
                  {step === 4 && 'Preferences'}
                </span>
              </div>
              {step < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className={saving ? 'opacity-50 pointer-events-none' : ''}>
        {currentStep === 1 && (
          <OnboardingStep1
            onNext={handleStep1Complete}
            initialData={onboardingData.step1}
          />
        )}
        {currentStep === 2 && (
          <OnboardingStep2
            onNext={handleStep2Complete}
            onBack={handleBack}
            initialData={onboardingData.step2}
          />
        )}
        {currentStep === 3 && (
          <OnboardingStep3
            onNext={handleStep3Complete}
            onBack={handleBack}
            initialData={onboardingData.step3}
          />
        )}
        {currentStep === 4 && (
          <OnboardingStep4
            onNext={handleStep4Complete}
            onBack={handleBack}
            initialData={onboardingData.step4}
          />
        )}
      </div>

      {saving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-4">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="text-lg font-medium">Saving your information...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientOnboarding;
