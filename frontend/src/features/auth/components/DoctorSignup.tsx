import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/shared';
import { Select } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Mail, Lock, User, Phone, Award, Briefcase, Building2, ArrowRight, Stethoscope, Shield, CheckCircle2, Clock } from 'lucide-react';
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

    try {
      // Import the doctor signup service
      const { doctorSignup } = await import('@/services/auth.service');

      // Prepare signup data
      const signupData = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        dateOfBirth: new Date().toISOString(), // You may want to add a DOB field
        gender: 'Other', // You may want to add a gender field
        location: {
          city: formData.clinicHospital || ''
        }
      };

      const response = await doctorSignup(signupData);

      if (response.success) {
        // Navigate to doctor onboarding
        navigate('/doctor-onboarding');
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'Signup failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <motion.div
          className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-pink-400/15 to-violet-400/15 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], x: [0, -30, 0], y: [0, -50, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <div className="w-full max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Branding */}
          <motion.div
            variants={authAnimations.slideInLeft}
            initial="hidden"
            animate="visible"
            className="hidden lg:block space-y-8 sticky top-8"
          >
            <Link to="/" className="inline-flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-gray-900">
                TeleMed<span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">AI</span>
              </span>
            </Link>

            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-200/50 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Stethoscope className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">Join as Doctor</span>
            </motion.div>

            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Become Part of{' '}
                <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  The Future
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Join our network of verified healthcare professionals and provide exceptional care powered by AI.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              {[
                { icon: Shield, title: 'Verified Credentials', desc: 'We verify all medical licenses for trust and safety' },
                { icon: CheckCircle2, title: 'AI Assistant', desc: 'Get AI-powered diagnostic support during consultations' },
                { icon: Clock, title: 'Quick Approval', desc: 'Account verified within 24-48 hours' }
              ].map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/50 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Signup Form */}
          <motion.div
            variants={authAnimations.slideInRight}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8 lg:p-10">
              {/* Mobile Logo */}
              <Link to="/" className="lg:hidden flex items-center space-x-3 mb-8 group">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  TeleMed<span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">AI</span>
                </span>
              </Link>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Doctor Registration</h2>
                <p className="text-gray-600">
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
                  icon={<User className="w-5 h-5" />}
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
                    icon={<Mail className="w-5 h-5" />}
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
                    icon={<Phone className="w-5 h-5" />}
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
                  icon={<Award className="w-5 h-5" />}
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
                  icon={<Building2 className="w-5 h-5" />}
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="Create a strong password (min. 8 characters)"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    icon={<Lock className="w-5 h-5" />}
                    required
                  />

                  <Input
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    icon={<Lock className="w-5 h-5" />}
                    required
                  />
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-purple-900 mb-1">Verification Required</p>
                      <p className="text-purple-700">
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
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600 focus:ring-offset-0 mt-1"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
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
                  className="w-full group bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
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
                      <span>Submit Application</span>
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>

              {/* Sign In Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Already registered?{' '}
                  <Link
                    to="/doctor-login"
                    className="font-semibold text-purple-600 hover:text-purple-600/80 transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    <span>HIPAA Compliant</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Lock className="w-4 h-4" />
                    <span>256-bit Encryption</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSignup;
