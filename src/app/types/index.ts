// src/app/types/index.ts - ממשקים מאוחדים
export interface ForumPostData {
  id: number;
  title: string;
  content: string;
  author: string;
  authorId: number;
  replies: number;
  likes: number;
  time: string;
  avatar: string;
  postImage: string;
  category: string;
  // שדות נוספים לתאימות עם API
  likes_count?: number;
  comments_count?: number;
  views_count?: number;
  created_at?: string;
  image_url?: string;
}

export interface ApiPost {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  views_count: number;
  created_at: string;
  author: {
    username: string;
    id?: number;
  };
  category: {
    name: string;
    color: string;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  coverImage?: string;
  bio?: string;
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

export interface Anime {
  id: number;
  title: string;
  image: string;
  rating: number;
  episodes?: number;
  duration?: string;
  status: 'ongoing' | 'completed';
  genre: string;
  type: 'series' | 'movie';
  isNew?: boolean;
}

// פונקציה להמרה מAPI לפורמט הרכיבים
export function convertApiPostToForumPost(apiPost: ApiPost): ForumPostData {
  return {
    id: apiPost.id,
    title: apiPost.title,
    content: apiPost.content,
    author: apiPost.author?.username || 'משתמש',
    authorId: apiPost.author?.id || 1,
    replies: apiPost.comments_count || 0,
    likes: apiPost.likes_count || 0,
    time: new Date(apiPost.created_at).toLocaleDateString('he-IL'),
    avatar: `https://via.placeholder.com/50x50/6366F1/FFFFFF?text=${(apiPost.author?.username || 'U').substring(0, 2).toUpperCase()}`,
    postImage: apiPost.image_url || `https://via.placeholder.com/800x200/6366F1/FFFFFF?text=${encodeURIComponent(apiPost.category?.name || 'פוסט')}`,
    category: apiPost.category?.name || 'כללי',
    // שדות נוספים
    likes_count: apiPost.likes_count,
    comments_count: apiPost.comments_count,
    views_count: apiPost.views_count,
    created_at: apiPost.created_at,
    image_url: apiPost.image_url
  };
}