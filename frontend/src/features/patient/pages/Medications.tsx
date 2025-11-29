import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Pill,
  Clock,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Loader2,
  Sun,
  Sunset,
  Moon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface Medicine {
  _id: string;
  name: string;
  dosage: string;
  frequency: {
    morning: boolean;
    afternoon: boolean;
    night: boolean;
  };
  duration_days: number;
  instructions: string;
  warnings: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  prescriptionId: string;
  doctor: {
    _id: string;
    name: string;
    specialization?: string;
    profilePicture?: string;
  };
  prescribedDate: string;
  appointmentDate?: string;
}

export const Medications = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActiveMedicines();
  }, []);

  const fetchActiveMedicines = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/prescriptions/patient/medicines/active', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (result.success) {
        setMedicines(result.data || []);
      } else {
        setError(result.error || 'Failed to load medications');
      }
    } catch (err) {
      setError('An error occurred while loading medications');
    } finally {
      setIsLoading(false);
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-500 mb-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Medications</h1>
        <p className="text-gray-600 mt-1">Track your prescribed medications and schedules</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Medications</p>
                <p className="text-2xl font-bold text-gray-900">{medicines.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Pill className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ending Soon</p>
                <p className="text-2xl font-bold text-orange-600">
                  {medicines.filter(m => getDaysRemaining(m.endDate) <= 3).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Adherence Rate</p>
                <p className="text-2xl font-bold text-green-600">92%</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medications List */}
      {medicines.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Pill className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Medications</h3>
            <p className="text-gray-600">You don't have any active prescriptions at the moment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {medicines.map((medicine, index) => {
            const daysRemaining = getDaysRemaining(medicine.endDate);
            const isEndingSoon = daysRemaining <= 3;

            return (
              <motion.div
                key={medicine._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={isEndingSoon ? 'border-orange-300' : ''}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Pill className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{medicine.name}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{medicine.dosage}</p>
                        </div>
                      </div>
                      {isEndingSoon && (
                        <Badge variant="destructive">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {daysRemaining} days left
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Schedule */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Schedule</p>
                      <div className="flex gap-2">
                        {medicine.frequency.morning && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Sun className="w-3 h-3" />
                            Morning
                          </Badge>
                        )}
                        {medicine.frequency.afternoon && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Sunset className="w-3 h-3" />
                            Afternoon
                          </Badge>
                        )}
                        {medicine.frequency.night && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Moon className="w-3 h-3" />
                            Night
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Instructions */}
                    {medicine.instructions && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Instructions</p>
                        <p className="text-sm text-gray-600">{medicine.instructions}</p>
                      </div>
                    )}

                    {/* Warnings */}
                    {medicine.warnings && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-yellow-800">Warning</p>
                            <p className="text-sm text-yellow-700">{medicine.warnings}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <Separator />

                    {/* Doctor Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={medicine.doctor.profilePicture} />
                          <AvatarFallback>
                            {medicine.doctor.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Dr. {medicine.doctor.name}</p>
                          <p className="text-xs text-gray-600">{medicine.doctor.specialization || 'General Physician'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">Prescribed on</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(medicine.prescribedDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Duration Info */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Duration</p>
                          <p className="text-sm font-semibold text-gray-900">{medicine.duration_days} days</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Days Remaining</p>
                          <p className={`text-sm font-semibold ${isEndingSoon ? 'text-orange-600' : 'text-gray-900'}`}>
                            {daysRemaining} days
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
