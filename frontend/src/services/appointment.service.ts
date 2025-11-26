import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface TimeSlot {
    startTime: string;
    endTime: string;
}

export interface AppointmentPayment {
    doctorFee: number;
    platformFee: number;
    totalAmount: number;
    currency: string;
    paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
    paymentId: string;
    paymentMethod: string;
    paidAt?: Date;
}

export interface Appointment {
    _id: string;
    patient: {
        _id: string;
        name: string;
        email: string;
        phone: string;
        profilePicture?: string;
        dateOfBirth?: Date;
        gender?: string;
    };
    doctor: {
        _id: string;
        name: string;
        email: string;
        phone: string;
        profilePicture?: string;
    };
    appointmentDate: Date;
    timeSlot: TimeSlot;
    consultationMode: 'tele' | 'in_person';
    reasonForVisit: string;
    symptoms?: string;
    status: 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'completed';
    payment: AppointmentPayment;
    videoCallEnabled: boolean;
    videoCallLink?: string;
    doctorNotes?: string;
    rejectionReason?: string;
    cancellationReason?: string;
    cancelledBy?: string;
    confirmedAt?: Date;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    doctorProfile?: {
        specialties: string[];
        languages: string[];
        shortBio: string;
    };
}

export interface CreateAppointmentData {
    doctorId: string;
    appointmentDate: Date | string;
    timeSlot: TimeSlot;
    consultationMode: 'tele' | 'in_person';
    reasonForVisit: string;
    symptoms?: string;
    payment: {
        paymentStatus: string;
        paymentId: string;
        paymentMethod: string;
    };
}

class AppointmentService {
    private getAuthHeader() {
        const token = localStorage.getItem('token');
        return {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };
    }

    // Create new appointment
    async createAppointment(appointmentData: CreateAppointmentData) {
        try {
            const response = await axios.post(
                `${API_URL}/appointments`,
                appointmentData,
                this.getAuthHeader()
            );
            return {
                success: true,
                data: response.data.data,
                message: response.data.message,
            };
        } catch (error: any) {
            console.error('Error creating appointment:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to create appointment',
            };
        }
    }

    // Get patient appointments
    async getPatientAppointments(patientId: string, status?: string) {
        try {
            const params = status ? { status } : {};
            const response = await axios.get(
                `${API_URL}/appointments/patient/${patientId}`,
                {
                    ...this.getAuthHeader(),
                    params,
                }
            );
            return {
                success: true,
                data: response.data.data,
                count: response.data.count,
            };
        } catch (error: any) {
            console.error('Error fetching patient appointments:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch appointments',
            };
        }
    }

    // Get doctor appointments
    async getDoctorAppointments(doctorId: string, status?: string) {
        try {
            const params = status ? { status } : {};
            const response = await axios.get(
                `${API_URL}/appointments/doctor/${doctorId}`,
                {
                    ...this.getAuthHeader(),
                    params,
                }
            );
            return {
                success: true,
                data: response.data.data,
                count: response.data.count,
            };
        } catch (error: any) {
            console.error('Error fetching doctor appointments:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch appointments',
            };
        }
    }

    // Get appointment by ID
    async getAppointmentById(id: string) {
        try {
            const response = await axios.get(
                `${API_URL}/appointments/${id}`,
                this.getAuthHeader()
            );
            return {
                success: true,
                data: response.data.data,
            };
        } catch (error: any) {
            console.error('Error fetching appointment:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch appointment',
            };
        }
    }

    // Update appointment status
    async updateAppointmentStatus(
        id: string,
        status: 'confirmed' | 'rejected' | 'cancelled' | 'completed',
        notes?: string,
        reason?: string
    ) {
        try {
            const response = await axios.patch(
                `${API_URL}/appointments/${id}/status`,
                { status, notes, reason },
                this.getAuthHeader()
            );
            return {
                success: true,
                data: response.data.data,
                message: response.data.message,
            };
        } catch (error: any) {
            console.error('Error updating appointment status:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to update appointment status',
            };
        }
    }

    // Complete appointment
    async completeAppointment(id: string, doctorNotes?: string, prescriptionUrl?: string) {
        try {
            const response = await axios.patch(
                `${API_URL}/appointments/${id}/complete`,
                { doctorNotes, prescriptionUrl },
                this.getAuthHeader()
            );
            return {
                success: true,
                data: response.data.data,
                message: response.data.message,
            };
        } catch (error: any) {
            console.error('Error completing appointment:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to complete appointment',
            };
        }
    }

    // Cancel appointment
    async cancelAppointment(id: string, reason: string) {
        return this.updateAppointmentStatus(id, 'cancelled', reason, reason);
    }

    // Approve appointment (doctor)
    async approveAppointment(id: string, notes?: string) {
        return this.updateAppointmentStatus(id, 'confirmed', notes);
    }

    // Reject appointment (doctor)
    async rejectAppointment(id: string, reason: string) {
        return this.updateAppointmentStatus(id, 'rejected', reason, reason);
    }

    // Get appointment statistics
    async getAppointmentStats() {
        try {
            const response = await axios.get(
                `${API_URL}/appointments/stats`,
                this.getAuthHeader()
            );
            return {
                success: true,
                data: response.data.data,
            };
        } catch (error: any) {
            console.error('Error fetching appointment stats:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch appointment statistics',
            };
        }
    }
}

export default new AppointmentService();
