import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Video,
    Mic,
    MicOff,
    VideoOff,
    PhoneOff,
    Maximize,
    MessageSquare,
    FileText,
    Clock,
    Activity,
    AlertCircle,
    Loader2,
    Calendar
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useWebRTC } from '@/hooks/useWebRTC';
import AppointmentService, { Appointment } from '@/services/appointment.service';

export const LiveConsultation = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const consultationId = searchParams.get('consultationId') || 'default-consultation';

    const [notes, setNotes] = useState('');
    const [duration, setDuration] = useState(0);
    const [aiInsights, setAiInsights] = useState<string[]>([]);
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [isLoadingAppointment, setIsLoadingAppointment] = useState(true);
    const [appointmentError, setAppointmentError] = useState<string | null>(null);

    // Fetch appointment to check approval status
    useEffect(() => {
        const fetchAppointment = async () => {
            if (consultationId === 'default-consultation') {
                setAppointmentError('No consultation ID provided');
                setIsLoadingAppointment(false);
                return;
            }

            const response = await AppointmentService.getAppointmentById(consultationId);
            if (response.success && response.data) {
                setAppointment(response.data);
            } else {
                setAppointmentError(response.error || 'Failed to load appointment');
            }
            setIsLoadingAppointment(false);
        };

        fetchAppointment();
    }, [consultationId]);

    // WebRTC hook - only initialize if appointment is approved
    const shouldEnableWebRTC = appointment?.status === 'confirmed';
    const {
        localStream,
        remoteStream,
        isConnected,
        connectionQuality,
        isMicEnabled,
        isCameraEnabled,
        permissionError,
        toggleMic,
        toggleCamera,
        endCall,
    } = useWebRTC({
        consultationId: shouldEnableWebRTC ? consultationId : '',
        userType: 'doctor',
    });

    // Video refs
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    // Attach local stream to video element
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    // Attach remote stream to video element
    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    useEffect(() => {
        const timer = setInterval(() => {
            setDuration(prev => prev + 1);
        }, 1000);

        // Simulate AI insights appearing during consultation
        const insightsTimer = setTimeout(() => {
            setAiInsights([
                'Patient mentions persistent headaches - consider migraine assessment',
                'Blood pressure readings within normal range',
                'Recommend follow-up in 2 weeks'
            ]);
        }, 3000);

        return () => {
            clearInterval(timer);
            clearTimeout(insightsTimer);
        };
    }, []);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleEndCall = () => {
        endCall();
        navigate('/doctor-dashboard');
    };

    // Get connection status display
    const getConnectionStatus = () => {
        switch (connectionQuality) {
            case 'excellent':
                return { text: 'Excellent', color: 'text-green-700', bgColor: 'bg-green-600' };
            case 'good':
                return { text: 'Good', color: 'text-blue-700', bgColor: 'bg-blue-600' };
            case 'poor':
                return { text: 'Poor', color: 'text-yellow-700', bgColor: 'bg-yellow-600' };
            default:
                return { text: 'Connecting...', color: 'text-gray-700', bgColor: 'bg-gray-600' };
        }
    };

    const connectionStatus = getConnectionStatus();

    const patient = {
        name: appointment?.patient.name || 'John Smith',
        medicalIssue: appointment?.reasonForVisit || 'Persistent Headaches',
        image: appointment?.patient.profilePicture || '/patients/john.jpg'
    };

    // Loading state
    if (isLoadingAppointment) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
                <Card className="max-w-md w-full shadow-xl">
                    <CardContent className="p-8 text-center">
                        <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Loading Consultation...</h2>
                        <p className="text-gray-600">Please wait while we prepare your consultation room.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Error state - show meeting code entry
    if (appointmentError || !appointment) {
        return (
            <div className="flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-lg"
                >
                    <Card className="shadow-2xl border-0 overflow-hidden">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-6 text-white">
                            <div className="flex items-center justify-center mb-3">
                                <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
                                    <Video className="w-8 h-8" />
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold text-center mb-1">Join Live Consultation</h1>
                            <p className="text-center text-white/90 text-xs">
                                Enter the meeting code to start consultation with your patient
                            </p>
                        </div>

                        <CardContent className="p-6">
                            {/* Meeting Code Entry Section */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                                        Meeting Code
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Enter meeting code"
                                            className="w-full px-4 py-3 text-base font-mono tracking-wider border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all outline-none uppercase"
                                            maxLength={20}
                                            onChange={(e) => {
                                                const code = e.target.value.trim();
                                                if (code) {
                                                    navigate(`/doctor-dashboard/live-consultation?consultationId=${code}`);
                                                }
                                            }}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    const code = (e.target as HTMLInputElement).value.trim();
                                                    if (code) {
                                                        navigate(`/doctor-dashboard/live-consultation?consultationId=${code}`);
                                                    }
                                                }
                                            }}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <Video className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                    <p className="mt-1.5 text-xs text-gray-500">
                                        Find code in confirmed appointment details
                                    </p>
                                </div>

                                {/* Error Message if any */}
                                {appointmentError && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="bg-red-50 border border-red-200 rounded-lg p-3"
                                    >
                                        <div className="flex items-start gap-2">
                                            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs font-semibold text-red-900">Unable to load consultation</p>
                                                <p className="text-xs text-red-700 mt-0.5">{appointmentError}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Divider */}
                                <div className="relative py-2">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs">
                                        <span className="px-3 bg-white text-gray-500">or</span>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-center border-2 hover:bg-gray-50"
                                    onClick={() => navigate('/doctor-dashboard/confirmed-appointments')}
                                >
                                    <Calendar className="w-4 h-4 mr-2" />
                                    View Confirmed Appointments
                                </Button>

                                {/* Help Section */}
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <h3 className="text-xs font-semibold text-green-900 mb-1.5 flex items-center gap-1.5">
                                        <FileText className="w-3.5 h-3.5" />
                                        How to find the meeting code
                                    </h3>
                                    <ul className="text-xs text-green-800 space-y-1">
                                        <li className="flex items-start gap-1.5">
                                            <span className="text-green-600 font-bold">1.</span>
                                            <span>Go to confirmed appointments page</span>
                                        </li>
                                        <li className="flex items-start gap-1.5">
                                            <span className="text-green-600 font-bold">2.</span>
                                            <span>Find the appointment to join</span>
                                        </li>
                                        <li className="flex items-start gap-1.5">
                                            <span className="text-green-600 font-bold">3.</span>
                                            <span>The code is shown in the appointment card</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    // Access denied - appointment not approved
    if (appointment.status !== 'confirmed') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
                <Card className="max-w-md w-full shadow-xl">
                    <CardContent className="p-8 text-center">
                        <AlertCircle className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Appointment Not Approved</h2>
                        <p className="text-gray-600 mb-4">
                            This appointment has not been approved yet.
                            Please approve the appointment before starting the consultation.
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <p className="text-sm text-gray-700">
                                <strong>Status:</strong> <span className="capitalize">{appointment.status}</span>
                            </p>
                        </div>
                        <Button onClick={() => navigate('/doctor-dashboard/appointment-requests')}>
                            Go to Appointment Requests
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col space-y-3 sm:space-y-4">
            {/* Permission Error Banner */}
            {permissionError && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border-2 border-red-300 rounded-lg p-4"
                >
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="text-red-900 font-semibold text-sm sm:text-base mb-1">Camera/Microphone Access Required</h3>
                            <p className="text-red-800 text-xs sm:text-sm mb-3">{permissionError}</p>
                            <div className="bg-white/50 rounded-md p-3 text-xs sm:text-sm space-y-2">
                                <p className="font-semibold text-red-900">How to fix:</p>
                                <ol className="list-decimal list-inside space-y-1 text-red-800">
                                    <li>Click the lock icon (🔒) or camera icon in your browser's address bar</li>
                                    <li>Change Camera and Microphone permissions to "Allow"</li>
                                    <li>Refresh this page</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 border border-red-200 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    {/* Left Section - Title & Status */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 sm:gap-3 mb-2">
                            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Live Consultation</h1>
                            <Badge variant="destructive" className="animate-pulse text-xs font-semibold">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white mr-1.5 sm:mr-2 animate-pulse" />
                                LIVE
                            </Badge>
                        </div>

                        {/* Patient Info Row */}
                        <div className="flex items-center gap-2 sm:gap-3 mb-2">
                            <Avatar className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-white shadow-sm">
                                <AvatarImage src={patient.image} />
                                <AvatarFallback className="text-xs sm:text-sm">{patient.name[0]}{patient.name.split(' ')[1]?.[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm sm:text-base font-semibold text-gray-900">{patient.name}</p>
                                <p className="text-xs sm:text-sm text-gray-600">{patient.medicalIssue}</p>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                            <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                                <span className="text-gray-600">Duration:</span>
                                <span className="font-semibold text-gray-900">{formatDuration(duration)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                                <div className={`w-2 h-2 rounded-full ${connectionStatus.bgColor} ${isConnected ? 'animate-pulse' : ''}`} />
                                <span className="text-gray-600">Connection:</span>
                                <span className={`font-semibold ${connectionStatus.color}`}>{connectionStatus.text}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                                <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                                <span className="font-semibold text-primary">AI Assistant Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Quick Actions */}
                    <div className="flex sm:flex-col gap-2 sm:items-end">
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs sm:text-sm h-8 sm:h-9"
                            onClick={() => {/* Toggle fullscreen */ }}
                        >
                            <Maximize className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Fullscreen</span>
                            <span className="sm:hidden">Full</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs sm:text-sm h-8 sm:h-9"
                            onClick={() => {/* Share screen */ }}
                        >
                            <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Chat</span>
                            <span className="sm:hidden">Chat</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 min-h-0">
                {/* Video Section */}
                <div className="lg:col-span-2 flex flex-col gap-3 sm:gap-4">
                    {/* Patient Video (Large) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 relative bg-gray-900 rounded-lg overflow-hidden min-h-[300px] sm:min-h-[400px]"
                    >
                        {/* Remote Video Stream (Patient) */}
                        {remoteStream ? (
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                                <div className="text-center px-4">
                                    <Avatar className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto mb-3 sm:mb-4 border-2 sm:border-4 border-white/20">
                                        <AvatarImage src={patient.image} />
                                        <AvatarFallback>{patient.name[0]}{patient.name.split(' ')[1]?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <h3 className="text-white text-base sm:text-lg md:text-xl font-semibold truncate">{patient.name}</h3>
                                    <p className="text-gray-300 text-sm sm:text-base truncate">{patient.medicalIssue}</p>
                                    <p className="text-gray-400 text-xs sm:text-sm mt-2">Waiting for patient to join...</p>
                                </div>
                            </div>
                        )}

                        {/* Local Video Stream (Doctor - Picture in Picture) */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 md:bottom-4 md:right-4 w-24 h-20 sm:w-32 sm:h-24 md:w-48 md:h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white/20"
                        >
                            {localStream && isCameraEnabled ? (
                                <video
                                    ref={localVideoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                                    <div className="text-center">
                                        <VideoOff className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white mx-auto mb-1 sm:mb-2" />
                                        <p className="text-white text-xs sm:text-sm">Camera Off</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>


                        {/* Connection Quality Indicator */}
                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4">
                            <Badge variant="secondary" className={`${connectionStatus.bgColor} text-white text-xs`}>
                                <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white mr-1 sm:mr-2 ${isConnected ? 'animate-pulse' : ''}`} />
                                <span className="hidden sm:inline">{connectionStatus.text} Connection</span>
                                <span className="sm:hidden">{connectionStatus.text}</span>
                            </Badge>
                        </div>

                        {/* Fullscreen Button */}
                        <Button
                            size="icon"
                            variant="secondary"
                            className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10"
                        >
                            <Maximize className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                    </motion.div>

                    {/* Call Controls */}
                    <Card>
                        <CardContent className="p-3 sm:p-4">
                            <div className="flex items-center justify-center gap-3 sm:gap-4">
                                <Button
                                    size="lg"
                                    variant={!isMicEnabled ? 'destructive' : 'outline'}
                                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full"
                                    onClick={toggleMic}
                                >
                                    {!isMicEnabled ? <MicOff className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6" /> : <Mic className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6" />}
                                </Button>

                                <Button
                                    size="lg"
                                    variant={!isCameraEnabled ? 'destructive' : 'outline'}
                                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full"
                                    onClick={toggleCamera}
                                >
                                    {!isCameraEnabled ? <VideoOff className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6" /> : <Video className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6" />}
                                </Button>

                                <Button
                                    size="lg"
                                    variant="destructive"
                                    className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full"
                                    onClick={handleEndCall}
                                >
                                    <PhoneOff className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Notes & AI Insights */}
                <div className="flex flex-col gap-3 sm:gap-4 min-h-0">
                    <Card className="flex-1 flex flex-col min-h-0">
                        <CardContent className="p-3 sm:p-4 flex flex-col flex-1 min-h-0">
                            <Tabs defaultValue="notes" className="flex-1 flex flex-col min-h-0">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="notes" className="text-xs sm:text-sm">
                                        <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                        <span className="hidden xs:inline">Notes</span>
                                        <span className="xs:hidden">Notes</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="ai" className="text-xs sm:text-sm">
                                        <Activity className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                        <span className="hidden xs:inline">AI Insights</span>
                                        <span className="xs:hidden">AI</span>
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="notes" className="flex-1 flex flex-col mt-3 sm:mt-4 min-h-0">
                                    <Label className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">Consultation Notes</Label>
                                    <Textarea
                                        placeholder="Take notes during your consultation..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="flex-1 resize-none text-xs sm:text-sm min-h-[120px]"
                                    />
                                    <p className="text-xs text-gray-500 mt-1.5 sm:mt-2">
                                        These notes will be included in your consultation summary
                                    </p>
                                </TabsContent>

                                <TabsContent value="ai" className="flex-1 flex flex-col mt-3 sm:mt-4 space-y-2 sm:space-y-3 overflow-y-auto">
                                    <div className="flex items-start gap-1.5 sm:gap-2 p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs sm:text-sm font-medium text-blue-900">AI Assistant Active</p>
                                            <p className="text-xs text-blue-700 mt-0.5 sm:mt-1">
                                                Listening and providing real-time insights
                                            </p>
                                        </div>
                                    </div>

                                    {aiInsights.length === 0 ? (
                                        <div className="flex-1 flex items-center justify-center text-center p-4 sm:p-6">
                                            <div>
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                                    className="w-10 h-10 sm:w-12 sm:h-12 border-3 sm:border-4 border-primary border-t-transparent rounded-full mx-auto mb-2 sm:mb-3"
                                                />
                                                <p className="text-xs sm:text-sm text-gray-600">Analyzing conversation...</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 sm:space-y-3">
                                            {aiInsights.map((insight, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.2 }}
                                                    className="p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200"
                                                >
                                                    <p className="text-xs sm:text-sm text-gray-900">{insight}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    {/* Quick Info */}
                    <Card>
                        <CardContent className="p-3 sm:p-4">
                            <h4 className="font-semibold text-xs sm:text-sm mb-2 sm:mb-3">Consultation Details</h4>
                            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Type:</span>
                                    <Badge variant="secondary" className="text-xs">Video Call</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Duration:</span>
                                    <span className="font-medium">{formatDuration(duration)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Status:</span>
                                    <Badge variant="destructive" className="animate-pulse text-xs">Live</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

// Label component for accessibility
const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <label className={className}>{children}</label>
);
