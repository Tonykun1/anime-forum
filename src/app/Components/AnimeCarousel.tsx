// src/components/AnimeCarousel.tsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AnimeCard from './AnimeCard';
import { AnimeCarouselProps } from '../types';

const AnimeCarousel: React.FC<AnimeCarouselProps> = ({ 
  newSeasonAnime, 
  currentSlide, 
  nextSlide, 
  prevSlide, 
  setCurrentSlide, 
  isDark, 
  themeClasses 
}) => {
  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-3xl font-bold ${themeClasses.text}`}>
          אנימות העונה החדשות
          <span className="text-lg ml-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            ({currentSlide + 1}/2)
          </span>
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={prevSlide}
            className={`p-2 rounded-full ${themeClasses.cardBg} ${themeClasses.border} border ${themeClasses.hover} transition-all duration-300 hover:scale-110`}
          >
            <ChevronRight className={`w-5 h-5 ${themeClasses.text}`} />
          </button>
          <button
            onClick={nextSlide}
            className={`p-2 rounded-full ${themeClasses.cardBg} ${themeClasses.border} border ${themeClasses.hover} transition-all duration-300 hover:scale-110`}
          >
            <ChevronLeft className={`w-5 h-5 ${themeClasses.text}`} />
          </button>
        </div>
      </div>
      
      <div className="relative overflow-hidden rounded-lg">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          <div className="w-full flex-shrink-0">
            <div className="grid grid-cols-5 gap-2 md:gap-4">
              {newSeasonAnime.slice(0, 5).map(anime => (
                <div key={anime.id} className="relative">
                  <AnimeCard anime={anime} themeClasses={themeClasses} />
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                      NEW!
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full flex-shrink-0">
            <div className="grid grid-cols-5 gap-2 md:gap-4">
              {newSeasonAnime.slice(5, 10).map(anime => (
                <div key={anime.id} className="relative">
                  <AnimeCard anime={anime} themeClasses={themeClasses} />
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                      NEW!
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mt-6 space-x-2">
        {[0, 1].map((index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-blue-500 w-8' 
                : `${isDark ? 'bg-gray-600' : 'bg-gray-300'} hover:bg-blue-400`
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimeCarousel;