// src/types/auth.ts

export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  role: string;
  coverImage?: string;
  cover_image?: string;
  bio?: string;
  created_at: string;
  joinDate: string;
  postsCount: number;
  likesCount: number;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (formData: LoginFormData) => Promise<boolean>;
  register: (formData: RegisterFormData) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
}