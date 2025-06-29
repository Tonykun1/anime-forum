// src/app/Components/ForumPost.tsx - עם מזהי string
import React from 'react';
import { Star, MessageCircle, Clock } from 'lucide-react';
import { ForumPostData, ForumPostProps } from '../types/ForumPost';

const ForumPost: React.FC<ForumPostProps> = ({ 
  post, 
  expandedPosts, 
  togglePostExpansion, 
  themeClasses 
}) => {
  return (
    <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg overflow-hidden ${themeClasses.hover} transition-colors cursor-pointer h-full flex flex-col`}>
      {/* תמונת הפוסט עם overlay למסכים גדולים */}
      <div className="relative">
        <img 
          src={post.postImage} 
          alt={post.title}
          className="w-full h-32 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        
        {/* מידע על התמונה - רק במסכים גדולים */}
        <div className="absolute bottom-0 right-0 p-3 hidden md:block">
          <div className="flex items-center justify-end mb-2">
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${themeClasses.text} hover:text-blue-500 transition-colors cursor-pointer`}>
                {post.author}
              </span>
              <img 
                src={post.avatar} 
                alt={post.author}
                className="w-8 h-8 rounded-full border border-blue-500"
              />
            </div>
          </div>
        
          {/* סטטיסטיקות תחת התמונה */}
          <div className="flex flex-wrap gap-3 text-xs justify-end">
            <div className="flex items-center space-x-1 space-x-reverse">
              <span className={`${themeClasses.textSecondary}`}>{post.time}</span>
              <Clock className="w-3 h-3 text-gray-500" />
            </div>

            <div className="flex items-center space-x-1 space-x-reverse">
              <span className={`${themeClasses.textSecondary}`}>{post.replies}</span>
              <MessageCircle className="w-3 h-3 text-blue-500" />
            </div>
            
            <div className="flex items-center space-x-1 space-x-reverse">
              <span className={`${themeClasses.textSecondary}`}>{post.likes}</span>
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
            </div>
          </div>
        </div>
      </div>

      {/* כותרת ותוכן */}
      <div className="p-3 text-right flex-1">
        <h3 className={`font-semibold ${themeClasses.text} text-sm hover:text-blue-500 transition-colors line-clamp-2 mb-2`}>
          {post.title}
        </h3>
        
        <div>
          <p className={`text-xs ${themeClasses.textSecondary} ${expandedPosts[post.id] ? '' : 'line-clamp-3'}`}>
            {post.content}
          </p>
          
          {post.content.length > 150 && (
            <button 
              onClick={() => togglePostExpansion(post.id)}
              className="text-xs text-blue-500 hover:text-blue-600 transition-colors mt-1 font-medium"
            >
              {expandedPosts[post.id] ? 'קרא פחות' : 'קרא עוד'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumPost;