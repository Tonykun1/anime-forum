// app/watchlist/page.tsx
'use client';

import React, { useState } from 'react';
import AnimeCard from '@/app/Components/AnimeCard';
import { Anime } from '@/app/types';
import { Play, Pause, Check, Clock, Plus, Trash2, Star } from 'lucide-react';

export default function WatchlistPage() {
  const [isDark] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('watching');

  // Theme classes
  const themeClasses = {
    bg: isDark ? 'bg-gray-900' : 'bg-gray-50',
    cardBg: isDark ? 'bg-gray-800' : 'bg-white',
    text: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-300' : 'text-gray-600',
    border: isDark ? 'border-gray-700' : 'border-gray-200',
    hover: isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
  };

  // נתוני רשימת הצפייה לדוגמה
  const watchlistData = {
    watching: [
      {
        id: 1,
        title: "Attack on Titan: Final Season",
        image: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Attack+on+Titan",
        rating: 9.0,
        episodes: 16,
        watchedEpisodes: 12,
        status: 'ongoing',
        genre: "אקשן",
        type: 'series' as const,
        progress: 75
      },
      {
        id: 2,
        title: "Demon Slayer: Hashira Training",
        image: "https://via.placeholder.com/300x400/EF4444/FFFFFF?text=Demon+Slayer",
        rating: 8.8,
        episodes: 11,
        watchedEpisodes: 8,
        status: 'ongoing',
        genre: "אקשן",
        type: 'series' as const,
        progress: 73
      }
    ],
    planToWatch: [
      {
        id: 3,
        title: "Jujutsu Kaisen Season 3",
        image: "https://via.placeholder.com/300x400/8B5CF6/FFFFFF?text=Jujutsu+Kaisen",
        rating: 8.9,
        episodes: 24,
        watchedEpisodes: 0,
        status: 'upcoming',
        genre: "אקשן",
        type: 'series' as const,
        progress: 0
      },
      {
        id: 4,
        title: "Your Name",
        image: "https://via.placeholder.com/300x400/EC4899/FFFFFF?text=Your+Name",
        rating: 9.2,
        duration: "106 דקות",
        status: 'completed',
        genre: "רומנטיקה",
        type: 'movie' as const,
        progress: 0
      }
    ],
    completed: [
      {
        id: 5,
        title: "Spirited Away",
        image: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Spirited+Away",
        rating: 9.3,
        duration: "125 דקות",
        status: 'completed',
        genre: "משפחה",
        type: 'movie' as const,
        progress: 100,
        myRating: 10
      },
      {
        id: 6,
        title: "Death Note",
        image: "https://via.placeholder.com/300x400/1F2937/FFFFFF?text=Death+Note",
        rating: 9.0,
        episodes: 37,
        watchedEpisodes: 37,
        status: 'completed',
        genre: "מותחן",
        type: 'series' as const,
        progress: 100,
        myRating: 9
      }
    ],
    dropped: [
      {
        id: 7,
        title: "One Piece",
        image: "https://via.placeholder.com/300x400/F59E0B/FFFFFF?text=One+Piece",
        rating: 9.2,
        episodes: 1000,
        watchedEpisodes: 45,
        status: 'ongoing',
        genre: "הרפתקאות",
        type: 'series' as const,
        progress: 4.5
      }
    ]
  };

  const tabs = [
    { id: 'watching', name: 'צופה כעת', icon: Play, count: watchlistData.watching.length },
    { id: 'planToWatch', name: 'מתכנן לצפות', icon: Clock, count: watchlistData.planToWatch.length },
    { id: 'completed', name: 'הושלם', icon: Check, count: watchlistData.completed.length },
    { id: 'dropped', name: 'הפסקתי', icon: Pause, count: watchlistData.dropped.length }
  ];

  const getCurrentData = () => {
    return watchlistData[activeTab as keyof typeof watchlistData] || [];
  };

  const getTotalStats = () => {
    const totalItems = Object.values(watchlistData).flat().length;
    const totalEpisodes = Object.values(watchlistData).flat().reduce((sum, item) => {
      return sum + (item.watchedEpisodes || 0);
    }, 0);
    
    const itemsWithRating = Object.values(watchlistData).flat()
      .filter((item): item is any => 'myRating' in item && item.myRating !== undefined);
    
    const avgRating = itemsWithRating.length > 0 
      ? itemsWithRating.reduce((sum, item) => sum + item.myRating, 0) / itemsWithRating.length
      : 0;
    
    return { totalItems, totalEpisodes, avgRating };
  };

  const stats = getTotalStats();

  return (
    <div className={`min-h-screen ${themeClasses.bg} transition-colors duration-300`}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* כותרת הדף */}
          <div className="text-center">
            <h1 className={`text-4xl font-bold ${themeClasses.text} mb-4`}>
              רשימת הצפייה שלי
            </h1>
            <p className={`text-lg ${themeClasses.textSecondary} max-w-2xl mx-auto`}>
              עקוב אחר התקדמותך ונהל את רשימת האנימה שלך
            </p>
          </div>

          {/* סטטיסטיקות */}
          <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg p-6`}>
            <h2 className={`text-xl font-bold ${themeClasses.text} mb-4 text-center`}>
              הסטטיסטיקות שלי
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className={`text-2xl font-bold text-blue-500`}>{stats.totalItems}</div>
                <div className={`text-sm ${themeClasses.textSecondary}`}>סה"כ פריטים</div>
              </div>
              <div>
                <div className={`text-2xl font-bold text-green-500`}>{stats.totalEpisodes}</div>
                <div className={`text-sm ${themeClasses.textSecondary}`}>פרקים נצפו</div>
              </div>
              <div>
                <div className={`text-2xl font-bold text-yellow-500`}>
                  {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '-'}
                </div>
                <div className={`text-sm ${themeClasses.textSecondary}`}>דירוג ממוצע</div>
              </div>
              <div>
                <div className={`text-2xl font-bold text-purple-500`}>
                  {Math.round((stats.totalEpisodes * 24) / 60)} שע'
                </div>
                <div className={`text-sm ${themeClasses.textSecondary}`}>זמן צפייה</div>
              </div>
            </div>
          </div>

          {/* טאבים */}
          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map(({ id, name, icon: Icon, count }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === id 
                    ? 'bg-blue-500 text-white' 
                    : `${themeClasses.cardBg} ${themeClasses.text} ${themeClasses.hover}`
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{name}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activeTab === id ? 'bg-white/20' : 'bg-gray-500/20'
                }`}>
                  {count}
                </span>
              </button>
            ))}
          </div>

          {/* תוכן הרשימה */}
          <div className="space-y-6">
            {getCurrentData().length === 0 ? (
              <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg p-12 text-center`}>
                <div className={`w-16 h-16 ${themeClasses.textSecondary} mx-auto mb-4`}>
                  {tabs.find(tab => tab.id === activeTab)?.icon && (
                    React.createElement(tabs.find(tab => tab.id === activeTab)!.icon, { 
                      className: "w-full h-full" 
                    })
                  )}
                </div>
                <h3 className={`text-lg font-semibold ${themeClasses.text} mb-2`}>
                  אין פריטים ברשימה הזו
                </h3>
                <p className={`${themeClasses.textSecondary} mb-4`}>
                  התחל להוסיף אנימה לרשימת הצפייה שלך
                </p>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
                  <Plus className="w-4 h-4 inline mr-2" />
                  הוסף אנימה
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {getCurrentData().map((anime: any) => (
                  <div key={anime.id} className="relative group">
                    <AnimeCard anime={anime} themeClasses={themeClasses} />
                    
                    {/* אוברליי עם פרטים נוספים */}
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col justify-between p-4">
                      <div className="text-white">
                        {anime.progress !== undefined && (
                          <div className="mb-2">
                            <div className="flex justify-between text-sm mb-1">
                              <span>התקדמות</span>
                              <span>{anime.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${anime.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        
                        {anime.watchedEpisodes !== undefined && (
                          <div className="text-sm mb-2">
                            פרק {anime.watchedEpisodes}/{anime.episodes || '?'}
                          </div>
                        )}
                        
                        {anime.myRating && (
                          <div className="flex items-center text-sm mb-2">
                            <Star className="w-3 h-3 text-yellow-500 mr-1" />
                            <span>{anime.myRating}/10</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between">
                        <button className="bg-blue-500 hover:bg-blue-600 p-2 rounded transition-colors">
                          <Play className="w-4 h-4 text-white" />
                        </button>
                        <button className="bg-red-500 hover:bg-red-600 p-2 rounded transition-colors">
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* המלצות */}
          {activeTab === 'planToWatch' && (
            <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg p-6`}>
              <h2 className={`text-xl font-bold ${themeClasses.text} mb-4`}>
                המלצות בהתבסס על הטעם שלך
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: "Hunter x Hunter", genre: "הרפתקאות", rating: 9.1 },
                  { title: "Fullmetal Alchemist", genre: "אקשן", rating: 9.5 },
                  { title: "Monster", genre: "מותחן", rating: 9.0 },
                  { title: "Cowboy Bebop", genre: "אקשן", rating: 8.8 }
                ].map((rec, index) => (
                  <div key={index} className={`${themeClasses.hover} p-3 rounded-lg transition-colors cursor-pointer`}>
                    <h3 className={`font-semibold ${themeClasses.text} text-sm mb-1`}>
                      {rec.title}
                    </h3>
                    <p className={`text-xs ${themeClasses.textSecondary} mb-1`}>
                      {rec.genre}
                    </p>
                    <div className="flex items-center">
                      <Star className="w-3 h-3 text-yellow-500 mr-1" />
                      <span className={`text-xs ${themeClasses.text}`}>
                        {rec.rating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}