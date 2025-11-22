import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { LogOut, CheckCircle, Loader2, Shield, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutComplete, setLogoutComplete] = useState(false);

  useEffect(() => {
    // Auto-show dialog when component mounts
    setShowDialog(true);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    // Simulate logout process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Clear all session data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    sessionStorage.clear();

    setIsLoggingOut(false);
    setLogoutComplete(true);

    // Redirect to login after showing success message
    setTimeout(() => {
      navigate('/patient-login', { replace: true });
    }, 2000);
  };

  const handleCancel = () => {
    setShowDialog(false);
    // Navigate back to dashboard
    setTimeout(() => {
      navigate('/patient/dashboard');
    }, 300);
  };

  if (logoutComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto"
          >
            <CheckCircle className="h-12 w-12 text-green-600" />
          </motion.div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Logged Out Successfully</h1>
            <p className="text-gray-600">Thank you for using TeleMed. Stay healthy!</p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-gray-500"
          >
            Redirecting to login page...
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Card className="border-2">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <LogOut className="h-10 w-10 text-red-600" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Sign Out</h2>
              <p className="text-gray-600">Are you sure you want to log out of your account?</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-blue-900">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="font-semibold">Your data is secure</span>
              </div>
              <p className="text-xs text-blue-800 text-left">
                All your medical records and appointments are safely stored. You can access them
                anytime by logging back in.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full"
                variant="destructive"
                size="lg"
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut className="h-5 w-5 mr-2" />
                    Yes, Log Out
                  </>
                )}
              </Button>

              <Button
                onClick={handleCancel}
                disabled={isLoggingOut}
                variant="outline"
                size="lg"
                className="w-full"
              >
                Cancel
              </Button>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <Heart className="h-3 w-3 text-red-500 fill-current" />
                Thank you for trusting TeleMed with your healthcare
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Alert Dialog (alternative implementation) */}
      <AlertDialog open={showDialog && !isLoggingOut && !logoutComplete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <LogOut className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-xl">
              Are you sure you want to log out?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              You will need to log in again to access your dashboard and medical information.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:flex-col gap-2">
            <AlertDialogAction
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Yes, Log Out
            </AlertDialogAction>
            <AlertDialogCancel onClick={handleCancel} className="w-full">
              Stay Logged In
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Logout;
