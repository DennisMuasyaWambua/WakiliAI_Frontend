'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types/auth.types';
import { authService } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    const currentUser = authService.getCurrentUser();
    const isAuth = authService.isAuthenticated();

    if (isAuth && currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user && authService.isAuthenticated(),
    isLoading,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
