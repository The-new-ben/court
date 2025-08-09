const API_BASE_URL = import.meta.env.PROD
  ? 'https://api.hypercourt.com'
  : 'http://localhost:5001';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  details?: string[];
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return { error: data.error || 'שגיאה לא צפויה', details: data.details };
      }

      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: 'שגיאה בחיבור לשרת' };
    }
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
    role?: string;
  }): Promise<ApiResponse<{ user?: any }>> {
    return this.makeRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ user?: any }>> {
    return this.makeRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<void> {
    await this.makeRequest('/api/auth/logout', { method: 'POST' });
  }

  async getProfile(): Promise<ApiResponse<{ user: any }>> {
    return this.makeRequest('/api/auth/profile');
  }

  async healthCheck(): Promise<ApiResponse<any>> {
    return this.makeRequest('/health');
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

