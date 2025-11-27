import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Get authorization header with JWT token
 */
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Get patient dashboard stats
 */
export const getPatientDashboardStats = async () => {
    try {
        const response = await axios.get(
            `${API_URL}/appointments/stats`,
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error: any) {
        console.error('Get patient dashboard stats error:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
};

/**
 * Get patient appointments
 */
export const getPatientAppointments = async (params?: { status?: string; startDate?: string; endDate?: string }) => {
    try {
        const response = await axios.get(
            `${API_URL}/appointments/patient`,
            {
                headers: getAuthHeader(),
                params
            }
        );
        return response.data;
    } catch (error: any) {
        console.error('Get patient appointments error:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch appointments');
    }
};

/**
 * Get patient profile with health data
 */
export const getPatientProfile = async () => {
    try {
        const response = await axios.get(
            `${API_URL}/patient/profile`,
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error: any) {
        console.error('Get patient profile error:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
};
