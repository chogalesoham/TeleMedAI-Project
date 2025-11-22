import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/shared';
import { Select } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Mail, Lock, User, Phone, Award, Briefcase, Building2, ArrowRight, Stethoscope, Shield, CheckCircle } from 'lucide-react';
import { authAnimations } from '@/constants/authAnimations';

const SPECIALIZATION_OPTIONS = [
  { value: 'general-practice', label: 'General Practice' },
  { value: 'cardiology', label: 'Cardiology' },
  { value: 'dermatology', label: 'Dermatology' },
  { value: 'endocrinology', label: 'Endocrinology' },
  { value: 'gastroenterology', label: 'Gastroenterology' },
  { value: 'neurology', label: 'Neurology' },
  { value: 'oncology', label: 'Oncology' },
  { value: 'orthopedics', label: 'Orthopedics' },
  { value: 'pediatrics', label: 'Pediatrics' },
  { value: 'psychiatry', label: 'Psychiatry' },
  { value: 'radiology', label: 'Radiology' },
  { value: 'surgery', label: 'Surgery' },
  { value: 'other', label: 'Other' },
];

const EXPERIENCE_OPTIONS = [
  { value: '0-2', label: '0-2 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '6-10', label: '6-10 years' },
  { value: '11-15', label: '11-15 years' },
  { value: '16-20', label: '16-20 years' },
  { value: '20+', label: '20+ years' },
];

export const DoctorSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    medicalLicense: '',
    specialization: '',
    experienceYears: '',
    clinicHospital: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.medicalLicense) newErrors.medicalLicense = 'Medical license number is required';
    if (!formData.specialization) newErrors.specialization = 'Specialization is required';
    if (!formData.experienceYears) newErrors.experienceYears = 'Experience is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-indigo-50/30 flex items-center justify-center p-4 py-12">
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
            className="hidden lg:block space-y-6 sticky top-8"
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
                <span className="text-sm font-semibold text-purple-600">Join as Doctor</span>
              </div>
              
              <h1 className="text-5xl font-bold leading-tight">
                Become Part of{' '}
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  The Future
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Join our network of verified healthcare professionals and provide exceptional care powered by AI.
              </p>
            </div>

            <div className="space-y-4 pt-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Verified Credentials</h3>
                  <p className="text-sm text-muted-foreground">We verify all medical licenses for trust and safety</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">AI Assistant</h3>
                  <p className="text-sm text-muted-foreground">Get AI-powered diagnostic support during consultations</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Grow Your Practice</h3>
                  <p className="text-sm text-muted-foreground">Access a wider patient base and practice analytics</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Signup Form */}
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
                <h2 className="text-3xl font-bold mb-2">Doctor Registration</h2>
                <p className="text-muted-foreground">
                  Complete your professional profile
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Full Name"
                  type="text"
                  name="fullName"
                  placeholder="Dr. Jane Smith"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  icon={<User className="w-4 h-4" />}
                  required
                />

                <div className="grid sm:grid-cols-2 gap-4">
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
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    icon={<Phone className="w-4 h-4" />}
                    required
                  />
                </div>

                <Input
                  label="Medical License Number"
                  type="text"
                  name="medicalLicense"
                  placeholder="Enter your medical license number"
                  value={formData.medicalLicense}
                  onChange={handleChange}
                  error={errors.medicalLicense}
                  icon={<Award className="w-4 h-4" />}
                  required
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <Select
                    label="Specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    error={errors.specialization}
                    options={SPECIALIZATION_OPTIONS}
                    placeholder="Select specialization"
                    required
                  />

                  <Select
                    label="Years of Experience"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    error={errors.experienceYears}
                    options={EXPERIENCE_OPTIONS}
                    placeholder="Select experience"
                    required
                  />
                </div>

                <Input
                  label="Clinic / Hospital"
                  type="text"
                  name="clinicHospital"
                  placeholder="Your practice location (optional)"
                  value={formData.clinicHospital}
                  onChange={handleChange}
                  icon={<Building2 className="w-4 h-4" />}
                />

                <div className="grid sm:grid-cols-2 gap-4">
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

                  <Input
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    icon={<Lock className="w-4 h-4" />}
                    required
                  />
                </div>

                <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-amber-900 mb-1">Verification Required</p>
                      <p className="text-amber-700/80">
                        Your medical license will be verified within 24-48 hours before account activation.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600 mt-1"
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground">
                    I certify that the information provided is accurate and I agree to the{' '}
                    <Link to="/terms" className="text-purple-600 hover:text-purple-600/80 font-medium">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-purple-600 hover:text-purple-600/80 font-medium">
                      Privacy Policy
                    </Link>
                  </label>
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
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      Submit Application
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already registered?{' '}
                  <Link to="/doctor-login" className="text-purple-600 hover:text-purple-600/80 font-semibold">
                    Sign in
                  </Link>
                </p>

                <p className="text-center text-xs text-muted-foreground pt-2">
                  Are you a patient?{' '}
                  <Link to="/patient-signup" className="text-primary hover:text-primary/80 font-semibold">
                    Register here
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

export default DoctorSignup;
