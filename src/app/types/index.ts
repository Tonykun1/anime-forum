// src/app/types/index.ts

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

// הגדרה אחידה של ForumPostData
export interface ForumPostData {
  id: string | number;
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

// API Post type מהשרת
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
    avatar?: string;
  };
  category: {
    name: string;
    color: string;
  };
}

// פונקציה להמרת API Post ל-ForumPostData
export function convertApiPostToForumPost(apiPost: ApiPost): ForumPostData {
  return {
    id: apiPost.id,
    title: apiPost.title,
    content: apiPost.content,
    author: apiPost.author.username,
    authorId: 1, // זמני
    replies: apiPost.comments_count,
    likes: apiPost.likes_count,
    time: formatRelativeTime(apiPost.created_at),
    avatar: apiPost.author.avatar || `https://via.placeholder.com/50x50/6366F1/FFFFFF?text=${apiPost.author.username.charAt(0).toUpperCase()}`,
    postImage: apiPost.image_url || `https://via.placeholder.com/800x200/${apiPost.category.color.replace('#', '')}/FFFFFF?text=${encodeURIComponent(apiPost.category.name)}`,
    category: apiPost.category.name
  };
}

// פונקציה לפורמט זמן יחסי
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'עכשיו';
  if (diffInSeconds < 3600) return `לפני ${Math.floor(diffInSeconds / 60)} דקות`;
  if (diffInSeconds < 86400) return `לפני ${Math.floor(diffInSeconds / 3600)} שעות`;
  if (diffInSeconds < 604800) return `לפני ${Math.floor(diffInSeconds / 86400)} ימים`;
  
  return date.toLocaleDateString('he-IL');
}

export interface ThemeClasses {
  bg: string;
  cardBg: string;
  text: string;
  textSecondary: string;
  border: string;
  hover: string;
}

export interface AnimeCardProps {
  anime: Anime;
  themeClasses: ThemeClasses;
}

export interface ForumPostProps {
  post: ForumPostData;
  expandedPosts: { [key: string]: boolean };
  togglePostExpansion: (postId: string) => void;
  themeClasses: ThemeClasses;
}

export interface AnimeCarouselProps {
  newSeasonAnime: Anime[];
  currentSlide: number;
  nextSlide: () => void;
  prevSlide: () => void;
  setCurrentSlide: (slide: number) => void;
  isDark: boolean;
  themeClasses: ThemeClasses;
}

export interface NavBarProps {
  isDark: boolean;
  toggleTheme: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  themeClasses: ThemeClasses;
  onProfileClick: () => void;
  onCreatePost: () => void;
  onSettingsClick: () => void;
}

export interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (post: ForumPostData) => void;
  themeClasses: ThemeClasses;
}