import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    FileText,
    User,
    Calendar,
    Clock,
    Activity,
    Download,
    Printer,
    CheckCircle,
    Loader2,
    ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConsultationService from '@/services/consultation.service';
import { PrescriptionEditor } from '../components/PrescriptionEditor';

export const DoctorConsultationSummary = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const consultationId = searchParams.get('consultationId');

    const [consultationData, setConsultationData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchConsultation = async () => {
            if (!consultationId) {
                setError('No consultation ID provided');
                setIsLoading(false);
                return;
            }

            try {
                const response = await ConsultationService.getConsultationResult(consultationId);
                if (response.success && response.data) {
                    setConsultationData(response.data);
                } else {
                    setError(response.error || 'Failed to load consultation');
                }
            } catch (err) {
                setError('An error occurred while loading the consultation');
            } finally {
                setIsLoading(false);
            }
        };

        fetchConsultation();
    }, [consultationId]);

    const handleSavePrescription = async (prescription: any) => {
        if (!consultationData?._id) return;

        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');

            // Save to new Prescription model
            const response = await fetch('/api/prescriptions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    consultationId: consultationData._id,
                    medicines: prescription.medicines,
                    followUp: prescription.follow_up_date ? {
                        date: prescription.follow_up_date,
                        notes: ''
                    } : null,
                    additionalInstructions: prescription.additional_instructions,
                    contraindications: prescription.contraindications,
                    doctorNotes: ''
                }),
            });

            const result = await response.json();

            if (result.success) {
                alert('Prescription saved successfully!');

                // Also update consultation prescription for backward compatibility
                const consultationResponse = await ConsultationService.updatePrescription(
                    consultationData._id,
                    prescription
                );

                if (consultationResponse.success) {
                    setConsultationData(consultationResponse.data);
                }
            } else {
                alert(`Failed to save prescription: ${result.error}`);
            }
        } catch (err) {
            alert('An error occurred while saving the prescription');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !consultationData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-500 mb-4">{error || 'Consultation not found'}</p>
                <Button onClick={() => navigate('/doctor-dashboard')}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    const patient = consultationData.appointment?.patient;
    const appointmentDate = new Date(consultationData.appointment?.appointmentDate);

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Consultation Summary</h1>
                    <p className="text-gray-600 mt-1">Review and finalize consultation details</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                    </Button>
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                    </Button>
                </div>
            </div>

            {/* Patient Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Patient Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Name</p>
                            <p className="font-semibold">{patient?.name || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-semibold">{patient?.email || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Consultation Date</p>
                            <p className="font-semibold">
                                {appointmentDate.toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="prescription">Prescription</TabsTrigger>
                    <TabsTrigger value="transcription">Transcription</TabsTrigger>
                </TabsList>

                {/* Summary Tab */}
                <TabsContent value="summary" className="space-y-4">
                    {/* Diagnosis */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="w-5 h-5" />
                                Diagnosis
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700">
                                {consultationData.summary?.diagnosis_discussed || 'No diagnosis recorded'}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Key Symptoms */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Key Symptoms</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {consultationData.summary?.key_symptoms?.map((symptom: string, index: number) => (
                                    <Badge key={index} variant="secondary">
                                        {symptom}
                                    </Badge>
                                )) || <p className="text-gray-500">No symptoms recorded</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Doctor Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Clinical Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 whitespace-pre-wrap">
                                {consultationData.summary?.doctor_summary || 'No notes available'}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Follow-up Instructions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Follow-up Instructions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc list-inside space-y-1">
                                {consultationData.summary?.follow_up_instructions?.map((instruction: string, index: number) => (
                                    <li key={index} className="text-gray-700">{instruction}</li>
                                )) || <p className="text-gray-500">No follow-up instructions</p>}
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Prescription Tab */}
                <TabsContent value="prescription">
                    <PrescriptionEditor
                        initialPrescription={consultationData.prescription || {
                            medicines: [],
                            follow_up_date: null,
                            additional_instructions: [],
                            contraindications: []
                        }}
                        onSave={handleSavePrescription}
                        isSaving={isSaving}
                    />
                </TabsContent>

                {/* Transcription Tab */}
                <TabsContent value="transcription">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Full Transcription
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                                <p className="text-gray-700 whitespace-pre-wrap">
                                    {consultationData.transcription || 'No transcription available'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4">
                <Button variant="outline" onClick={() => navigate('/doctor-dashboard')}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>
                <Button onClick={() => navigate('/doctor-dashboard/confirmed-appointments')}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Consultation
                </Button>
            </div>
        </div>
    );
};
