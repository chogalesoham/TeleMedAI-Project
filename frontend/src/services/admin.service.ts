// Admin Service - API calls for admin functionalities

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

export class AdminService {
  /**
   * Get all patients with optional filters
   */
  static async getAllPatients(params?: {
    search?: string;
    status?: 'active' | 'inactive';
    page?: number;
    limit?: number;
  }): Promise<ApiResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.search) queryParams.append('search', params.search);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const url = `${API_BASE_URL}/api/admin/patients${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch patients');
      }

      return data;
    } catch (error) {
      console.error('Error fetching patients:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      };
    }
  }

  /**
   * Get patient statistics
   */
  static async getPatientStats(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/patients/stats`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch patient statistics');
      }

      return data;
    } catch (error) {
      console.error('Error fetching patient stats:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      };
    }
  }

  /**
   * Get patient details by ID
   */
  static async getPatientById(id: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/patients/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch patient details');
      }

      return data;
    } catch (error) {
      console.error('Error fetching patient details:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      };
    }
  }

  /**
   * Update patient status (active/inactive)
   */
  static async updatePatientStatus(id: string, isActive: boolean): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/patients/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isActive }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update patient status');
      }

      return data;
    } catch (error) {
      console.error('Error updating patient status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      };
    }
  }
}

export default AdminService;
