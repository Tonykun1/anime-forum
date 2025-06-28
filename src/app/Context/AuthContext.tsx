'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginFormData, RegisterFormData, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: (User & { password: string })[] = [
  {
    id: 1,
    username: "AnimeOtaku",
    email: "otaku@example.com",
    password: "123456",
    avatar: "https://via.placeholder.com/100x100/3B82F6/FFFFFF?text=AO",
    coverImage: "https://via.placeholder.com/800x200/1E40AF/FFFFFF?text=Profile+Cover",
    bio: "חובב אנימה ומנגה מזה 10 שנים. אוהב במיוחד שונן ואקשן!",
    joinDate: "2023-01-15",
    postsCount: 45,
    likesCount: 234
  },
  {
    id: 2,
    username: "ActionFan",
    email: "action@example.com", 
    password: "123456",
    avatar: "https://via.placeholder.com/100x100/EF4444/FFFFFF?text=AF",
    coverImage: "https://via.placeholder.com/800x200/DC2626/FFFFFF?text=Action+Fan+Cover",
    bio: "כל מה שקשור לקרבות ואקשן - אני כאן!",
    joinDate: "2023-03-22",
    postsCount: 78,
    likesCount: 456
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // טען משתמש מ-localStorage בטעינת העמוד
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (formData: LoginFormData): Promise<boolean> => {
    // חיפוש משתמש במאגר המדומה
    const foundUser = mockUsers.find(
      u => u.email === formData.email && u.password === formData.password
    );

    if (foundUser) {
      const userWithoutPassword = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        avatar: foundUser.avatar,
        coverImage: foundUser.coverImage,
        bio: foundUser.bio,
        joinDate: foundUser.joinDate,
        postsCount: foundUser.postsCount,
        likesCount: foundUser.likesCount
      };
      
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  };

  const register = async (formData: RegisterFormData): Promise<boolean> => {
    // בדוק אם המשתמש כבר קיים
    const existingUser = mockUsers.find(u => u.email === formData.email);
    if (existingUser) {
      return false;
    }

    // צור משתמש חדש
    const newUser = {
      id: mockUsers.length + 1,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      avatar: formData.avatar || `https://via.placeholder.com/100x100/6366F1/FFFFFF?text=${formData.username.charAt(0).toUpperCase()}`,
      coverImage: "https://via.placeholder.com/800x200/6366F1/FFFFFF?text=Welcome+Cover",
      bio: "חבר חדש בקהילה!",
      joinDate: new Date().toISOString().split('T')[0],
      postsCount: 0,
      likesCount: 0
    };

    mockUsers.push(newUser);

    const userWithoutPassword = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      avatar: newUser.avatar,
      coverImage: newUser.coverImage,
      bio: newUser.bio,
      joinDate: newUser.joinDate,
      postsCount: newUser.postsCount,
      likesCount: newUser.likesCount
    };

    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    return true;
  };

  const logout = (): void => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const updateUserProfile = (updates: Partial<User>): void => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // עדכון במאגר המדומה
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
      }
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