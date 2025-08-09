const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const AUTH_URL = `${API_URL}/auth`;

// Enhanced request handling with timeout and better error messages
const fetchWithTimeout = async (url: string, options: RequestInit, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
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

// Enhanced error handling
const handleApiError = (data: any, response: Response) => {
  if (data.details && Array.isArray(data.details)) {
    throw new Error(data.details.join(', '));
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
  async login(email: string, password: string) {
    try {
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

  async register(email: string, password: string, role: string, name: string) {
    try {
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
  },

  async getProfile() {
    try {
      const token = localStorage.getItem('hypercourt_token');
        const response = await fetchWithTimeout(`${API_URL}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (!response.ok) {
        handleApiError(data, response);
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }
};