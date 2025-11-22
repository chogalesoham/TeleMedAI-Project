// API Service - Centralized API calls
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export class ApiService {
  private static async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'An error occurred',
      };
    }
  }

  // Auth endpoints
  static async login(email: string, password: string, role: 'patient' | 'doctor') {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
  }

  static async signup(userData: any) {
    return this.request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Health check
  static async healthCheck() {
    return this.request('/health');
  }
}
