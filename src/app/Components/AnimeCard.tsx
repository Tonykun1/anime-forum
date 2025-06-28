// src/components/AnimeCard.tsx
import React from 'react';
import { Play, Star } from 'lucide-react';
import { AnimeCardProps } from '../types';

const AnimeCard: React.FC<AnimeCardProps> = ({ anime, themeClasses }) => {
  return (
    <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
      <div className="relative group">
        <img src={anime.image} alt={anime.title} className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
          <Play className="text-white w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
          {anime.status === 'ongoing' ? 'בהקרנה' : 'הסתיים'}
        </div>
        {anime.type && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {anime.type === 'movie' ? 'סרט' : 'סדרה'}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className={`font-bold text-lg ${themeClasses.text} mb-2`}>{anime.title}</h3>
        <p className={`${themeClasses.textSecondary} text-sm mb-2`}>{anime.genre}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Star className="text-yellow-400 w-4 h-4 fill-current" />
            <span className={`${themeClasses.text} font-semibold`}>{anime.rating}</span>
          </div>
          <span className={`${themeClasses.textSecondary} text-sm`}>
            {anime.type === 'movie' ? anime.duration : `${anime.episodes} פרקים`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;