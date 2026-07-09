import React, { createContext, useCallback, useEffect, useState, ReactNode } from 'react';
import { userService, User, ClientRedirect } from '@/services/userService';
import { ApiError } from '@/services/apiClient';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, clientId?: string) => Promise<ClientRedirect | null>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => userService.getStoredUser());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    userService
      .fetchProfile()
      .then(setUser)
      .catch(() => setUser(null));
    
  }, []);

  const login = useCallback(async (email: string, password: string, clientId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.login({ email, password, clientId });
      setUser(data.user);
      return data.client;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to sign in. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.register({ name, email, password });
      setUser(data.user);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to create account. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await userService.logout();
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value: AuthContextValue = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}