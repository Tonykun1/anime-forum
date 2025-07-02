// src/app/Context/AuthContext.tsx - מתוקן לעבוד עם API
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginFormData, RegisterFormData, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // בדיקה אם המשתמש מחובר כשהעמוד נטען
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async (): Promise<void> => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
        console.log('✅ User authenticated:', data.user);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        console.log('❌ User not authenticated');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (formData: LoginFormData): Promise<boolean> => {
    try {
      console.log('🔑 Attempting login for:', formData.email);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setIsAuthenticated(true);
        console.log('✅ Login successful:', data.user);
        return true;
      } else {
        console.error('❌ Login failed:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (formData: RegisterFormData): Promise<boolean> => {
    try {
      console.log('📝 Attempting registration for:', formData.username, formData.email);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setIsAuthenticated(true);
        console.log('✅ Registration successful:', data.user);
        return true;
      } else {
        console.error('❌ Registration failed:', data.error);
        throw new Error(data.error || 'רישום נכשל');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      setUser(null);
      setIsAuthenticated(false);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      // גם אם יש שגיאה, עדיין נתנתק מהצד של הקליינט
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUserProfile = async (updates: Partial<User>): Promise<void> => {
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        console.log('✅ Profile updated:', data.user);
      } else {
        console.error('❌ Profile update failed');
      }
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateUserProfile
  };

  // הצגת לודינג בזמן בדיקת האימות
  if (isLoading) {
    return (
      <AuthContext.Provider value={value}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};