import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

interface Client {
  email: string;
  role: string;
  points: number;
  referralCode: string;
  referrerId?: string | null;
}

interface AuthContextType {
  user: Client | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('hypercourt_token');
    const userData = localStorage.getItem('hypercourt_user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Invalid user data in localStorage');
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    localStorage.setItem('hypercourt_token', response.token);
    localStorage.setItem('hypercourt_user', JSON.stringify(response.user));
    setUser(response.user);
  };

  const register = async (email: string, password: string, role: string, name: string) => {
    const response = await authService.register(email, password, role, name);
    // Auto-login after successful registration
    if (response.token) {
      localStorage.setItem('hypercourt_token', response.token);
      localStorage.setItem('hypercourt_user', JSON.stringify(response.user));
      setUser(response.user);
    }
  };

  const logout = () => {
    localStorage.removeItem('hypercourt_token');
    localStorage.removeItem('hypercourt_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}