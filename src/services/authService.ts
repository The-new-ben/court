const API_URL = 'http://localhost:5001/api/auth';
let accessToken: string | null = null;
let tokenExpiry = 0;
import { API_BASE_URL } from '../config';
const AUTH_URL = `${API_BASE_URL}/auth`;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const AUTH_URL = `${API_URL}/auth`;

const fetchWithTimeout = async (url: string, options: RequestInit, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('הבקשה נכשלה - זמן ההמתנה פג');
    }
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('לא ניתן להתחבר לשרת Backend. אנא ודא שהשרת רץ');
    }
    throw error;
  }
};

const handleApiError = (data: Record<string, unknown>, response: Response) => {
  const details = data.details as unknown;
  if (Array.isArray(details)) {
    throw new Error((details as string[]).join(', '));
  }
  
  switch (response.status) {
    case 400:
      throw new Error(data.error || 'נתונים לא תקינים');
    case 401:
      throw new Error(data.error || 'אימייל או סיסמה שגויים');
    case 423:
      throw new Error(data.error || 'החשבון נעול זמנית');
    case 429:
      throw new Error('יותר מדי ניסיונות. נסה שוב מאוחר יותר');
    case 500:
      throw new Error('שגיאת שרת. נסה שוב מאוחר יותר');
    default:
      throw new Error(data.error || 'שגיאה לא צפויה');
  }
};

export const authService = {
  setSession(token: string) {
    accessToken = token;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      tokenExpiry = payload.exp * 1000;
    } catch {
      tokenExpiry = 0;
        const response = await fetchWithTimeout(`${AUTH_URL}/login`, {
      const response = await fetchWithTimeout(`${AUTH_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      if (!response.ok) {
        handleApiError(data, response);
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  async refresh() {
    try {
      const response = await fetchWithTimeout(`${API_URL}/refresh`, {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) {
        accessToken = null;
        tokenExpiry = 0;
        return false;
      }
      const data = await response.json();
      authService.setSession(data.token);
      return true;
    } catch {
      accessToken = null;
      tokenExpiry = 0;
      return false;
    }
  },

  async login(email: string, password: string) {
    const response = await fetchWithTimeout(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) {
      handleApiError(data, response);
    }
    authService.setSession(data.token);
    return data;
  },

  async register(email: string, password: string, role: string, name: string) {
    const response = await fetchWithTimeout(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password, role, name })
    });
    const data = await response.json();
    if (!response.ok) {
      handleApiError(data, response);
    try {
        const response = await fetchWithTimeout(`${AUTH_URL}/register`, {
      const response = await fetchWithTimeout(`${AUTH_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role, name })
      });
      
      const data = await response.json();
      if (!response.ok) {
        handleApiError(data, response);
      }
      
      return data;
    } catch (error) {
      throw error;
    }
    authService.setSession(data.token);
    return data;
  },

  async logout() {
    await fetchWithTimeout(`${API_URL}/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    accessToken = null;
    tokenExpiry = 0;
  },

  async getProfile() {
    const token = await (async () => {
      if (accessToken && Date.now() < tokenExpiry) {
        return accessToken;
    try {
      const response = await fetchWithTimeout(`${API_URL.replace('/auth', '')}/profile`, {
      const token = localStorage.getItem('hypercourt_token');
        const response = await fetchWithTimeout(`${API_BASE_URL}/profile`, {
        const response = await fetchWithTimeout(`${API_URL}/profile`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      if (!response.ok) {
        handleApiError(data, response);
      }
      const refreshed = await authService.refresh();
      return refreshed ? accessToken : null;
    })();

    const response = await fetchWithTimeout(`${API_URL.replace('/auth', '')}/profile`, {
      method: 'GET',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      credentials: 'include'
    });
    const data = await response.json();
    if (!response.ok) {
      handleApiError(data, response);
    }
    return data;

      return data;
    } catch (error) {
      throw error;
    }
  },

  async logout() {
    await fetchWithTimeout(`${API_URL}/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
  }
};