import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const OnboardingComplete: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate('/patient/dashboard');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleContinue = () => {
    navigate('/patient/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-24 h-24 text-green-500" />
          </div>
          <CardTitle className="text-3xl">Onboarding Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">
              Thank you for completing your health profile.
            </p>
            <p className="text-base text-muted-foreground">
              Your information has been securely saved and will help us provide you with personalized healthcare services.
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg space-y-3">
            <h3 className="font-semibold text-lg">What's Next?</h3>
            <ul className="text-sm text-left space-y-2 max-w-md mx-auto">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Access your personalized dashboard</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Book your first consultation</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Chat with our AI health assistant</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Upload medical reports</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Track your health journey</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button size="lg" className="w-full" onClick={handleContinue}>
              Go to Dashboard
            </Button>
            <p className="text-sm text-muted-foreground">
              Redirecting automatically in 5 seconds...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingComplete;
