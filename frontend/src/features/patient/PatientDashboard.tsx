import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Calendar, FileText, MessageSquare, User, LogOut } from 'lucide-react';

export const PatientDashboard = () => {
    return (
        <div className="min-h-screen mt-32 bg-gradient-to-br from-background via-blue-50/30 to-cyan-50/30">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">
                            Welcome to Your{' '}
                            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                Dashboard
                            </span>
                        </h1>
                        <p className="text-muted-foreground">Manage your health journey in one place</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
