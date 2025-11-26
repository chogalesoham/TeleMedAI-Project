import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Mail, Phone } from 'lucide-react';
import Overview from './components/Overview';
import { getDoctorOnboardingStatus } from '@/services/doctorOnboarding.service';
import { getStoredUser, logout } from '@/services/auth.service';

export const DoctorDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const checkOnboardingStatus = async () => {
            try {
                const storedUser = getStoredUser();
                setUser(storedUser);

                // Only check for doctors
                if (storedUser?.role !== 'doctor') {
                    return;
                }

                // Check if onboarding is completed
                const response = await getDoctorOnboardingStatus();

                if (!response.data.progress.isCompleted) {
                    // Redirect to onboarding if not completed
                    navigate('/doctor-onboarding');
                }
            } catch (error) {
                console.error('Error checking onboarding status:', error);
                // If no onboarding data exists, redirect to onboarding
                navigate('/doctor-onboarding');
            }
        };

        checkOnboardingStatus();
    }, [navigate]);

    const handleLogout = () => {
        logout();
        navigate('/doctor-login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Profile and Logout */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
                        <p className="text-sm text-gray-600">Welcome back, {user?.name || 'Doctor'}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* User Profile Info */}
                        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-semibold text-gray-900">{user?.name || 'Doctor'}</p>
                                <p className="text-xs text-gray-600 flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    {user?.email || 'email@example.com'}
                                </p>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-6">
                <Overview />
            </div>
        </div>
    );
};

export default DoctorDashboard;
