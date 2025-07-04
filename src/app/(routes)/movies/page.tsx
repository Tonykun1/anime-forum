// app/movies/page.tsx
'use client';

import React, { useState } from 'react';
import AnimeCard from '@/app/Components/AnimeCard';
import { Anime } from '@/app/types';

export default function MoviesPage() {
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

  // נתוני סרטים לדוגמה
  const moviesList: Anime[] = [
    {
      id: 1,
      title: "Spirited Away",
      image: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Spirited+Away",
      rating: 9.3,
      duration: "125 דקות",
      status: 'completed',
      genre: "משפחה",
      type: 'movie'
    },
    {
      id: 2,
      title: "Princess Mononoke",
      image: "https://via.placeholder.com/300x400/8B5CF6/FFFFFF?text=Princess+Mononoke",
      rating: 9.1,
      duration: "134 דקות",
      status: 'completed',
      genre: "הרפתקאות",
      type: 'movie'
    },
    {
      id: 3,
      title: "My Neighbor Totoro",
      image: "https://via.placeholder.com/300x400/059669/FFFFFF?text=My+Neighbor+Totoro",
      rating: 8.8,
      duration: "86 דקות",
      status: 'completed',
      genre: "משפחה",
      type: 'movie'
    },
    {
      id: 4,
      title: "Howl's Moving Castle",
      image: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Howls+Moving+Castle",
      rating: 9.0,
      duration: "119 דקות",
      status: 'completed',
      genre: "רומנטיקה",
      type: 'movie'
    },
    {
      id: 5,
      title: "Akira",
      image: "https://via.placeholder.com/300x400/EF4444/FFFFFF?text=Akira",
      rating: 8.9,
      duration: "124 דקות",
      status: 'completed',
      genre: "אקשן",
      type: 'movie'
    },
    {
      id: 6,
      title: "Ghost in the Shell",
      image: "https://via.placeholder.com/300x400/6366F1/FFFFFF?text=Ghost+in+the+Shell",
      rating: 8.7,
      duration: "83 דקות",
      status: 'completed',
      genre: "מדע בדיוני",
      type: 'movie'
    },
    {
      id: 7,
      title: "Demon Slayer: Mugen Train",
      image: "https://via.placeholder.com/300x400/F59E0B/FFFFFF?text=Demon+Slayer+Movie",
      rating: 8.8,
      duration: "117 דקות",
      status: 'completed',
      genre: "אקשן",
      type: 'movie',
      isNew: true
    },
    {
      id: 8,
      title: "Your Name",
      image: "https://via.placeholder.com/300x400/EC4899/FFFFFF?text=Your+Name",
      rating: 9.2,
      duration: "106 דקות",
      status: 'completed',
      genre: "רומנטיקה",
      type: 'movie'
    },
    {
      id: 9,
      title: "Castle in the Sky",
      image: "https://via.placeholder.com/300x400/14B8A6/FFFFFF?text=Castle+in+the+Sky",
      rating: 8.9,
      duration: "125 דקות",
      status: 'completed',
      genre: "הרפתקאות",
      type: 'movie'
    },
    {
      id: 10,
      title: "Weathering with You",
      image: "https://via.placeholder.com/300x400/06B6D4/FFFFFF?text=Weathering+with+You",
      rating: 8.6,
      duration: "112 דקות",
      status: 'completed',
      genre: "רומנטיקה",
      type: 'movie'
    }
  ];

  return (
    <div className={`min-h-screen ${themeClasses.bg} transition-colors duration-300`}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* כותרת הדף */}
          <div className="text-center">
            <h1 className={`text-4xl font-bold ${themeClasses.text} mb-4`}>
              סרטי אנימה
            </h1>
            <p className={`text-lg ${themeClasses.textSecondary} max-w-2xl mx-auto`}>
              אוסף הסרטים הטובים ביותר של אנימה - מיצירות מופת קלאסיות ועד לסרטים החדשים
            </p>
          </div>

          {/* פילטרים */}
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              הכל
            </button>
            <button className={`${themeClasses.cardBg} ${themeClasses.text} px-4 py-2 rounded-lg ${themeClasses.hover} transition-colors`}>
              Studio Ghibli
            </button>
            <button className={`${themeClasses.cardBg} ${themeClasses.text} px-4 py-2 rounded-lg ${themeClasses.hover} transition-colors`}>
              אקשן
            </button>
            <button className={`${themeClasses.cardBg} ${themeClasses.text} px-4 py-2 rounded-lg ${themeClasses.hover} transition-colors`}>
              רומנטיקה
            </button>
            <button className={`${themeClasses.cardBg} ${themeClasses.text} px-4 py-2 rounded-lg ${themeClasses.hover} transition-colors`}>
              משפחה
            </button>
            <button className={`${themeClasses.cardBg} ${themeClasses.text} px-4 py-2 rounded-lg ${themeClasses.hover} transition-colors`}>
              מדע בדיוני
            </button>
          </div>

          {/* רשת הסרטים */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {moviesList.map(anime => (
              <AnimeCard key={anime.id} anime={anime} themeClasses={themeClasses} />
            ))}
          </div>

          {/* הסרטים המומלצים */}
          <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg p-6`}>
            <h2 className={`text-2xl font-bold ${themeClasses.text} mb-6`}>
              הסרטים המומלצים ביותר
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {moviesList
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 3)
                .map(movie => (
                  <div key={movie.id} className={`${themeClasses.hover} p-4 rounded-lg transition-colors`}>
                    <div className="flex items-center space-x-4">
                      <img 
                        src={movie.image} 
                        alt={movie.title}
                        className="w-16 h-20 object-cover rounded"
                      />
                      <div>
                        <h3 className={`font-semibold ${themeClasses.text} mb-1`}>
                          {movie.title}
                        </h3>
                        <p className={`text-sm ${themeClasses.textSecondary} mb-1`}>
                          {movie.genre} • {movie.duration}
                        </p>
                        <div className="flex items-center">
                          <span className="text-yellow-500">⭐</span>
                          <span className={`text-sm ${themeClasses.text} ml-1`}>
                            {movie.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* סטטיסטיקות */}
          <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg p-6`}>
            <h2 className={`text-2xl font-bold ${themeClasses.text} mb-4 text-center`}>
              סטטיסטיקות
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className={`text-3xl font-bold text-blue-500`}>{moviesList.length}</div>
                <div className={`text-sm ${themeClasses.textSecondary}`}>סרטים</div>
              </div>
              <div>
                <div className={`text-3xl font-bold text-green-500`}>
                  {moviesList.filter(m => m.isNew).length}
                </div>
                <div className={`text-sm ${themeClasses.textSecondary}`}>חדשים</div>
              </div>
              <div>
                <div className={`text-3xl font-bold text-yellow-500`}>
                  {Math.round(moviesList.reduce((sum, m) => {
                    const duration = parseInt(m.duration?.split(' ')[0] || '0');
                    return sum + duration;
                  }, 0) / 60)}
                </div>
                <div className={`text-sm ${themeClasses.textSecondary}`}>שעות סה"כ</div>
              </div>
              <div>
                <div className={`text-3xl font-bold text-purple-500`}>
                  {(moviesList.reduce((sum, m) => sum + m.rating, 0) / moviesList.length).toFixed(1)}
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