import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Mail, Lock, Stethoscope, ArrowRight, Award, Users, TrendingUp } from 'lucide-react';
import { authAnimations } from '@/constants/authAnimations';

export const DoctorLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simple validation
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/doctor-dashboard');
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-indigo-50/30 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <motion.div
          className="absolute top-20 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 -right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="w-full max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <motion.div
            variants={authAnimations.slideInLeft}
            initial="hidden"
            animate="visible"
            className="hidden lg:block space-y-6"
          >
            <Link to="/" className="inline-flex items-center space-x-2 mb-8">
              <img src="/logo.png" alt="TeleMedAI" className="h-10 w-10" />
              <span className="text-2xl font-bold text-gray-900">
                TeleMed<span className="text-primary">AI</span>
              </span>
            </Link>
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
                <Stethoscope className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-600">Doctor Portal</span>
              </div>
              
              <h1 className="text-5xl font-bold leading-tight">
                Welcome Back,{' '}
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Doctor
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Access your practice dashboard, manage appointments, and provide exceptional care with AI assistance.
              </p>
            </div>

            <div className="space-y-4 pt-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">AI-Powered Diagnostics</h3>
                  <p className="text-sm text-muted-foreground">Get intelligent suggestions during consultations</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Patient Management</h3>
                  <p className="text-sm text-muted-foreground">Streamlined workflows for better care</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Practice Analytics</h3>
                  <p className="text-sm text-muted-foreground">Insights to grow your practice</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            variants={authAnimations.slideInRight}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-12">
              {/* Mobile Logo */}
              <Link to="/" className="lg:hidden flex items-center space-x-2 mb-8">
                <img src="/logo.png" alt="TeleMedAI" className="h-8 w-8" />
                <span className="text-xl font-bold text-gray-900">
                  TeleMed<span className="text-primary">AI</span>
                </span>
              </Link>

              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Doctor Login</h2>
                <p className="text-muted-foreground">
                  Access your medical practice dashboard
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Professional Email"
                  type="email"
                  name="email"
                  placeholder="doctor@hospital.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  icon={<Mail className="w-4 h-4" />}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  icon={<Lock className="w-4 h-4" />}
                  required
                />

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600" />
                    <span className="text-muted-foreground">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-purple-600 hover:text-purple-600/80 font-medium">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-full group bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-600/90 hover:to-indigo-600/90 text-white"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      Sign In to Dashboard
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-muted-foreground">Verified professionals only</span>
                  </div>
                </div>

                <div className="bg-purple-50/50 border border-purple-200/50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-purple-900 mb-1">Professional Verification</p>
                      <p className="text-purple-700/80">
                        All accounts are verified with medical license credentials for patient safety.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  Not registered yet?{' '}
                  <Link to="/doctor-signup" className="text-purple-600 hover:text-purple-600/80 font-semibold">
                    Apply now
                  </Link>
                </p>

                <p className="text-center text-xs text-muted-foreground pt-4">
                  Are you a patient?{' '}
                  <Link to="/patient-login" className="text-primary hover:text-primary/80 font-semibold">
                    Login here
                  </Link>
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
