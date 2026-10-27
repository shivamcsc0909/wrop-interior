import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api, setCsrfToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  clientLogin: (u: string, p: string) => Promise<void>;
  devLogin: (u: string, p: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = async () => {
    try {
      const res = await api.getSession();
      setUser(res.user);
      if (res.csrf_token) {
        setCsrfToken(res.csrf_token);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const clientLogin = async (username: string, pass: string) => {
    const res = await api.clientLogin(username, pass);
    setUser(res.user);
    if (res.csrf_token) {
      setCsrfToken(res.csrf_token);
    }
  };

  const devLogin = async (username: string, pass: string) => {
    const res = await api.devLogin(username, pass);
    setUser(res.user);
    if (res.csrf_token) {
      setCsrfToken(res.csrf_token);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, clientLogin, devLogin, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
