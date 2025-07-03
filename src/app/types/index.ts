// src/types/index.ts

export interface ForumPostData {
  id: number | string;
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
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  joinDate: string;
  postsCount: number;
  likesCount: number;
  role: string;
  location?: string;
  website?: string;
  isOwnProfile: boolean;
}

export interface UserPost {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  category: {
    name: string;
    color: string;
  };
}

export interface ThemeClasses {
  bg: string;
  cardBg: string;
  text: string;
  textSecondary: string;
  border: string;
  hover: string;
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