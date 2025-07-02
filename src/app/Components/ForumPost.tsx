// src/app/Components/ForumPost.tsx - תוקן להתאים לטיפוסים החדשים
import React from 'react';
import { Star, MessageCircle, Clock, Eye } from 'lucide-react';

interface ForumPostData {
  id: string | number;
  title: string;
  content: string;
  author: {
    username: string;
  };
  likes_count: number;
  comments_count: number;
  views_count: number;
  created_at: string;
  image_url?: string;
  category: {
    name: string;
    color: string;
  };
}

interface ThemeClasses {
  bg: string;
  cardBg: string;
  text: string;
  textSecondary: string;
  border: string;
  hover: string;
}

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
  const isExpanded = expandedPosts[post.id];
  const previewContent = post.content.length > 120 ? 
    post.content.substring(0, 120) + '...' : 
    post.content;

  // פורמט התאריך
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffHours < 1) {
        return 'לפני כמה דקות';
      } else if (diffHours < 24) {
        return `לפני ${diffHours} שעות`;
      } else if (diffDays === 1) {
        return 'אתמול';
      } else if (diffDays < 7) {
        return `לפני ${diffDays} ימים`;
      } else {
        return date.toLocaleDateString('he-IL');
      }
    } catch {
      return 'לפני זמן';
    }
  };

  return (
    <div 
      className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg overflow-hidden ${themeClasses.hover} transition-all duration-200 cursor-pointer h-full flex flex-col`}
      onClick={() => togglePostExpansion(post.id.toString())}
    >
      {/* תמונת הפוסט */}
      {post.image_url && (
        <div className="relative">
          <img 
            src={post.image_url} 
            alt={post.title}
            className="w-full h-32 object-cover"
            onError={(e) => {
              // אם התמונה לא נטענת, הסתר אותה
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          
          {/* קטגוריה על התמונה */}
          <div className="absolute top-2 right-2">
            <span 
              className="px-2 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: post.category.color }}
            >
              {post.category.name}
            </span>
          </div>
        </div>
      )}

      {/* תוכן הפוסט */}
      <div className="p-4 flex-1 flex flex-col">
        {/* כותרת */}
        <h3 className={`text-lg font-semibold ${themeClasses.text} mb-2 line-clamp-2`}>
          {post.title}
        </h3>

        {/* תוכן */}
        <div className="flex-1">
          <p className={`${themeClasses.textSecondary} text-sm leading-relaxed`}>
            {isExpanded ? post.content : previewContent}
          </p>
          
          {post.content.length > 120 && (
            <button className="text-blue-500 hover:text-blue-400 text-sm mt-2 font-medium">
              {isExpanded ? 'הראה פחות' : 'הראה עוד'}
            </button>
          )}
        </div>

        {/* מידע על הכותב */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {post.author.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className={`text-sm font-medium ${themeClasses.text}`}>
                {post.author.username}
              </p>
              <p className={`text-xs ${themeClasses.textSecondary}`}>
                {formatDate(post.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* סטטיסטיקות */}
        <div className="flex items-center justify-between mt-3 text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className={themeClasses.textSecondary}>{post.likes_count}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4 text-blue-500" />
              <span className={themeClasses.textSecondary}>{post.comments_count}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4 text-gray-500" />
              <span className={themeClasses.textSecondary}>{post.views_count}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className={`text-xs ${themeClasses.textSecondary}`}>
              {formatDate(post.created_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumPost;