import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface DoctorOnboardingStatusResponse {
    success: boolean;
    data: {
        exists: boolean;
        progress: {
            step1Completed: boolean;
            step2Completed: boolean;
            step3Completed: boolean;
            step4Completed: boolean;
            isCompleted: boolean;
            currentStep: number;
        };
        verificationStatus?: string;
    };
}

interface SaveDoctorOnboardingRequest {
    step: number;
    data: any;
}

interface SaveDoctorOnboardingResponse {
    success: boolean;
    message: string;
    data: {
        onboarding: any;
        progress: {
            step1Completed: boolean;
            step2Completed: boolean;
            step3Completed: boolean;
            step4Completed: boolean;
            isCompleted: boolean;
            currentStep: number;
        };
    };
}

/**
 * Get the authorization header with JWT token
 */
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Get onboarding status for the logged-in doctor
 */
export const getDoctorOnboardingStatus = async (): Promise<DoctorOnboardingStatusResponse> => {
    try {
        const response = await axios.get<DoctorOnboardingStatusResponse>(
            `${API_URL}/doctor/onboarding/status`,
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error: any) {
        console.error('Error fetching doctor onboarding status:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch onboarding status');
    }
};

/**
 * Save doctor onboarding data for a specific step
 */
export const saveDoctorOnboardingData = async (
    step: number,
    data: any
): Promise<SaveDoctorOnboardingResponse> => {
    try {
        const response = await axios.post<SaveDoctorOnboardingResponse>(
            `${API_URL}/doctor/onboarding/save`,
            { step, data },
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error: any) {
        console.error('Error saving doctor onboarding data:', error);
        throw new Error(error.response?.data?.message || 'Failed to save onboarding data');
    }
};

/**
 * Get complete doctor onboarding data
 */
export const getDoctorOnboardingData = async () => {
    try {
        const response = await axios.get(
            `${API_URL}/doctor/onboarding/data`,
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error: any) {
        console.error('Error fetching doctor onboarding data:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch onboarding data');
    }
};

/**
 * Update practice details (availability, consultation fees)
 */
export const updatePracticeDetails = async (practiceData: {
    availability?: any[];
    consultationFee?: {
        currency: string;
        amount: number;
        mode: string;
    };
}) => {
    try {
        const response = await axios.put(
            `${API_URL}/doctor/onboarding/practice-details`,
            practiceData,
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error: any) {
        console.error('Error updating practice details:', error);
        throw new Error(error.response?.data?.message || 'Failed to update practice details');
    }
};
