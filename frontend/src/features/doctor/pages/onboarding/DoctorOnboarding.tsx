import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/shared';
import { ArrowRight, ArrowLeft, CheckCircle2, Upload, FileText } from 'lucide-react';
import { getDoctorOnboardingStatus, saveDoctorOnboardingData } from '@/services/doctorOnboarding.service';
import { toast } from 'sonner';

const STEPS = [
    { number: 1, title: 'Professional Information', description: 'Medical registration & credentials' },
    { number: 2, title: 'Professional Details', description: 'Specialties & languages' },
    { number: 3, title: 'Practice Details', description: 'Availability & consultation fees' },
    { number: 4, title: 'Documents & Verification', description: 'Upload required documents' }
];

const SPECIALTIES = [
    'General Medicine', 'Cardiology', 'Dermatology', 'Endocrinology',
    'Gastroenterology', 'Neurology', 'Oncology', 'Orthopedics',
    'Pediatrics', 'Psychiatry', 'Radiology', 'Surgery'
];

const LANGUAGES = ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Bengali', 'Gujarati'];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const DoctorOnboarding = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState({
        step1Completed: false,
        step2Completed: false,
        step3Completed: false,
        step4Completed: false,
    });

    // Step 1: Professional Information
    const [step1Data, setStep1Data] = useState({
        firstName: '',
        lastName: '',
        medicalRegistrationNumber: '',
        registrationCouncil: ''
    });

    // Step 2: Professional Details
    const [step2Data, setStep2Data] = useState({
        specialties: [] as string[],
        consultationModes: [] as string[],
        languages: [] as string[],
        shortBio: '',
        profilePhoto: ''
    });

    // Step 3: Practice Details
    const [step3Data, setStep3Data] = useState({
        availability: [] as any[],
        consultationFee: {
            currency: 'INR',
            amount: 0,
            mode: 'per_consult'
        }
    });

    // Step 4: Documents
    const [step4Data, setStep4Data] = useState({
        verificationDocuments: [] as string[],
        termsAndConditionsSigned: false
    });

    useEffect(() => {
        loadOnboardingStatus();
    }, []);

    const loadOnboardingStatus = async () => {
        try {
            const response = await getDoctorOnboardingStatus();
            if (response.data.exists) {
                setProgress(response.data.progress);
                setCurrentStep(response.data.progress.currentStep);
            }
        } catch (error) {
            console.error('Error loading onboarding status:', error);
        }
    };

    const handleSaveStep = async (step: number, data: any) => {
        setIsLoading(true);
        try {
            const response = await saveDoctorOnboardingData(step, data);

            if (response.success) {
                setProgress(response.data.progress);
                toast.success(`Step ${step} saved successfully!`);

                if (response.data.progress.isCompleted) {
                    toast.success('Onboarding completed! Redirecting to dashboard...');
                    setTimeout(() => navigate('/doctor-dashboard'), 1500);
                } else if (step < 4) {
                    setCurrentStep(step + 1);
                }
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to save step data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNext = () => {
        const stepData = [step1Data, step2Data, step3Data, step4Data][currentStep - 1];
        handleSaveStep(currentStep, stepData);
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
                <Input
                    label="First Name"
                    value={step1Data.firstName}
                    onChange={(e) => setStep1Data({ ...step1Data, firstName: e.target.value })}
                    placeholder="Enter your first name"
                    required
                />
                <Input
                    label="Last Name"
                    value={step1Data.lastName}
                    onChange={(e) => setStep1Data({ ...step1Data, lastName: e.target.value })}
                    placeholder="Enter your last name"
                    required
                />
            </div>
            <Input
                label="Medical Registration Number"
                value={step1Data.medicalRegistrationNumber}
                onChange={(e) => setStep1Data({ ...step1Data, medicalRegistrationNumber: e.target.value })}
                placeholder="Enter your medical registration number"
                required
            />
            <Input
                label="Registration Council"
                value={step1Data.registrationCouncil}
                onChange={(e) => setStep1Data({ ...step1Data, registrationCouncil: e.target.value })}
                placeholder="e.g., MCI, State Medical Council"
                required
            />
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialties *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {SPECIALTIES.map((specialty) => (
                        <label key={specialty} className="flex items-center space-x-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={step2Data.specialties.includes(specialty)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setStep2Data({ ...step2Data, specialties: [...step2Data.specialties, specialty] });
                                    } else {
                                        setStep2Data({ ...step2Data, specialties: step2Data.specialties.filter(s => s !== specialty) });
                                    }
                                }}
                                className="rounded text-purple-600"
                            />
                            <span className="text-sm">{specialty}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Modes *</label>
                <div className="flex gap-4">
                    {['tele', 'in_person'].map((mode) => (
                        <label key={mode} className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={step2Data.consultationModes.includes(mode)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setStep2Data({ ...step2Data, consultationModes: [...step2Data.consultationModes, mode] });
                                    } else {
                                        setStep2Data({ ...step2Data, consultationModes: step2Data.consultationModes.filter(m => m !== mode) });
                                    }
                                }}
                                className="rounded text-purple-600"
                            />
                            <span className="text-sm capitalize">{mode.replace('_', ' ')}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Languages *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {LANGUAGES.map((language) => (
                        <label key={language} className="flex items-center space-x-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={step2Data.languages.includes(language)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setStep2Data({ ...step2Data, languages: [...step2Data.languages, language] });
                                    } else {
                                        setStep2Data({ ...step2Data, languages: step2Data.languages.filter(l => l !== language) });
                                    }
                                }}
                                className="rounded text-purple-600"
                            />
                            <span className="text-sm">{language}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Short Bio (50-300 characters) *</label>
                <textarea
                    value={step2Data.shortBio}
                    onChange={(e) => setStep2Data({ ...step2Data, shortBio: e.target.value })}
                    placeholder="Describe your clinical focus and experience..."
                    className="w-full p-3 border rounded-lg resize-none"
                    rows={4}
                    minLength={50}
                    maxLength={300}
                    required
                />
                <p className="text-sm text-gray-500 mt-1">{step2Data.shortBio.length}/300 characters</p>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee *</label>
                <div className="grid md:grid-cols-3 gap-4">
                    <Input
                        label="Amount"
                        type="number"
                        value={step3Data.consultationFee.amount}
                        onChange={(e) => setStep3Data({
                            ...step3Data,
                            consultationFee: { ...step3Data.consultationFee, amount: Number(e.target.value) }
                        })}
                        placeholder="500"
                        required
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                        <select
                            value={step3Data.consultationFee.currency}
                            onChange={(e) => setStep3Data({
                                ...step3Data,
                                consultationFee: { ...step3Data.consultationFee, currency: e.target.value }
                            })}
                            className="w-full p-3 border rounded-lg"
                        >
                            <option value="INR">INR</option>
                            <option value="USD">USD</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
                        <select
                            value={step3Data.consultationFee.mode}
                            onChange={(e) => setStep3Data({
                                ...step3Data,
                                consultationFee: { ...step3Data.consultationFee, mode: e.target.value }
                            })}
                            className="w-full p-3 border rounded-lg"
                        >
                            <option value="per_consult">Per Consultation</option>
                            <option value="per_minute">Per Minute</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                    <strong>Note:</strong> You can set up your detailed availability schedule after completing onboarding from your dashboard.
                </p>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Verification Documents</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Upload your medical degree and registration certificate (at least 1 document required)
                </p>
                <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                        // Mock file upload - in production, upload to cloud storage
                        const file = e.target.files?.[0];
                        if (file) {
                            const mockUrl = `https://example.com/documents/${file.name}`;
                            setStep4Data({
                                ...step4Data,
                                verificationDocuments: [...step4Data.verificationDocuments, mockUrl]
                            });
                            toast.success('Document uploaded successfully (mock)');
                        }
                    }}
                />
                {step4Data.verificationDocuments.length > 0 && (
                    <div className="mt-4 space-y-2">
                        {step4Data.verificationDocuments.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-green-600" />
                                    <span className="text-sm text-green-800">Document {index + 1}</span>
                                </div>
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <input
                    type="checkbox"
                    id="terms"
                    checked={step4Data.termsAndConditionsSigned}
                    onChange={(e) => setStep4Data({ ...step4Data, termsAndConditionsSigned: e.target.checked })}
                    className="mt-1 rounded text-purple-600"
                    required
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                    I certify that all information provided is accurate and I agree to the telemedicine terms and conditions.
                    I understand that my credentials will be verified (auto-verified for MVP).
                </label>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        {STEPS.map((step, index) => (
                            <div key={step.number} className="flex-1">
                                <div className="flex items-center">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= step.number ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
                                        }`}>
                                        {progress[`step${step.number}Completed` as keyof typeof progress] ? (
                                            <CheckCircle2 className="w-6 h-6" />
                                        ) : (
                                            step.number
                                        )}
                                    </div>
                                    {index < STEPS.length - 1 && (
                                        <div className={`flex-1 h-1 mx-2 ${currentStep > step.number ? 'bg-purple-600' : 'bg-gray-200'
                                            }`} />
                                    )}
                                </div>
                                <div className="mt-2">
                                    <p className="text-xs font-medium text-gray-900">{step.title}</p>
                                    <p className="text-xs text-gray-500">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl p-8"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {STEPS[currentStep - 1].title}
                    </h2>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {currentStep === 1 && renderStep1()}
                            {currentStep === 2 && renderStep2()}
                            {currentStep === 3 && renderStep3()}
                            {currentStep === 4 && renderStep4()}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t">
                        <Button
                            onClick={handleBack}
                            disabled={currentStep === 1}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                        <Button
                            onClick={handleNext}
                            disabled={isLoading}
                            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600"
                        >
                            {isLoading ? 'Saving...' : currentStep === 4 ? 'Complete Onboarding' : 'Save & Continue'}
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DoctorOnboarding;
