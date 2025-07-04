// src/app/Components/PostsList.tsx - קומפוננט מעודכן לפוסטים מהDB
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Eye, 
  Clock, 
  User,
  AlertCircle,
  RefreshCcw
} from 'lucide-react';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  postImage?: string;
  category: string;
  likes: number;
  replies: number;
  views?: number;
  time: string;
  created_at: string;
}

interface PostsListProps {
  className?: string;
  limit?: number;
  category?: string;
  search?: string;
  themeClasses: {
    bg: string;
    cardBg: string;
    text: string;
    textSecondary: string;
    border: string;
    hover: string;
  };
  layout?: 'grid' | 'list';
}

const PostsList: React.FC<PostsListProps> = ({ 
  className = "", 
  limit = 20,
  category,
  search,
  themeClasses,
  layout = 'grid'
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPosts(true); // איפוס בכל שינוי פרמטרים
  }, [category, search, limit]);

  const fetchPosts = async (reset = false) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching posts from API...', { page: reset ? 1 : page, limit, category, search });
      
      // בניית URL עם פרמטרים
      const params = new URLSearchParams();
      params.set('page', reset ? '1' : page.toString());
      params.set('limit', limit.toString());
      if (category && category !== 'all') params.set('category', category);
      if (search) params.set('search', search);
      
      const response = await fetch(`/api/posts?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Posts fetched successfully:', data);
      
      // המרת הנתונים לפורמט הנכון
      const formattedPosts: Post[] = data.posts.map((post: any) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        author: post.author,
        authorAvatar: post.authorAvatar || `https://via.placeholder.com/50x50/6366F1/FFFFFF?text=${post.author.substring(0, 2).toUpperCase()}`,
        postImage: post.postImage || generatePlaceholderImage(post.title),
        category: post.category || 'כללי',
        likes: post.likes || 0,
        replies: post.replies || 0,
        views: post.views || 0,
        time: post.time || 'עכשיו',
        created_at: post.created_at
      }));
      
      if (reset || page === 1) {
        setPosts(formattedPosts);
        setPage(1);
      } else {
        setPosts(prev => [...prev, ...formattedPosts]);
      }
      
      // בדיקה אם יש עוד עמודים
      if (data.pagination) {
        setHasMore(page < data.pagination.totalPages);
      } else {
        setHasMore(formattedPosts.length === limit);
      }
      
    } catch (err) {
      console.error('❌ Error fetching posts:', err);
      setError(err instanceof Error ? err.message : 'שגיאה בטעינת פוסטים');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    fetchPosts(true);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => {
        const newPage = prev + 1;
        // קריאה מאוחרת לפונקציה עם העמוד החדש
        setTimeout(() => fetchPosts(false), 0);
        return newPage;
      });
    }
  };

  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  const generatePlaceholderImage = (title: string): string => {
    const colors = [
      '3B82F6', 'EF4444', '10B981', 'F59E0B', 
      '8B5CF6', 'F97316', 'EC4899', '06B6D4'
    ];
    
    const colorIndex = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    const color = colors[colorIndex];
    const shortText = title.substring(0, 15).replace(/\s+/g, '+');
    
    return `https://via.placeholder.com/800x200/${color}/FFFFFF?text=${encodeURIComponent(shortText)}`;
  };

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className={`text-lg font-semibold ${themeClasses.text} mb-2`}>
          שגיאה בטעינת פוסטים
        </h3>
        <p className={`${themeClasses.textSecondary} mb-4`}>{error}</p>
        <button
          onClick={handleRefresh}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
          <span>נסה שוב</span>
        </button>
      </div>
    );
  }

  if (layout === 'list') {
    // תצוגת רשימה
    return (
      <div className={`space-y-6 ${className}`}>
        {/* כותרת וכפתור רענון */}
        <div className="flex justify-between items-center">
          <h2 className={`text-xl font-bold ${themeClasses.text}`}>
            פוסטים אחרונים ({posts.length})
          </h2>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`flex items-center space-x-2 ${themeClasses.textSecondary} ${themeClasses.hover} p-2 rounded-lg transition-colors`}
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>רענן</span>
          </button>
        </div>

        {/* רשימת פוסטים */}
        {posts.length === 0 && !loading ? (
          <div className="text-center py-12">
            <MessageSquare className={`w-16 h-16 ${themeClasses.textSecondary} mx-auto mb-4`} />
            <h3 className={`text-lg font-semibold ${themeClasses.text} mb-2`}>
              אין פוסטים עדיין
            </h3>
            <p className={themeClasses.textSecondary}>
              היה הראשון ליצור פוסט!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg shadow-md overflow-hidden ${themeClasses.hover} transition-all cursor-pointer`}
              >
                {/* תמונה */}
                {post.postImage && (
                  <div className="relative h-48 w-full">
                    <img
                      src={post.postImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = generatePlaceholderImage(post.title);
                      }}
                    />
                  </div>
                )}

                <div className="p-6">
                  {/* קטגוריה */}
                  <div className="flex items-center mb-3">
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-500 text-white rounded-full">
                      {post.category}
                    </span>
                  </div>

                  {/* כותרת */}
                  <h3 className={`text-xl font-bold ${themeClasses.text} mb-3 hover:text-blue-400 transition-colors`}>
                    {post.title}
                  </h3>

                  {/* תוכן */}
                  <p className={`${themeClasses.textSecondary} mb-4 leading-relaxed`}>
                    {truncateContent(post.content)}
                  </p>

                  {/* מידע על הפוסט */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* מחבר */}
                      <div className="flex items-center space-x-2">
                        <img
                          src={post.authorAvatar}
                          alt={post.author}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className={`text-sm ${themeClasses.textSecondary}`}>
                          {post.author}
                        </span>
                      </div>

                      {/* תאריך */}
                      <div className="flex items-center space-x-1">
                        <Clock className={`w-4 h-4 ${themeClasses.textSecondary}`} />
                        <span className={`text-sm ${themeClasses.textSecondary}`}>
                          {post.time}
                        </span>
                      </div>
                    </div>

                    {/* סטטיסטיקות */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Heart className={`w-4 h-4 ${themeClasses.textSecondary}`} />
                        <span className={`text-sm ${themeClasses.textSecondary}`}>{post.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageSquare className={`w-4 h-4 ${themeClasses.textSecondary}`} />
                        <span className={`text-sm ${themeClasses.textSecondary}`}>{post.replies}</span>
                      </div>
                      {post.views !== undefined && (
                        <div className="flex items-center space-x-1">
                          <Eye className={`w-4 h-4 ${themeClasses.textSecondary}`} />
                          <span className={`text-sm ${themeClasses.textSecondary}`}>{post.views}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* כפתור טעינת עוד */}
        {hasMore && posts.length > 0 && (
          <div className="text-center pt-6">
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'טוען...' : 'טען עוד פוסטים'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // תצוגת גריד (ברירת מחדל)
  return (
    <div className={`${className}`}>
      {/* אינדיקטור טעינה */}
      {loading && posts.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={`skeleton-${index}`} className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg p-4 animate-pulse`}>
              <div className="h-32 bg-gray-600 rounded mb-4"></div>
              <div className="h-4 bg-gray-600 rounded mb-2"></div>
              <div className="h-3 bg-gray-600 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg p-6 text-center`}>
          <MessageSquare className={`w-16 h-16 ${themeClasses.textSecondary} mx-auto mb-4`} />
          <h3 className={`text-lg font-medium ${themeClasses.text} mb-2`}>
            אין פוסטים עדיין
          </h3>
          <p className={`${themeClasses.textSecondary} mb-4`}>
            היה הראשון ליצור פוסט!
          </p>
          <button
            onClick={handleRefresh}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            רענן
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
          {posts.map(post => (
            <div
              key={post.id}
              className={`${themeClasses.cardBg} ${themeClasses.border} border rounded-lg overflow-hidden ${themeClasses.hover} transition-all cursor-pointer`}
            >
              {/* תמונת פוסט */}
              <div className="relative">
                <img 
                  src={post.postImage} 
                  alt={post.title}
                  className="w-full h-32 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = generatePlaceholderImage(post.title);
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-2 left-2">
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>
              
              {/* תוכן הפוסט */}
              <div className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <img 
                    src={post.authorAvatar}
                    alt={post.author}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className={`text-sm ${themeClasses.textSecondary}`}>{post.author}</span>
                  <span className={`text-xs ${themeClasses.textSecondary}`}>•</span>
                  <span className={`text-xs ${themeClasses.textSecondary}`}>{post.time}</span>
                </div>
                
                <h3 className={`font-semibold ${themeClasses.text} mb-2 line-clamp-2`}>
                  {post.title}
                </h3>
                
                <p className={`${themeClasses.textSecondary} text-sm mb-3 line-clamp-3`}>
                  {truncateContent(post.content, 100)}
                </p>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-3 h-3 text-red-500" />
                      <span className={themeClasses.textSecondary}>{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-3 h-3 text-blue-500" />
                      <span className={themeClasses.textSecondary}>{post.replies}</span>
                    </div>
                    {post.views !== undefined && (
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3 text-green-500" />
                        <span className={themeClasses.textSecondary}>{post.views}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* כפתור טעינת עוד */}
      {hasMore && posts.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'טוען...' : 'טען עוד פוסטים'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PostsList;