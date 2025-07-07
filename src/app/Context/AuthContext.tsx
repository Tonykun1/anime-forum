// app/Context/AuthContext.tsx - תיקון הקונטקסט
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  coverImage?: string;
  cover_image?: string;
  bio?: string;
  joinDate?: string;
  postsCount?: number;
  likesCount?: number;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for development
const mockUsers: (User & { password: string })[] = [
  {
    id: 1,
    username: "talgerbi",
    email: "talgerbi@gmail.com",
    password: "123456",
    avatar: "https://via.placeholder.com/100x100/3B82F6/FFFFFF?text=TG",
    coverImage: "",
    cover_image: "",
    bio: "משתמש ראשי",
    joinDate: "2023-01-15",
    postsCount: 0,
    likesCount: 0,
    role: "user"
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        console.log('📋 User loaded from localStorage:', parsedUser.username);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const userWithoutPassword = {
          id: foundUser.id,
          username: foundUser.username,
          email: foundUser.email,
          avatar: foundUser.avatar,
          coverImage: foundUser.coverImage,
          cover_image: foundUser.cover_image,
          bio: foundUser.bio,
          joinDate: foundUser.joinDate,
          postsCount: foundUser.postsCount,
          likesCount: foundUser.likesCount,
          role: foundUser.role
        };

        setUser(userWithoutPassword);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        
        console.log('✅ User logged in:', userWithoutPassword.username);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      // Check if user already exists
      if (mockUsers.some(u => u.email === userData.email || u.username === userData.username)) {
        return false;
      }

      const newUser = {
        id: Date.now(),
        username: userData.username,
        email: userData.email,
        password: userData.password,
        avatar: userData.avatar || `https://via.placeholder.com/100x100/6366F1/FFFFFF?text=${userData.username.charAt(0).toUpperCase()}`,
        coverImage: "",
        cover_image: "",
        bio: "",
        joinDate: new Date().toISOString().split('T')[0],
        postsCount: 0,
        likesCount: 0,
        role: "user"
      };

      mockUsers.push(newUser);

      const userWithoutPassword = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
        coverImage: newUser.coverImage,
        cover_image: newUser.cover_image,
        bio: newUser.bio,
        joinDate: newUser.joinDate,
        postsCount: newUser.postsCount,
        likesCount: newUser.likesCount,
        role: newUser.role
      };

      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      
      console.log('✅ User registered:', userWithoutPassword.username);
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  const logout = (): void => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    console.log('👋 User logged out');
  };

  const updateUserProfile = (updates: Partial<User>): void => {
    try {
      if (user) {
        console.log('🔄 Updating user profile:', updates);
        
        const updatedUser = { ...user, ...updates };
        
        // ודא שגם coverImage וגם cover_image מעודכנים
        if (updates.cover_image) {
          updatedUser.coverImage = updates.cover_image;
        }
        if (updates.coverImage) {
          updatedUser.cover_image = updates.coverImage;
        }
        
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        // עדכון במאגר המדומה
        const userIndex = mockUsers.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
          mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
        }
        
        console.log('✅ Profile updated successfully:', updatedUser.username);
        console.log('🖼️ Cover image updated to:', updatedUser.cover_image);
      }
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      throw error; // זה יגרום לשגיאה להופיע בקונסול
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