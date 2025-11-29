// Consultation Service - Handle AI-powered consultation processing

const AI_API_BASE_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:8000';

interface ConsultationProcessResponse {
    success: boolean;
    transcription?: string;
    summary?: {
        doctor_summary: string;
        patient_summary: string;
        key_symptoms: string[];
        diagnosis_discussed: string;
        medications_prescribed: string[];
        follow_up_instructions: string[];
        important_notes: string[];
    };
    prescription?: {
        medicines: Array<{
            name: string;
            generic_name: string;
            dosage: string;
            frequency: {
                morning: boolean;
                afternoon: boolean;
                night: boolean;
            };
            duration_days: number;
            instructions: string;
            warnings: string;
        }>;
        follow_up_date: string | null;
        additional_instructions: string[];
        contraindications: string[];
    };
    error?: string;
}

export class ConsultationService {
    /**
     * Process consultation audio with AI
     * Sends audio file and patient data to Python backend for transcription and analysis
     */
    static async processConsultationAudio(
        audioFile: File,
        patientData: object
    ): Promise<ConsultationProcessResponse> {
        try {
            const formData = new FormData();

            // Add audio file
            formData.append('file', audioFile);

            // Add patient data as JSON string
            formData.append('patient_data', JSON.stringify(patientData));

            console.log('📤 Sending consultation audio to AI backend...');
            console.log('Audio file:', audioFile.name, `(${(audioFile.size / 1024 / 1024).toFixed(2)} MB)`);
            console.log('Patient data:', patientData);

            const response = await fetch(`${AI_API_BASE_URL}/api/v1/consultation/process`, {
                method: 'POST',
                body: formData,
                // Don't set Content-Type header - browser will set it automatically with boundary
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || data.error || 'Failed to process consultation');
            }

            console.log('✅ Consultation processed successfully');
            return data;

        } catch (error) {
            console.error('❌ Error processing consultation:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'An error occurred while processing consultation',
            };
        }
    }

    /**
     * Save consultation result to backend
     */
    static async saveConsultationResult(data: {
        appointmentId: string;
        transcription: string;
        summary: any;
        prescription: any;
    }): Promise<{ success: boolean; data?: any; error?: string }> {
        try {
            const token = localStorage.getItem('token');
            console.log('🔐 Token:', token ? 'Present' : 'Missing');
            console.log('📦 Payload:', { appointmentId: data.appointmentId });

            const response = await fetch(`/api/consultations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });

            console.log('📡 Response status:', response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Server error:', errorText);
                return {
                    success: false,
                    error: `Server error: ${response.status} - ${errorText}`
                };
            }

            const result = await response.json();
            console.log('✅ Save result:', result);
            return result;
        } catch (error) {
            console.error('Error saving consultation result:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to save consultation result'
            };
        }
    }

    /**
     * Get consultation result by ID
     */
    static async getConsultationResult(id: string): Promise<{ success: boolean; data?: any; error?: string }> {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/consultations/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error fetching consultation result:', error);
            return {
                success: false,
                error: 'Failed to fetch consultation result'
            };
        }
    }

    /**
     * Update prescription (Doctor only)
     */
    static async updatePrescription(consultationId: string, prescription: any): Promise<{ success: boolean; data?: any; error?: string }> {
        try {
            const token = localStorage.getItem('token');
            console.log('📝 Updating prescription for consultation:', consultationId);

            const response = await fetch(`/api/consultations/${consultationId}/prescription`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ prescription }),
            });

            console.log('📡 Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Server error:', errorText);
                return {
                    success: false,
                    error: `Server error: ${response.status} - ${errorText}`
                };
            }

            const result = await response.json();
            console.log('✅ Prescription updated:', result);
            return result;
        } catch (error) {
            console.error('Error updating prescription:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update prescription'
            };
        }
    }
}

export default ConsultationService;
