// app/series/page.tsx
'use client';

import React, { useState } from 'react';
import AnimeCard from '@/app/Components/AnimeCard';
import { Anime } from '@/app/types';

export default function SeriesPage() {
  const [isDark] = useState(true);

  // Theme classes
  const themeClasses = {
    bg: isDark ? 'bg-gray-900' : 'bg-gray-50',
    cardBg: isDark ? 'bg-gray-800' : 'bg-white',
    text: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-300' : 'text-gray-600',
    border: isDark ? 'border-gray-700' : 'border-gray-200',
    hover: isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
  };

  // נתוני סדרות לדוגמה
  const seriesList: Anime[] = [
    {
      id: 1,
      title: "Attack on Titan",
      image: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Attack+on+Titan",
      rating: 9.0,
      episodes: 87,
      status: 'completed',
      genre: "אקשן",
      type: 'series',
      isNew: false
    },
    {
      id: 2,
      title: "Demon Slayer",
      image: "https://via.placeholder.com/300x400/EF4444/FFFFFF?text=Demon+Slayer",
      rating: 8.8,
      episodes: 44,
      status: 'ongoing',
      genre: "אקשן",
      type: 'series',
      isNew: true
    },
    {
      id: 3,
      title: "Jujutsu Kaisen",
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
      title: "My Hero Academia",
      image: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=My+Hero+Academia",
      rating: 8.5,
      episodes: 138,
      status: 'ongoing',
      genre: "אקשן",
      type: 'series',
      isNew: false
    },
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
      title: "Naruto Shippuden",
      image: "https://via.placeholder.com/300x400/F97316/FFFFFF?text=Naruto",
      rating: 8.7,
      episodes: 500,
      status: 'completed',
      genre: "אקשן",
      type: 'series'
    },
    {
      id: 7,
      title: "Death Note",
      image: "https://via.placeholder.com/300x400/1F2937/FFFFFF?text=Death+Note",
      rating: 9.0,
      episodes: 37,
      status: 'completed',
      genre: "מותחן",
      type: 'series'
    },
    {
      id: 8,
      title: "Hunter x Hunter",
      image: "https://via.placeholder.com/300x400/059669/FFFFFF?text=Hunter+x+Hunter",
      rating: 9.1,
      episodes: 148,
      status: 'completed',
      genre: "הרפתקאות",
      type: 'series'
    }
  ];

  return (
    <div className={`min-h-screen ${themeClasses.bg} transition-colors duration-300`}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* כותרת הדף */}
          <div className="text-center">
            <h1 className={`text-4xl font-bold ${themeClasses.text} mb-4`}>
              סדרות אנימה
            </h1>
            <p className={`text-lg ${themeClasses.textSecondary} max-w-2xl mx-auto`}>
              גלה את הסדרות הטובות ביותר של אנימה - מקלאסיקות ועד לסדרות החדשות ביותר
            </p>
          </div>

          {/* פילטרים */}
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              הכל
            </button>
            <button className={`${themeClasses.cardBg} ${themeClasses.text} px-4 py-2 rounded-lg ${themeClasses.hover} transition-colors`}>
              אקשן
            </button>
            <button className={`${themeClasses.cardBg} ${themeClasses.text} px-4 py-2 rounded-lg ${themeClasses.hover} transition-colors`}>
              הרפתקאות
            </button>
            <button className={`${themeClasses.cardBg} ${themeClasses.text} px-4 py-2 rounded-lg ${themeClasses.hover} transition-colors`}>
              מותחן
            </button>
            <button className={`${themeClasses.cardBg} ${themeClasses.text} px-4 py-2 rounded-lg ${themeClasses.hover} transition-colors`}>
              בהמשך
            </button>
            <button className={`${themeClasses.cardBg} ${themeClasses.text} px-4 py-2 rounded-lg ${themeClasses.hover} transition-colors`}>
              הסתיים
            </button>
          </div>

          {/* רשת הסדרות */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {seriesList.map(anime => (
              <AnimeCard key={anime.id} anime={anime} themeClasses={themeClasses} />
            ))}
          </div>

          {/* סטטיסטיקות */}
          <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg p-6`}>
            <h2 className={`text-2xl font-bold ${themeClasses.text} mb-4 text-center`}>
              סטטיסטיקות
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className={`text-3xl font-bold text-blue-500`}>{seriesList.length}</div>
                <div className={`text-sm ${themeClasses.textSecondary}`}>סדרות</div>
              </div>
              <div>
                <div className={`text-3xl font-bold text-green-500`}>
                  {seriesList.filter(s => s.status === 'ongoing').length}
                </div>
                <div className={`text-sm ${themeClasses.textSecondary}`}>בשידור</div>
              </div>
              <div>
                <div className={`text-3xl font-bold text-yellow-500`}>
                  {seriesList.filter(s => s.status === 'completed').length}
                </div>
                <div className={`text-sm ${themeClasses.textSecondary}`}>הסתיימו</div>
              </div>
              <div>
                <div className={`text-3xl font-bold text-purple-500`}>
                  {(seriesList.reduce((sum, s) => sum + s.rating, 0) / seriesList.length).toFixed(1)}
                </div>
                <div className={`text-sm ${themeClasses.textSecondary}`}>דירוג ממוצע</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}