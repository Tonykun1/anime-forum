// src/app/page.tsx - עם import של הטיפוסים
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
import { useForumPosts } from './hooks/useForumPosts';
import { ForumPostData } from './types/ForumPost';

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
  const [expandedPosts, setExpandedPosts] = useState<{ [key: string]: boolean }>({});
  const [showCreatePost, setShowCreatePost] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Use the custom hook for forum posts
  const { 
    posts: forumPosts, 
    loading: postsLoading, 
    error: postsError, 
    refetch: refetchPosts 
  } = useForumPosts();

  // Anime data for new season carousel
  const newSeasonAnime: Anime[] = [
    {
      id: 101,
      title: "Attack on Titan Final Season",
      image: "https://via.placeholder.com/300x400/8B5CF6/FFFFFF?text=Attack+on+Titan",
      rating: 9.8,
      episodes: 75,
      status: 'completed',
      genre: "אקשן, דרמה",
      type: 'series',
      isNew: true
    },
    {
      id: 102,
      title: "Demon Slayer: Kimetsu no Yaiba",
      image: "https://via.placeholder.com/300x400/EF4444/FFFFFF?text=Demon+Slayer",
      rating: 9.5,
      episodes: 44,
      status: 'ongoing',
      genre: "אקשן, על-טבעי",
      type: 'series',
      isNew: true
    },
    {
      id: 103,
      title: "Jujutsu Kaisen Season 2",
      image: "https://via.placeholder.com/300x400/F59E0B/FFFFFF?text=Jujutsu+Kaisen",
      rating: 9.2,
      episodes: 24,
      status: 'ongoing',
      genre: "אקשן, על-טבעי",
      type: 'series',
      isNew: true
    },
    {
      id: 104,
      title: "One Piece: Gear 5",
      image: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=One+Piece",
      rating: 9.0,
      episodes: 1000,
      status: 'ongoing',
      genre: "הרפתקאות, אקשן",
      type: 'series',
      isNew: true
    },
    {
      id: 105,
      title: "Chainsaw Man",
      image: "https://via.placeholder.com/300x400/EC4899/FFFFFF?text=Chainsaw+Man",
      rating: 8.8,
      episodes: 12,
      status: 'completed',
      genre: "אקשן, אימה",
      type: 'series',
      isNew: true
    },
    {
      id: 106,
      title: "My Hero Academia Season 7",
      image: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=My+Hero+Academia",
      rating: 8.9,
      episodes: 25,
      status: 'ongoing',
      genre: "אקשן, סופר-הירו",
      type: 'series',
      isNew: true
    },
    {
      id: 107,
      title: "Tokyo Revengers Season 3",
      image: "https://via.placeholder.com/300x400/8B5CF6/FFFFFF?text=Tokyo+Revengers",
      rating: 8.5,
      episodes: 13,
      status: 'completed',
      genre: "דרמה, אקשן",
      type: 'series',
      isNew: true
    },
    {
      id: 108,
      title: "Dr. Stone: New World",
      image: "https://via.placeholder.com/300x400/059669/FFFFFF?text=Dr+Stone",
      rating: 8.7,
      episodes: 22,
      status: 'completed',
      genre: "מדע, הרפתקאות",
      type: 'series',
      isNew: true
    },
    {
      id: 109,
      title: "Bleach: TYBW",
      image: "https://via.placeholder.com/300x400/DC2626/FFFFFF?text=Bleach",
      rating: 9.1,
      episodes: 26,
      status: 'ongoing',
      genre: "אקשן, על-טבעי",
      type: 'series',
      isNew: true
    },
    {
      id: 110,
      title: "Mob Psycho 100 III",
      image: "https://via.placeholder.com/300x400/7C3AED/FFFFFF?text=Mob+Psycho",
      rating: 9.3,
      episodes: 12,
      status: 'completed',
      genre: "על-טבעי, קומדיה",
      type: 'series',
      isNew: true
    }
  ];

  // Movie data with unique IDs
  const moviesList: Anime[] = [
    {
      id: 201,
      title: "Spirited Away",
      image: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Spirited+Away",
      rating: 9.9,
      duration: "125 דקות",
      status: 'completed',
      genre: "הרפתקאות, משפחה",
      type: 'movie'
    },
    {
      id: 202,
      title: "Your Name",
      image: "https://via.placeholder.com/300x400/EC4899/FFFFFF?text=Your+Name",
      rating: 9.8,
      duration: "106 דקות",
      status: 'completed',
      genre: "רומנטיקה, דרמה",
      type: 'movie'
    },
    {
      id: 203,
      title: "Princess Mononoke",
      image: "https://via.placeholder.com/300x400/059669/FFFFFF?text=Princess+Mononoke",
      rating: 9.7,
      duration: "134 דקות",
      status: 'completed',
      genre: "הרפתקאות, פנטזיה",
      type: 'movie'
    }
  ];

  const themeClasses = {
    bg: isDark ? 'bg-gray-900' : 'bg-white',
    cardBg: isDark ? 'bg-gray-800' : 'bg-white',
    text: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-300' : 'text-gray-600',
    border: isDark ? 'border-gray-700' : 'border-gray-200',
    hover: isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
  };

  const togglePostExpansion = (postId: string) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Helper functions for carousel
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 2);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 2) % 2);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // הפונקציה שתיקרא כשפוסט נוצר בהצלחה
  const handlePostCreated = async (newPost: any) => {
    console.log('🎉 New post created, refreshing list...');
    // רענן את רשימת הפוסטים מהשרת
    await refetchPosts();
    // סגור את חלון יצירת הפוסט
    setShowCreatePost(false);
  };

  const toggleTheme = () => setIsDark(!isDark);

  const renderContent = () => {
    if (showProfile) {
      return (
        <UserProfilePage
          themeClasses={themeClasses}
          userPosts={forumPosts}
          onBack={() => setShowProfile(false)}
          onCreatePost={() => setShowCreatePost(true)}
        />
      );
    }

    if (showSettings) {
      return (
        <UserSettingsPage
          themeClasses={themeClasses}
          onBack={() => setShowSettings(false)}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />
      );
    }

    if (showCreatePost) {
      return (
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setShowCreatePost(false)}
            className={`mb-6 flex items-center space-x-2 px-4 py-2 rounded-lg ${themeClasses.hover} ${themeClasses.text} transition-colors`}
          >
            <span>← חזור</span>
          </button>
          <CreatePostModal 
            onPostCreated={handlePostCreated}
            className="w-full"
          />
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
      case 'posts':
        return (
          <div>
            {/* Hero Section עם קרוסלת אנימה */}
            <div className="mb-8">
              <AnimeCarousel 
                newSeasonAnime={newSeasonAnime}
                currentSlide={currentSlide}
                nextSlide={nextSlide}
                prevSlide={prevSlide}
                setCurrentSlide={setCurrentSlide}
                isDark={isDark}
                themeClasses={themeClasses}
              />
            </div>

            {/* פוסטים מהפורום */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${themeClasses.text}`}>דיונים חמים</h2>

              </div>

              {postsLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, index) => (
                    <div key={`skeleton-${index}`} className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg p-4 animate-pulse`}>
                      <div className="h-32 bg-gray-600 rounded mb-4"></div>
                      <div className="h-4 bg-gray-600 rounded mb-2"></div>
                      <div className="h-3 bg-gray-600 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : postsError ? (
                <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg p-6 text-center`}>
                  <p className={`${themeClasses.text} text-lg mb-4`}>שגיאה בטעינת הפוסטים</p>
                  <p className={`${themeClasses.textSecondary} mb-4`}>{postsError}</p>
                  <button
                    onClick={refetchPosts}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    נסה שנית
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {forumPosts.map((post: ForumPostData) => (
                    <ForumPost
                      key={post.id}
                      post={post}
                      expandedPosts={expandedPosts}
                      togglePostExpansion={togglePostExpansion}
                      themeClasses={themeClasses}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'series':
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {newSeasonAnime.map((anime) => (
              <AnimeCard 
                key={`series-${anime.id}`}
                anime={anime} 
                themeClasses={themeClasses}
              />
            ))}
          </div>
        );

      case 'movies':
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {moviesList.map((anime) => (
              <AnimeCard 
                key={`movie-${anime.id}`}
                anime={anime} 
                themeClasses={themeClasses}
              />
            ))}
          </div>
        );

      case 'watchlist':
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...newSeasonAnime.slice(0, 3), ...moviesList.slice(0, 2)].map((anime) => (
              <AnimeCard 
                key={`watchlist-${anime.id}`}
                anime={anime} 
                themeClasses={themeClasses}
              />
            ))}
          </div>
        );

      default:
        return (
          <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg p-8 text-center`}>
            <h2 className={`text-2xl font-bold ${themeClasses.text} mb-4`}>עמוד בפיתוח</h2>
            <p className={`${themeClasses.textSecondary}`}>העמוד הזה עדיין בפיתוח...</p>
          </div>
        );
    }
  };

  return (
    <AuthProvider>
      <div className={`min-h-screen ${themeClasses.bg} transition-colors duration-200`}>
        <NavBar 
          isDark={isDark}
          toggleTheme={toggleTheme}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          themeClasses={themeClasses}
          onProfileClick={() => setShowProfile(true)}
          onSettingsClick={() => setShowSettings(true)}
          onCreatePost={() => setShowCreatePost(true)}
        />
        
        <main className="container mx-auto px-4 py-8">
          {renderContent()}
        </main>
      </div>
    </AuthProvider>
  );
};

export default AnimeForum;