'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginFormData, RegisterFormData, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check if user is logged in on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser({
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
            avatar: data.user.avatar || `https://via.placeholder.com/100x100/6366F1/FFFFFF?text=${data.user.username.charAt(0).toUpperCase()}`,
            coverImage: data.user.coverImage || "https://via.placeholder.com/800x200/6366F1/FFFFFF?text=Profile+Cover",
            bio: data.user.bio || '',
            joinDate: data.user.createdAt || new Date().toISOString().split('T')[0],
            postsCount: data.user.postsCount || 0,
            likesCount: data.user.likesCount || 0
          });
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const login = async (formData: LoginFormData): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        setUser({
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          avatar: data.user.avatar || `https://via.placeholder.com/100x100/6366F1/FFFFFF?text=${data.user.username.charAt(0).toUpperCase()}`,
          coverImage: data.user.coverImage || "https://via.placeholder.com/800x200/6366F1/FFFFFF?text=Profile+Cover",
          bio: data.user.bio || '',
          joinDate: data.user.createdAt || new Date().toISOString().split('T')[0],
          postsCount: data.user.postsCount || 0,
          likesCount: data.user.likesCount || 0
        });
        setIsAuthenticated(true);
        return true;
      } else {
        console.error('Login failed:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (formData: RegisterFormData): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        setUser({
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          avatar: data.user.avatar || `https://via.placeholder.com/100x100/6366F1/FFFFFF?text=${data.user.username.charAt(0).toUpperCase()}`,
          coverImage: data.user.coverImage || "https://via.placeholder.com/800x200/6366F1/FFFFFF?text=Welcome+Cover",
          bio: data.user.bio || 'חבר חדש בקהילה!',
          joinDate: data.user.createdAt || new Date().toISOString().split('T')[0],
          postsCount: data.user.postsCount || 0,
          likesCount: data.user.likesCount || 0
        });
        setIsAuthenticated(true);
        return true;
      } else {
        console.error('Registration failed:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUserProfile = async (updates: Partial<User>): Promise<void> => {
    if (!user) return;

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const data = await response.json();
        setUser({
          ...user,
          ...updates,
          ...data.user
        });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      // Fallback to local update
      setUser({
        ...user,
        ...updates
      });
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