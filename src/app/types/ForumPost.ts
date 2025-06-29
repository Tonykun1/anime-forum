// src/app/types/ForumPost.ts - interface אחיד לכל הפרויקט
export interface ForumPostData {
  id: string;
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

// טיפוס לפוסט מה-API
export interface ApiPost {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  views_count: number;
  created_at: string;
  author: {
    username: string;
  };
  category: {
    name: string;
    color: string;
  };
}

// טיפוס לפרופס של ForumPost component
export interface ForumPostProps {
  post: ForumPostData;
  expandedPosts: { [key: string]: boolean };
  togglePostExpansion: (postId: string) => void;
  themeClasses: {
    bg: string;
    cardBg: string;
    text: string;
    textSecondary: string;
    border: string;
    hover: string;
  };
}