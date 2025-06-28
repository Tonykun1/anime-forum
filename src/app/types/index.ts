// src/types/index.ts

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

export interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: string;
  replies: number;
  likes: number;
  time: string;
  avatar: string;
  postImage: string;
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
  post: ForumPost;
  expandedPosts: { [key: number]: boolean };
  togglePostExpansion: (postId: number) => void;
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
}