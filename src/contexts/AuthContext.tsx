import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

type UserRole = 'admin' | 'judge' | 'lawyer' | 'plaintiff' | 'viewer';

interface User {
  email: string;
  role: UserRole;
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
  register: (email: string, password: string, role: UserRole, name: string) => Promise<void>;
  registerViewer: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, role: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    setUser(response.user);
  };

  const register = async (email: string, password: string, role: UserRole, name: string) => {
    const response = await authService.register(email, password, role, name);
    if (response.token) {
      localStorage.setItem('hypercourt_token', response.token);
      localStorage.setItem('hypercourt_user', JSON.stringify(response.user));
    if (response.user) {
      setUser(response.user);
    }
  };

  const registerViewer = async (email: string, password: string, name: string) => {
    await register(email, password, 'viewer', name);
  };

  const logout = () => {
    localStorage.removeItem('hypercourt_token');
    localStorage.removeItem('hypercourt_user');
  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, registerViewer, logout }}>
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