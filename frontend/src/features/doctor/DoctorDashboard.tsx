import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, Calendar, FileText, BarChart3, Settings, LogOut, Stethoscope } from 'lucide-react';

export const DoctorDashboard = () => {
    return (
        <div className="min-h-screen mt-32 bg-gradient-to-br from-background via-purple-50/30 to-indigo-50/30">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">
                            Doctor{' '}
                            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                Dashboard
                            </span>
                        </h1>
                        <p className="text-muted-foreground">Manage your practice with AI assistance</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
