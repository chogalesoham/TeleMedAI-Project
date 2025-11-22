import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  MapPin, 
  CheckCircle2,
  ArrowLeft,
  X
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { mockDoctors } from '../data/mockData';
import { useNavigate, useSearchParams } from 'react-router-dom';

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM', '06:00 PM'
];

export const AppointmentBooking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get('doctorId') || '1';
  const doctor = mockDoctors.find(d => d.id === doctorId) || mockDoctors[0];

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [consultationType, setConsultationType] = useState<'video' | 'in-person'>('video');
  const [notes, setNotes] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleBookAppointment = () => {
    if (selectedDate && selectedTime) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmBooking = () => {
    // Here you would typically make an API call
    setShowConfirmation(false);
    navigate('/patient-dashboard', {
      state: { message: 'Appointment booked successfully!' }
    });
  };

  return (
    <div className="mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Appointment</h1>
          <p className="text-gray-600">Schedule your consultation with {doctor.name}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Doctor Info Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={doctor.image} />
                  <AvatarFallback>{doctor.name[4]}{doctor.name.split(' ')[1]?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                  <p className="text-gray-600">{doctor.specialization}</p>
                  <p className="text-sm text-gray-500 mt-1">{doctor.experience} years experience</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="secondary">{doctor.rating} ⭐</Badge>
                    <span className="text-sm text-gray-600">{doctor.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Consultation Fee</p>
                  <p className="text-2xl font-bold text-primary">${doctor.consultationFee}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consultation Type */}
          <Card>
            <CardContent className="p-6">
              <Label className="text-base font-semibold mb-3 block">Select Consultation Type</Label>
              <div className="grid sm:grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setConsultationType('video')}
                  className={`
                    relative p-6 rounded-lg border-2 cursor-pointer transition-colors
                    ${consultationType === 'video' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}
                  `}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      consultationType === 'video' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Video className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Video Consultation</p>
                      <p className="text-sm text-gray-600 mt-1">Consult from anywhere</p>
                    </div>
                    {consultationType === 'video' && (
                      <CheckCircle2 className="absolute top-4 right-4 w-6 h-6 text-primary" />
                    )}
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setConsultationType('in-person')}
                  className={`
                    relative p-6 rounded-lg border-2 cursor-pointer transition-colors
                    ${consultationType === 'in-person' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}
                  `}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      consultationType === 'in-person' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <MapPin className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">In-Person Visit</p>
                      <p className="text-sm text-gray-600 mt-1">Visit doctor's clinic</p>
                    </div>
                    {consultationType === 'in-person' && (
                      <CheckCircle2 className="absolute top-4 right-4 w-6 h-6 text-primary" />
                    )}
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>

          {/* Date Selection */}
          <Card>
            <CardContent className="p-6">
              <Label className="text-base font-semibold mb-3 block">Select Date</Label>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </div>
            </CardContent>
          </Card>

          {/* Time Selection */}
          <Card>
            <CardContent className="p-6">
              <Label className="text-base font-semibold mb-3 block">Select Time Slot</Label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {timeSlots.map((time) => (
                  <motion.button
                    key={time}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTime(time)}
                    className={`
                      px-4 py-2 rounded-lg border-2 font-medium text-sm transition-colors
                      ${selectedTime === time 
                        ? 'border-primary bg-primary text-white' 
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }
                    `}
                  >
                    {time}
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card>
            <CardContent className="p-6">
              <Label htmlFor="notes" className="text-base font-semibold mb-3 block">
                Additional Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Please describe your symptoms or reason for consultation..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[120px]"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Summary */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Booking Summary</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b">
                  <CalendarIcon className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium">
                      {selectedDate 
                        ? selectedDate.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : 'Select a date'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pb-3 border-b">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-medium">{selectedTime || 'Select a time'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pb-3 border-b">
                  {consultationType === 'video' ? (
                    <Video className="w-5 h-5 text-gray-600" />
                  ) : (
                    <MapPin className="w-5 h-5 text-gray-600" />
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-medium capitalize">{consultationType} Consultation</p>
                  </div>
                </div>

                <div className="pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Consultation Fee</span>
                    <span className="font-medium">${doctor.consultationFee}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Platform Fee</span>
                    <span className="font-medium">$5</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="font-semibold text-lg">Total</span>
                    <span className="font-bold text-xl text-primary">${doctor.consultationFee + 5}</span>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full mt-6" 
                size="lg"
                disabled={!selectedDate || !selectedTime}
                onClick={handleBookAppointment}
              >
                Book Appointment
              </Button>

              <p className="text-xs text-gray-500 text-center mt-3">
                You can cancel or reschedule up to 24 hours before your appointment
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              Confirm Booking
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Please confirm your appointment details:
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Doctor:</span>
                <span className="font-medium">{doctor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {selectedDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium capitalize">{consultationType}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-gray-600">Total:</span>
                <span className="font-bold text-primary">${doctor.consultationFee + 5}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowConfirmation(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleConfirmBooking}>
                Confirm & Pay
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
