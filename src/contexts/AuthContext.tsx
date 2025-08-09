import React, { createContext, useContext, useState } from 'react';
// TODO: Restore authentication once UI work is complete
// import { authService } from '../services/authService';

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
  // Temporary stubbed user; replace with real auth logic later
  const [user] = useState<User | null>({ email: 'dummy@example.com', role: 'guest' });
  const [isLoading] = useState(false);
  const [user, setUser] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async () => {};
  const register = async () => {};
  const logout = () => {};

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
