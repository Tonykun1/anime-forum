// src/app/page.tsx
'use client';

import React, { useState } from 'react';
import NavBar from './Components/NavBar';
import AnimeCard from './Components/AnimeCard';
import AnimeCarousel from './Components/AnimeCarousel';
import ForumPost from './Components/ForumPost';
import UserProfilePage from './Components/UserProfilePage';
import UserSettingsPage from './Components/UserSettingsPage';
import { useForumPosts } from './hooks/useForumPosts';
import { useCreatePost } from './Context/CreatePostContext';
import { ForumPostData, Anime } from './types';

const AnimeForum: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [expandedPosts, setExpandedPosts] = useState<{ [key: string]: boolean }>({});
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const { openCreatePost } = useCreatePost(); // שימוש ב-Context העולמי

  // Use the custom hook for forum posts
  const { 
    posts: forumPosts, 
    loading: postsLoading, 
    error: postsError, 
    refetch: refetchPosts 
  } = useForumPosts();

  // Anime data
  const newSeasonAnime: Anime[] = [
    {
      id: 1,
      title: "Attack on Titan: Final Season",
      image: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Attack+on+Titan",
      rating: 9.0,
      episodes: 16,
      status: 'completed',
      genre: "אקשן",
      type: 'series',
      isNew: true
    },
    {
      id: 2,
      title: "Demon Slayer: Hashira Training Arc",
      image: "https://via.placeholder.com/300x400/EF4444/FFFFFF?text=Demon+Slayer",
      rating: 8.8,
      episodes: 11,
      status: 'ongoing',
      genre: "אקשן",
      type: 'series',
      isNew: true
    },
    {
      id: 3,
      title: "Jujutsu Kaisen Season 3",
      image: "https://via.placeholder.com/300x400/8B5CF6/FFFFFF?text=Jujutsu+Kaisen",
      rating: 8.9,
      episodes: 24,
      status: 'ongoing',
      genre: "אקשן",
      type: 'series',
      isNew: true
    },
    {
      id: 4,
      title: "My Hero Academia Season 7",
      image: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=My+Hero+Academia",
      rating: 8.5,
      episodes: 25,
      status: 'ongoing',
      genre: "אקשן",
      type: 'series',
      isNew: true
    }
  ];

  const animeList: Anime[] = [
    ...newSeasonAnime,
    {
      id: 5,
      title: "One Piece",
      image: "https://via.placeholder.com/300x400/F59E0B/FFFFFF?text=One+Piece",
      rating: 9.2,
      episodes: 1000,
      status: 'ongoing',
      genre: "הרפתקאות",
      type: 'series'
    },
    {
      id: 6,
      title: "Spirited Away",
      image: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Spirited+Away",
      rating: 9.3,
      duration: "125 דקות",
      status: 'completed',
      genre: "משפחה",
      type: 'movie'
    },
    {
      id: 7,
      title: "Princess Mononoke",
      image: "https://via.placeholder.com/300x400/8B5CF6/FFFFFF?text=Princess+Mononoke",
      rating: 9.1,
      duration: "134 דקות",
      status: 'completed',
      genre: "הרפתקאות",
      type: 'movie'
    },
    {
      id: 8,
      title: "Naruto Shippuden",
      image: "https://via.placeholder.com/300x400/F97316/FFFFFF?text=Naruto",
      rating: 8.7,
      episodes: 500,
      status: 'completed',
      genre: "אקשן",
      type: 'series'
    }
  ];

  // Theme classes
  const themeClasses = {
    bg: isDark ? 'bg-gray-900' : 'bg-gray-50',
    cardBg: isDark ? 'bg-gray-800' : 'bg-white',
    text: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-300' : 'text-gray-600',
    border: isDark ? 'border-gray-700' : 'border-gray-200',
    hover: isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
  };

  // Event handlers
  const toggleTheme = () => setIsDark(!isDark);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const togglePostExpansion = (postId: string) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % newSeasonAnime.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + newSeasonAnime.length) % newSeasonAnime.length);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
  };

  const handleProfileClick = () => {
    setShowProfile(true);
    setShowSettings(false);
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
    setShowProfile(false);
  };

  const handleBackFromProfile = () => {
    setShowProfile(false);
  };

  const handleBackFromSettings = () => {
    setShowSettings(false);
  };

  // Show settings page
  if (showSettings) {
    return (
      <div className={`min-h-screen ${themeClasses.bg} transition-colors duration-300`}>
        <NavBar 
          isDark={isDark}
          toggleTheme={toggleTheme}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          onCreatePost={openCreatePost}
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
      </div>
    );
  }

  // Show profile page
  if (showProfile) {
    return (
      <div className={`min-h-screen ${themeClasses.bg} transition-colors duration-300`}>
        <NavBar 
          isDark={isDark}
          toggleTheme={toggleTheme}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          onCreatePost={openCreatePost}
          onProfileClick={handleProfileClick}
          onSettingsClick={handleSettingsClick}
          themeClasses={themeClasses}
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <UserProfilePage 
            themeClasses={themeClasses}
            userPosts={forumPosts}
            onBack={handleBackFromProfile}
            onCreatePost={openCreatePost}
          />
        </main>
      </div>
    );
  }

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'reviews':
        return (
          <div className="space-y-8">
            <h2 className={`text-3xl font-bold ${themeClasses.text} mb-6`}>ביקורות ודירוגים</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
              {animeList.map(anime => (
                <AnimeCard key={anime.id} anime={anime} themeClasses={themeClasses} />
              ))}
            </div>
          </div>
        );
        
      case 'series':
        return (
          <div className="space-y-8">
            <h2 className={`text-3xl font-bold ${themeClasses.text} mb-6`}>סדרות אנימה</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
              {animeList.filter(anime => anime.type === 'series').map(anime => (
                <AnimeCard key={anime.id} anime={anime} themeClasses={themeClasses} />
              ))}
            </div>
          </div>
        );
        
      case 'movies':
        return (
          <div className="space-y-8">
            <h2 className={`text-3xl font-bold ${themeClasses.text} mb-6`}>סרטי אנימה</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
              {animeList.filter(anime => anime.type === 'movie').map(anime => (
                <AnimeCard key={anime.id} anime={anime} themeClasses={themeClasses} />
              ))}
            </div>
          </div>
        );
        
      case 'posts':
        return (
          <div className="space-y-8">
            <h2 className={`text-3xl font-bold ${themeClasses.text} mb-6`}>פוסטים ודיונים</h2>
            
            {postsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
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
            )}
          </div>
        );
        
      case 'watchlist':
        return (
          <div className="space-y-8">
            <h2 className={`text-3xl font-bold ${themeClasses.text} mb-6`}>רשימת הצפייה שלי</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
              {animeList.slice(0, 3).map(anime => (
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
              
              {postsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
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
              )}
            </section>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen ${themeClasses.bg} transition-colors duration-300`}>
      <NavBar 
        isDark={isDark}
        toggleTheme={toggleTheme}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        onCreatePost={openCreatePost}
        onProfileClick={handleProfileClick}
        onSettingsClick={handleSettingsClick}
        themeClasses={themeClasses}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default AnimeForum;