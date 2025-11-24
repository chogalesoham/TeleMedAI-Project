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
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM', '06:00 PM'
];

export const AppointmentBooking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  // Get doctor from navigation state or fallback to query params or default
  const doctorFromState = location.state?.doctor;
  const doctorId = searchParams.get('doctorId') || doctorFromState?.id || '1';
  const doctor = doctorFromState || mockDoctors.find(d => d.id === doctorId) || mockDoctors[0];

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
    <div className="mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8 sm:h-10 sm:w-10">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-2 truncate">Book Appointment</h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 truncate">Schedule your consultation with {doctor.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Booking Form */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Doctor Info Card */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
                  <AvatarImage src={doctor.image} />
                  <AvatarFallback>{doctor.name[4]}{doctor.name.split(' ')[1]?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 w-full sm:w-auto">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{doctor.name}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{doctor.specialization}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">{doctor.experience} years experience</p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                    <Badge variant="secondary" className="text-xs">{doctor.rating} ⭐</Badge>
                    <span className="text-xs sm:text-sm text-gray-600 truncate">{doctor.location}</span>
                  </div>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto">
                  <p className="text-xs sm:text-sm text-gray-600">Consultation Fee</p>
                  <p className="text-xl sm:text-2xl font-bold text-primary">${doctor.consultationFee}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consultation Type */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <Label className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 block">Select Consultation Type</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setConsultationType('video')}
                  className={`
                    relative p-4 sm:p-6 rounded-lg border-2 cursor-pointer transition-colors
                    ${consultationType === 'video' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}
                  `}
                >
                  <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center ${
                      consultationType === 'video' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Video className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">Video Consultation</p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Consult from anywhere</p>
                    </div>
                    {consultationType === 'video' && (
                      <CheckCircle2 className="absolute top-2 right-2 sm:top-4 sm:right-4 w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    )}
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setConsultationType('in-person')}
                  className={`
                    relative p-4 sm:p-6 rounded-lg border-2 cursor-pointer transition-colors
                    ${consultationType === 'in-person' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}
                  `}
                >
                  <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center ${
                      consultationType === 'in-person' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <MapPin className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">In-Person Visit</p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Visit doctor's clinic</p>
                    </div>
                    {consultationType === 'in-person' && (
                      <CheckCircle2 className="absolute top-2 right-2 sm:top-4 sm:right-4 w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    )}
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>

          {/* Date Selection */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <Label className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 block">Select Date</Label>
              <div className="flex justify-center overflow-x-auto">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border scale-90 sm:scale-100 origin-center"
                />
              </div>
            </CardContent>
          </Card>

          {/* Time Selection */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <Label className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 block">Select Time Slot</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                {timeSlots.map((time) => (
                  <motion.button
                    key={time}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTime(time)}
                    className={`
                      px-2 sm:px-4 py-2 rounded-lg border-2 font-medium text-xs sm:text-sm transition-colors
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
            <CardContent className="p-4 sm:p-6">
              <Label htmlFor="notes" className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 block">
                Additional Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Please describe your symptoms or reason for consultation..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px] sm:min-h-[120px] text-sm sm:text-base"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Summary */}
        <div className="space-y-4 sm:space-y-6">
          <Card className="lg:sticky lg:top-6">
            <CardContent className="p-4 sm:p-6">
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Booking Summary</h3>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3 pb-2 sm:pb-3 border-b">
                  <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-600">Date</p>
                    <p className="font-medium text-sm sm:text-base truncate">
                      {selectedDate 
                        ? selectedDate.toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : 'Select a date'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 pb-2 sm:pb-3 border-b">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-600">Time</p>
                    <p className="font-medium text-sm sm:text-base">{selectedTime || 'Select a time'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 pb-2 sm:pb-3 border-b">
                  {consultationType === 'video' ? (
                    <Video className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                  ) : (
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-600">Type</p>
                    <p className="font-medium text-sm sm:text-base capitalize truncate">{consultationType} Consultation</p>
                  </div>
                </div>

                <div className="pt-2 sm:pt-3">
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <span className="text-xs sm:text-sm text-gray-600">Consultation Fee</span>
                    <span className="font-medium text-sm sm:text-base">${doctor.consultationFee}</span>
                  </div>
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <span className="text-xs sm:text-sm text-gray-600">Platform Fee</span>
                    <span className="font-medium text-sm sm:text-base">$5</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 sm:pt-3 border-t">
                    <span className="font-semibold text-base sm:text-lg">Total</span>
                    <span className="font-bold text-lg sm:text-xl text-primary">${doctor.consultationFee + 5}</span>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full mt-4 sm:mt-6 h-10 sm:h-11 text-sm sm:text-base" 
                size="lg"
                disabled={!selectedDate || !selectedTime}
                onClick={handleBookAppointment}
              >
                Book Appointment
              </Button>

              <p className="text-xs text-gray-500 text-center mt-2 sm:mt-3">
                You can cancel or reschedule up to 24 hours before your appointment
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              Confirm Booking
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4">
            <p className="text-sm sm:text-base text-gray-600">
              Please confirm your appointment details:
            </p>
            
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-1.5 sm:space-y-2">
              <div className="flex justify-between items-start gap-2">
                <span className="text-xs sm:text-sm text-gray-600">Doctor:</span>
                <span className="font-medium text-xs sm:text-sm text-right">{doctor.name}</span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-xs sm:text-sm text-gray-600">Date:</span>
                <span className="font-medium text-xs sm:text-sm text-right">
                  {selectedDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-xs sm:text-sm text-gray-600">Time:</span>
                <span className="font-medium text-xs sm:text-sm">{selectedTime}</span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-xs sm:text-sm text-gray-600">Type:</span>
                <span className="font-medium text-xs sm:text-sm capitalize">{consultationType}</span>
              </div>
              <div className="flex justify-between items-start gap-2 pt-1.5 sm:pt-2 border-t">
                <span className="text-xs sm:text-sm text-gray-600">Total:</span>
                <span className="font-bold text-sm sm:text-base text-primary">${doctor.consultationFee + 5}</span>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <Button variant="outline" className="flex-1 h-9 sm:h-10 text-xs sm:text-sm" onClick={() => setShowConfirmation(false)}>
                Cancel
              </Button>
              <Button className="flex-1 h-9 sm:h-10 text-xs sm:text-sm" onClick={handleConfirmBooking}>
                Confirm & Pay
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
