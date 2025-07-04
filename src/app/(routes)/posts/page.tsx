// app/posts/page.tsx
'use client';

import React, { useState } from 'react';
import PostsList from '@/app/Components/PostsList';
import { MessageSquare, TrendingUp, Clock, Star } from 'lucide-react';

export default function PostsPage() {
  const [isDark] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  // Theme classes
  const themeClasses = {
    bg: isDark ? 'bg-gray-900' : 'bg-gray-50',
    cardBg: isDark ? 'bg-gray-800' : 'bg-white',
    text: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-300' : 'text-gray-600',
    border: isDark ? 'border-gray-700' : 'border-gray-200',
    hover: isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
  };

  const categories = [
    { id: 'all', name: 'הכל', icon: MessageSquare },
    { id: 'דיונים', name: 'דיונים', icon: MessageSquare },
    { id: 'ביקורות', name: 'ביקורות', icon: Star },
    { id: 'המלצות', name: 'המלצות', icon: TrendingUp },
    { id: 'שאלות', name: 'שאלות', icon: MessageSquare },
    { id: 'חדשות', name: 'חדשות', icon: Clock },
    { id: 'מימים', name: 'מימים', icon: MessageSquare }
  ];

  const sortOptions = [
    { id: 'recent', name: 'אחרונים', icon: Clock },
    { id: 'popular', name: 'פופולריים', icon: TrendingUp },
    { id: 'rating', name: 'מדורגים', icon: Star }
  ];

  return (
    <div className={`min-h-screen ${themeClasses.bg} transition-colors duration-300`}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* כותרת הדף */}
          <div className="text-center">
            <h1 className={`text-4xl font-bold ${themeClasses.text} mb-4`}>
              פוסטים ודיונים
            </h1>
            <p className={`text-lg ${themeClasses.textSecondary} max-w-2xl mx-auto`}>
              שתף ודון עם הקהילה על כל מה שקשור לאנימה ומנגה
            </p>
          </div>

          {/* פילטרים ומיון */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* קטגוריות */}
            <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg p-6 lg:w-64`}>
              <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4`}>
                קטגוריות
              </h3>
              <div className="space-y-2">
                {categories.map(({ id, name, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedCategory(id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-right ${
                      selectedCategory === id 
                        ? 'bg-blue-500 text-white' 
                        : `${themeClasses.text} ${themeClasses.hover}`
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{name}</span>
                  </button>
                ))}
              </div>

              {/* מיון */}
              <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4 mt-6`}>
                מיון לפי
              </h3>
              <div className="space-y-2">
                {sortOptions.map(({ id, name, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setSortBy(id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-right ${
                      sortBy === id 
                        ? 'bg-green-500 text-white' 
                        : `${themeClasses.text} ${themeClasses.hover}`
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* תוכן הפוסטים */}
            <div className="flex-1">
              <PostsList 
                themeClasses={themeClasses}
                layout="list"
                limit={20}
                category={selectedCategory}
              />
            </div>
          </div>

          {/* סטטיסטיקות הקהילה */}
          <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg p-6`}>
            <h2 className={`text-2xl font-bold ${themeClasses.text} mb-6 text-center`}>
              סטטיסטיקות הקהילה
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className={`text-3xl font-bold text-blue-500 mb-2`}>1,247</div>
                <div className={`text-sm ${themeClasses.textSecondary}`}>פוסטים פעילים</div>
              </div>
              <div>
                <div className={`text-3xl font-bold text-green-500 mb-2`}>8,392</div>
                <div className={`text-sm ${themeClasses.textSecondary}`}>תגובות השבוע</div>
              </div>
              <div>
                <div className={`text-3xl font-bold text-yellow-500 mb-2`}>523</div>
                <div className={`text-sm ${themeClasses.textSecondary}`}>משתמשים פעילים</div>
              </div>
              <div>
                <div className={`text-3xl font-bold text-purple-500 mb-2`}>89</div>
                <div className={`text-sm ${themeClasses.textSecondary}`}>דיונים חמים</div>
              </div>
            </div>
          </div>

          {/* הנושאים החמים */}
          <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg p-6`}>
            <h2 className={`text-2xl font-bold ${themeClasses.text} mb-6`}>
              הנושאים החמים השבוע
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { topic: 'Attack on Titan הסיום', posts: 342, color: 'blue' },
                { topic: 'המלצות לעונת החורף', posts: 189, color: 'green' },
                { topic: 'Demon Slayer דיון', posts: 156, color: 'red' },
                { topic: 'מנגה חדשה לקרוא', posts: 134, color: 'purple' },
                { topic: 'Studio Ghibli אהבה', posts: 98, color: 'pink' },
                { topic: 'איזה אנימה הבא?', posts: 87, color: 'yellow' }
              ].map((item, index) => (
                <div 
                  key={index}
                  className={`${themeClasses.hover} p-4 rounded-lg transition-colors cursor-pointer`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-semibold ${themeClasses.text} mb-1`}>
                        {item.topic}
                      </h3>
                      <p className={`text-sm ${themeClasses.textSecondary}`}>
                        {item.posts} פוסטים
                      </p>
                    </div>
                    <div className={`w-3 h-3 rounded-full bg-${item.color}-500`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}