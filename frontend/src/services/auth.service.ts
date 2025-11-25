import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface SignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: any;
    onboardingCompleted?: boolean;
    redirectTo?: string;
  };
  error?: string;
}

/**
 * Get authorization header with JWT token
 */
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Patient Signup
 */
export const patientSignup = async (data: SignupData): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_URL}/auth/patient/signup`,
      data
    );
    
    // Store token if signup successful
    if (response.data.success && response.data.data?.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Signup error:', error);
    throw new Error(error.response?.data?.message || 'Signup failed. Please try again.');
  }
};

/**
 * Patient Login
 */
export const patientLogin = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_URL}/auth/patient/login`,
      data
    );
    
    // Store token and user data if login successful
    if (response.data.success && response.data.data?.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
  }
};

/**
 * Admin Login
 */
export const adminLogin = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_URL}/auth/admin/login`,
      data
    );
    
    // Store token and user data if login successful
    if (response.data.success && response.data.data?.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Admin login error:', error);
    throw new Error(error.response?.data?.message || 'Admin login failed. Please try again.');
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/auth/me`,
      { headers: getAuthHeader() }
    );
    
    // Update localStorage with fresh user data
    if (response.data?.success && response.data?.data?.user) {
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Get current user error:', error);
    throw new Error(error.response?.data?.message || 'Failed to get user data');
  }
};

/**
 * Logout
 */
export const logout = async () => {
  try {
    await axios.post(
      `${API_URL}/auth/logout`,
      {},
      { headers: getAuthHeader() }
    );
    
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    return { success: true };
  } catch (error: any) {
    console.error('Logout error:', error);
    // Clear local storage even if API call fails
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    throw new Error(error.response?.data?.message || 'Logout failed');
  }
};

/**
 * Change password
 */
export const changePassword = async (currentPassword: string, newPassword: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/change-password`,
      { currentPassword, newPassword },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error: any) {
    console.error('Change password error:', error);
    throw new Error(error.response?.data?.message || 'Failed to change password');
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

/**
 * Get stored user data
 */
export const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Update user profile
 */
export const updateProfile = async (profileData: any) => {
  try {
    const response = await axios.put(
      `${API_URL}/auth/profile`,
      profileData,
      { headers: getAuthHeader() }
    );
    
    // Update localStorage with new user data
    if (response.data?.success && response.data?.data?.user) {
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Update profile error:', error);
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};
