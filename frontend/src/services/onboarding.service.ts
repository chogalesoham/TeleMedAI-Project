import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface OnboardingStatusResponse {
  success: boolean;
  data: {
    exists: boolean;
    isCompleted: boolean;
    currentStep: number;
    progress: {
      step1Completed: boolean;
      step2Completed: boolean;
      step3Completed: boolean;
      step4Completed: boolean;
    };
    completedAt?: string;
    onboardingData?: any;
  };
}

interface SaveOnboardingRequest {
  step: number;
  data: any;
}

interface SaveOnboardingResponse {
  success: boolean;
  message: string;
  data: {
    currentStep: number;
    isCompleted: boolean;
    progress: {
      step1Completed: boolean;
      step2Completed: boolean;
      step3Completed: boolean;
      step4Completed: boolean;
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
 * Get onboarding status for the logged-in patient
 */
export const getOnboardingStatus = async (): Promise<OnboardingStatusResponse> => {
  try {
    const response = await axios.get<OnboardingStatusResponse>(
      `${API_URL}/patient/onboarding/status`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error: any) {
    console.error('Error fetching onboarding status:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch onboarding status');
  }
};

/**
 * Save onboarding data for a specific step
 */
export const saveOnboardingData = async (
  step: number,
  data: any
): Promise<SaveOnboardingResponse> => {
  try {
    const response = await axios.post<SaveOnboardingResponse>(
      `${API_URL}/patient/onboarding/save`,
      { step, data },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error: any) {
    console.error('Error saving onboarding data:', error);
    throw new Error(error.response?.data?.message || 'Failed to save onboarding data');
  }
};

/**
 * Get complete onboarding data
 */
export const getOnboardingData = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/patient/onboarding/data`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error: any) {
    console.error('Error fetching onboarding data:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch onboarding data');
  }
};

/**
 * Update medical information (allergies, conditions, emergency contacts)
 */
export const updateMedicalInfo = async (medicalData: {
  allergies?: any[];
  chronicConditions?: string[];
  emergencyContacts?: any[];
}) => {
  try {
    const response = await axios.put(
      `${API_URL}/patient/onboarding/medical-info`,
      medicalData,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error: any) {
    console.error('Error updating medical info:', error);
    throw new Error(error.response?.data?.message || 'Failed to update medical information');
  }
};
