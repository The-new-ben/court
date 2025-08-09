const API_BASE_URL = import.meta.env.PROD
  ? 'https://api.hypercourt.com'
  : 'http://localhost:5001';
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? 'https://api.hypercourt.com/api' : 'http://localhost:5001/api');

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
  private loadTokensFromStorage() {
    this.accessToken = localStorage.getItem('hypercourt_access_token');
    this.refreshToken = localStorage.getItem('hypercourt_refresh_token');
  }

  private saveTokensToStorage(tokens: { accessToken: string; refreshToken: string }) {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
    localStorage.setItem('hypercourt_access_token', tokens.accessToken);
    localStorage.setItem('hypercourt_refresh_token', tokens.refreshToken);
  }

  private clearTokensFromStorage() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('hypercourt_access_token');
    localStorage.removeItem('hypercourt_refresh_token');
    localStorage.removeItem('hypercourt_user');
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) {
      return false;
    }

    try {
        const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (response.ok) {
        const data: TokenResponse = await response.json();
        this.saveTokensToStorage(data.tokens);
        return true;
      } else {
        this.clearTokensFromStorage();
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokensFromStorage();
      return false;
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
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
  }): Promise<ApiResponse<TokenResponse>> {
      const response = await this.makeRequest<TokenResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ user?: any }>> {
    return this.makeRequest('/api/auth/login', {
  }): Promise<ApiResponse<TokenResponse>> {
      const response = await this.makeRequest<TokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<void> {
    await this.makeRequest('/api/auth/logout', { method: 'POST' });
    if (this.refreshToken) {
        await this.makeRequest('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });
    }
    this.clearTokensFromStorage();
  }

  async getProfile(): Promise<ApiResponse<{ user: any }>> {
    return this.makeRequest('/auth/profile');
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

