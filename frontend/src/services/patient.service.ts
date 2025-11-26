// Patient Service - API calls for patient functionalities

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Get auth token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Get auth headers
const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export class PatientService {
    /**
     * Get patient profile with onboarding data
     */
    static async getPatientProfile(): Promise<ApiResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/patient/profile`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch profile');
            }

            return data;
        } catch (error) {
            console.error('Error fetching patient profile:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'An error occurred',
            };
        }
    }

    /**
     * Get all approved doctors
     */
    static async getApprovedDoctors(params?: {
        specialization?: string;
        search?: string;
        sortBy?: 'rating' | 'price' | 'experience';
    }): Promise<ApiResponse> {
        try {
            const queryParams = new URLSearchParams();

            if (params?.specialization) queryParams.append('specialization', params.specialization);
            if (params?.search) queryParams.append('search', params.search);
            if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

            const url = `${API_BASE_URL}/api/patient/doctors${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: getAuthHeaders(),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch doctors');
            }

            return data;
        } catch (error) {
            console.error('Error fetching doctors:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'An error occurred',
            };
        }
    }

    /**
     * Get doctor details by ID
     */
    static async getDoctorById(doctorId: string): Promise<ApiResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/patient/doctors/${doctorId}`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch doctor details');
            }

            return data;
        } catch (error) {
            console.error('Error fetching doctor details:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'An error occurred',
            };
        }
    }
}

export default PatientService;
