// src/app/page.tsx
'use client';

import React, { useState } from 'react';
import { AuthProvider } from './Context/AuthContext';
import NavBar from './Components/NavBar';
import AnimeCard from './Components/AnimeCard';
import AnimeCarousel from './Components/AnimeCarousel';
import ForumPost from './Components/ForumPost';
import CreatePostModal from './Components/CreatePostModal';
import UserProfilePage from './Components/UserProfilePage';
import UserSettingsPage from './Components/UserSettingsPage';

interface ForumPostData {
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
}

interface Anime {
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

const AnimeForum: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [expandedPosts, setExpandedPosts] = useState<{ [key: number]: boolean }>({});
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Forum posts state
  const [forumPosts, setForumPosts] = useState<ForumPostData[]>([
    {
      id: 1,
      title: "מה אתם חושבים על הסיום של Attack on Titan?",
      content: "אחרי שצפיתי בפרק האחרון, אני חייב לשאול מה הדעה שלכם על הסיום. האם זה היה מספק? יש לי הרבה מחשבות על הבחירות של אירן ועל הדרך שבה הסדרה בחרה לסיים את הסיפור. האמת שאני לא בטוח אם הבנתי לגמרי את המסר שהיוצרים רצו להעביר...",
      author: "AnimeOtaku",
      authorId: 1,
      replies: 45,
      likes: 23,
      time: "לפני 2 שעות",
      avatar: "https://via.placeholder.com/50x50/3B82F6/FFFFFF?text=AO",
      postImage: "https://via.placeholder.com/800x200/3B82F6/FFFFFF?text=Attack+on+Titan+Final+Season",
      category: "דיונים"
    },
    {
      id: 2,
      title: "המלצות על אנימה עם קרבות מדהימים",
      content: "אני מחפש אנימות עם קרבות שפשוט מפילים מהכיסא. משהו ברמה של Demon Slayer או Jujutsu Kaisen. יש לכם המלצות? אני רוצה משהו עם אנימציית קרב מטורפת וכוריאוגרפיה מדהימה. לא אכפת לי אם זה חדש או ישן, העיקר שהקרבות יהיו באמת מרשימים ולא רק צעקות.",
      author: "ActionFan",
      authorId: 2,
      replies: 78,
      likes: 56,
      time: "לפני 5 שעות",
      avatar: "https://via.placeholder.com/50x50/EF4444/FFFFFF?text=AF",
      postImage: "https://via.placeholder.com/800x200/EF4444/FFFFFF?text=Epic+Fight+Scenes",
      category: "המלצות"
    },
    {
      id: 3,
      title: "Demon Slayer Season 4 - תאריך יציאה?",
      content: "מישהו יודע מתי יוצא העונה הבאה? ראיתי שיש שמועות על 2025 אבל לא בטוח אם זה מאושר...",
      author: "SlayerFan",
      authorId: 3,
      replies: 32,
      likes: 18,
      time: "לפני יום",
      avatar: "https://via.placeholder.com/50x50/8B5CF6/FFFFFF?text=SF",
      postImage: "https://via.placeholder.com/800x200/8B5CF6/FFFFFF?text=Demon+Slayer+S4",
      category: "שאלות"
    },
    {
      id: 4,
      title: "איך ההומור של One Piece השתנה לאורך השנים?",
      content: "שמתי לב שההומור של One Piece בארקים הראשונים שונה מהארקים החדשים. מישהו עוד חושב ככה או שזה רק אני? נדמה לי שקודם היה יותר טבעי ופחות מאולץ, ועכשיו לפעמים זה מרגיש קצת יותר מנותק מהעלילה העיקרית.",
      author: "PirateKing",
      authorId: 4,
      replies: 67,
      likes: 42,
      time: "לפני יומיים",
      avatar: "https://via.placeholder.com/50x50/F59E0B/000000?text=PK",
      postImage: "https://via.placeholder.com/800x200/F59E0B/000000?text=One+Piece+Comedy",
      category: "דיונים"
    },
    {
      id: 5,
      title: "Studio Ghibli vs Makoto Shinkai - מי עושה אנימציה יותר יפה?",
      content: "אני תמיד מתלבט בין הסגנון הקלאסי של גיבלי לסגנון המודרני של שינקאי. שניהם מדהימים אבל בצורה שונה לגמרי...",
      author: "AnimationLover",
      authorId: 5,
      replies: 156,
      likes: 89,
      time: "לפני 3 ימים",
      avatar: "https://via.placeholder.com/50x50/10B981/FFFFFF?text=AL",
      postImage: "https://via.placeholder.com/800x200/10B981/FFFFFF?text=Animation+Comparison",
      category: "ביקורות"
    },
    {
      id: 6,
      title: "האם Jujutsu Kaisen עולה על Demon Slayer?",
      content: "שתי הסדרות מדהימות אבל יש לי הרגשה ש-JJK יותר מורכב ומעניין מבחינת הכתיבה. מה אתם אומרים?",
      author: "ShonenFan",
      authorId: 6,
      replies: 234,
      likes: 134,
      time: "לפני 4 ימים",
      avatar: "https://via.placeholder.com/50x50/EC4899/FFFFFF?text=SH",
      postImage: "https://via.placeholder.com/800x200/EC4899/FFFFFF?text=JJK+vs+DS",
      category: "ביקורות"
    }
  ]);

  const toggleTheme = (): void => setIsDark(!isDark);
  const toggleMenu = (): void => setIsMenuOpen(!isMenuOpen);
  
  const togglePostExpansion = (postId: number): void => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const nextSlide = (): void => {
    setCurrentSlide((prev) => (prev + 1) % 2);
  };

  const prevSlide = (): void => {
    setCurrentSlide((prev) => (prev - 1 + 2) % 2);
  };

  const handleCreatePost = (newPost: ForumPostData): void => {
    setForumPosts(prev => [newPost, ...prev]);
  };

  const handleProfileClick = (): void => {
    setShowProfile(true);
    setShowSettings(false);
    setActiveTab('profile');
  };

  const handleSettingsClick = (): void => {
    setShowSettings(true);
    setShowProfile(false);
    setActiveTab('settings');
  };

  const handleBackFromSettings = (): void => {
    setShowSettings(false);
    setActiveTab('home');
  };

  const handleBackFromProfile = (): void => {
    setShowProfile(false);
    setActiveTab('home');
  };

  const handleTabChange = (tab: string): void => {
    if (tab === 'home' && (showProfile || showSettings)) {
      setShowProfile(false);
      setShowSettings(false);
    }
    setActiveTab(tab);
  };

  // Theme classes
  const themeClasses = {
    bg: isDark ? 'bg-gray-900' : 'bg-gray-50',
    cardBg: isDark ? 'bg-gray-800' : 'bg-white',
    text: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-300' : 'text-gray-600',
    border: isDark ? 'border-gray-700' : 'border-gray-200',
    hover: isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
  };

  // Data - אנימות העונה החדשות
  const newSeasonAnime: Anime[] = [
    {
      id: 1,
      title: "Attack on Titan Final Season",
      image: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=AOT",
      rating: 9.2,
      episodes: 75,
      status: "completed",
      genre: "Action, Drama",
      type: "series",
      isNew: true
    },
    {
      id: 2,
      title: "Demon Slayer: Hashira Training",
      image: "https://via.placeholder.com/300x400/EF4444/FFFFFF?text=DS",
      rating: 8.8,
      episodes: 32,
      status: "ongoing",
      genre: "Action, Supernatural",
      type: "series",
      isNew: true
    },
    {
      id: 3,
      title: "Jujutsu Kaisen Season 3",
      image: "https://via.placeholder.com/300x400/8B5CF6/FFFFFF?text=JJK",
      rating: 8.9,
      episodes: 24,
      status: "ongoing",
      genre: "Action, Supernatural",
      type: "series",
      isNew: true
    },
    {
      id: 4,
      title: "My Hero Academia Season 7",
      image: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=MHA",
      rating: 8.5,
      episodes: 25,
      status: "ongoing",
      genre: "Action, Superhero",
      type: "series",
      isNew: true
    },
    {
      id: 5,
      title: "One Piece: Egghead Arc",
      image: "https://via.placeholder.com/300x400/F59E0B/000000?text=OP",
      rating: 9.5,
      episodes: 1000,
      status: "ongoing",
      genre: "Adventure, Comedy",
      type: "series",
      isNew: true
    },
    {
      id: 6,
      title: "Blue Lock Season 2",
      image: "https://via.placeholder.com/300x400/6366F1/FFFFFF?text=BL",
      rating: 8.3,
      episodes: 24,
      status: "ongoing",
      genre: "Sports, Drama",
      type: "series",
      isNew: true
    },
    {
      id: 7,
      title: "Chainsaw Man: Movie",
      image: "https://via.placeholder.com/300x400/EC4899/FFFFFF?text=CSM",
      rating: 8.7,
      episodes: 12,
      status: "completed",
      genre: "Action, Horror",
      type: "series",
      isNew: true
    },
    {
      id: 8,
      title: "Tokyo Revengers Final Arc",
      image: "https://via.placeholder.com/300x400/F97316/FFFFFF?text=TR",
      rating: 8.1,
      episodes: 13,
      status: "ongoing",
      genre: "Action, Drama",
      type: "series",
      isNew: true
    },
    {
      id: 9,
      title: "Spy x Family Code: White",
      image: "https://via.placeholder.com/300x400/14B8A6/FFFFFF?text=SxF",
      rating: 8.6,
      episodes: 25,
      status: "ongoing",
      genre: "Comedy, Action",
      type: "series",
      isNew: true
    },
    {
      id: 10,
      title: "Mob Psycho 100 OVA",
      image: "https://via.placeholder.com/300x400/A855F7/FFFFFF?text=MP100",
      rating: 8.9,
      episodes: 37,
      status: "completed",
      genre: "Supernatural, Comedy",
      type: "series",
      isNew: true
    }
  ];

  // Data - סרטי אנימה
  const moviesList: Anime[] = [
    {
      id: 11,
      title: "Your Name",
      image: "https://via.placeholder.com/300x400/EC4899/FFFFFF?text=YN",
      rating: 8.4,
      duration: "106 דקות",
      status: "completed",
      genre: "Romance, Drama",
      type: "movie"
    },
    {
      id: 12,
      title: "Spirited Away",
      image: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=SA",
      rating: 9.3,
      duration: "125 דקות",
      status: "completed",
      genre: "Adventure, Family",
      type: "movie"
    },
    {
      id: 13,
      title: "Akira",
      image: "https://via.placeholder.com/300x400/F59E0B/000000?text=AKIRA",
      rating: 8.0,
      duration: "124 דקות",
      status: "completed",
      genre: "Action, Sci-Fi",
      type: "movie"
    },
    {
      id: 14,
      title: "Princess Mononoke",
      image: "https://via.placeholder.com/300x400/6366F1/FFFFFF?text=PM",
      rating: 8.4,
      duration: "134 דקות",
      status: "completed",
      genre: "Adventure, Drama",
      type: "movie"
    }
  ];

  // Show settings page
  if (showSettings) {
    return (
      <AuthProvider>
        <div className={`min-h-screen ${themeClasses.bg} transition-colors duration-300`}>
          <NavBar 
            isDark={isDark}
            toggleTheme={toggleTheme}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            isMenuOpen={isMenuOpen}
            toggleMenu={toggleMenu}
            onCreatePost={() => setIsCreatePostModalOpen(true)}
            onProfileClick={handleProfileClick}
            onSettingsClick={handleSettingsClick}
            themeClasses={themeClasses}
          />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <UserSettingsPage 
              themeClasses={themeClasses}
              onBack={handleBackFromSettings}
              isDark={isDark}
              toggleTheme={toggleTheme}
            />
          </main>
          <CreatePostModal
            isOpen={isCreatePostModalOpen}
            onClose={() => setIsCreatePostModalOpen(false)}
            onCreatePost={handleCreatePost}
            themeClasses={themeClasses}
          />
        </div>
      </AuthProvider>
    );
  }

  // Show profile page
  if (showProfile) {
    return (
      <AuthProvider>
        <div className={`min-h-screen ${themeClasses.bg} transition-colors duration-300`}>
          <NavBar 
            isDark={isDark}
            toggleTheme={toggleTheme}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            isMenuOpen={isMenuOpen}
            toggleMenu={toggleMenu}
            onCreatePost={() => setIsCreatePostModalOpen(true)}
            onProfileClick={handleProfileClick}
            onSettingsClick={handleSettingsClick}
            themeClasses={themeClasses}
          />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <UserProfilePage 
              themeClasses={themeClasses}
              userPosts={forumPosts}
              onBack={handleBackFromProfile}
              onCreatePost={() => setIsCreatePostModalOpen(true)}
            />
          </main>
          <CreatePostModal
            isOpen={isCreatePostModalOpen}
            onClose={() => setIsCreatePostModalOpen(false)}
            onCreatePost={handleCreatePost}
            themeClasses={themeClasses}
          />
        </div>
      </AuthProvider>
    );
  }

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'series':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-3xl font-bold ${themeClasses.text}`}>סדרות אנימה</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
              {newSeasonAnime.slice(0, 8).map(series => (
                <AnimeCard key={series.id} anime={series} themeClasses={themeClasses} />
              ))}
            </div>
          </div>
        );
      case 'movies':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-3xl font-bold ${themeClasses.text}`}>סרטי אנימה</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
              {moviesList.map(movie => (
                <AnimeCard key={movie.id} anime={movie} themeClasses={themeClasses} />
              ))}
            </div>
          </div>
        );
      case 'posts':
        return (
          <div>
            <h2 className={`text-3xl font-bold ${themeClasses.text} mb-6`}>כל הפוסטים</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
              {forumPosts.map(post => (
                <ForumPost 
                  key={post.id} 
                  post={post} 
                  expandedPosts={expandedPosts} 
                  togglePostExpansion={togglePostExpansion}
                  themeClasses={themeClasses}
                />
              ))}
            </div>
          </div>
        );
      case 'watchlist':
        return (
          <div>
            <h2 className={`text-3xl font-bold ${themeClasses.text} mb-6`}>רשימת הצפייה שלי</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
              {[...newSeasonAnime.slice(0, 2), ...moviesList.slice(0, 2)].map(anime => (
                <AnimeCard key={anime.id} anime={anime} themeClasses={themeClasses} />
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-8">
            <AnimeCarousel 
              newSeasonAnime={newSeasonAnime}
              currentSlide={currentSlide}
              nextSlide={nextSlide}
              prevSlide={prevSlide}
              setCurrentSlide={setCurrentSlide}
              isDark={isDark}
              themeClasses={themeClasses}
            />
            
            <section>
              <h2 className={`text-3xl font-bold ${themeClasses.text} mb-6`}>דיונים ופוסטים</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
                {forumPosts.map(post => (
                  <ForumPost 
                    key={post.id} 
                    post={post} 
                    expandedPosts={expandedPosts} 
                    togglePostExpansion={togglePostExpansion}
                    themeClasses={themeClasses}
                  />
                ))}
              </div>
            </section>
          </div>
        );
    }
  };

  return (
    <AuthProvider>
      <div className={`min-h-screen ${themeClasses.bg} transition-colors duration-300`}>
        <NavBar 
          isDark={isDark}
          toggleTheme={toggleTheme}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          onCreatePost={() => setIsCreatePostModalOpen(true)}
          onProfileClick={handleProfileClick}
          onSettingsClick={handleSettingsClick}
          themeClasses={themeClasses}
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </main>
        <CreatePostModal
          isOpen={isCreatePostModalOpen}
          onClose={() => setIsCreatePostModalOpen(false)}
          onCreatePost={handleCreatePost}
          themeClasses={themeClasses}
        />
      </div>
    </AuthProvider>
  );
};

export default AnimeForum;