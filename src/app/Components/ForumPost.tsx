// src/app/Components/ForumPost.tsx
import React from 'react';
import { Star, MessageCircle, Clock } from 'lucide-react';
import { ForumPostData, ThemeClasses } from '../types';

interface ForumPostProps {
  post: ForumPostData;
  expandedPosts: { [key: string]: boolean };
  togglePostExpansion: (postId: string) => void;
  themeClasses: ThemeClasses;
}

const ForumPost: React.FC<ForumPostProps> = ({ 
  post, 
  expandedPosts, 
  togglePostExpansion, 
  themeClasses 
}) => {
  const postId = post.id.toString();
  
  return (
    <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg overflow-hidden ${themeClasses.hover} transition-colors cursor-pointer h-full flex flex-col`}>
      {/* תמונת הפוסט עם overlay למסכים גדולים */}
      <div className="relative">
        <img 
          src={post.postImage} 
          alt={post.title}
          className="w-full h-32 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://via.placeholder.com/800x200/6366F1/FFFFFF?text=${encodeURIComponent(post.category)}`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        
        {/* מידע על התמונה - רק במסכים גדולים */}
        <div className="absolute bottom-0 right-0 p-3 hidden md:block">
          <div className="flex items-center justify-end mb-2">
            <div className="flex items-center space-x-2">
              <span className={`text-white hover:text-blue-300 transition-colors cursor-pointer`}>
                {post.author}
              </span>
              <img 
                src={post.avatar} 
                alt={post.author}
                className="w-8 h-8 rounded-full border border-blue-500"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://via.placeholder.com/40x40/6366F1/FFFFFF?text=${post.author.charAt(0).toUpperCase()}`;
                }}
              />
            </div>
          </div>
        </div>
        
        {/* סטטיסטיקות תחת התמונה */}
        <div className="flex flex-wrap gap-3 text-xs justify-end">
          <div className="flex items-center space-x-1 space-x-reverse">
            <span className="text-gray-300">{post.time}</span>
            <Clock className="w-3 h-3 text-gray-500" />
          </div>

          <div className="flex items-center space-x-1 space-x-reverse">
            <span className="text-gray-300">{post.replies}</span>
            <MessageCircle className="w-3 h-3 text-blue-500" />
          </div>
          
          <div className="flex items-center space-x-1 space-x-reverse">
            <span className="text-gray-300">{post.likes}</span>
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
          </div>
        </div>
      </div>

      {/* כותרת ותוכן */}
      <div className="p-3 text-right flex-1">
        <h3 className={`font-semibold ${themeClasses.text} text-sm hover:text-blue-500 transition-colors line-clamp-2 mb-2`}>
          {post.title}
        </h3>
        
        <div>
          <p className={`text-xs ${themeClasses.textSecondary} ${expandedPosts[postId] ? '' : 'line-clamp-3'}`}>
            {post.content}
          </p>
          
          {post.content.length > 150 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                togglePostExpansion(postId);
              }}
              className="text-xs text-blue-500 hover:text-blue-600 transition-colors mt-1 font-medium"
            >
              {expandedPosts[postId] ? 'קרא פחות' : 'קרא עוד'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumPost;