// src/components/PostsList.tsx - קומפוננט להצגת פוסטים מהשרת
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Eye, 
  Clock, 
  User,
  Image as ImageIcon,
  AlertCircle,
  RefreshCcw
} from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  views_count: number;
  created_at: string;
  updated_at: string;
  author: {
    id?: string;
    username: string;
    avatar?: string;
  };
  category: {
    id?: string;
    name: string;
    color: string;
  };
}

interface PostsListProps {
  className?: string;
  limit?: number;
  category?: string;
  search?: string;
}

const PostsList: React.FC<PostsListProps> = ({ 
  className = "", 
  limit = 10,
  category,
  search 
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [page, category, search]);

  const fetchPosts = async (reset = false) => {
    try {
      setLoading(true);
      
      // בניית URL עם פרמטרים
      const params = new URLSearchParams();
      params.set('page', reset ? '1' : page.toString());
      params.set('limit', limit.toString());
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      
      const response = await fetch(`/api/posts?${params}`);
      
      if (!response.ok) {
        throw new Error('שגיאה בטעינת פוסטים');
      }
      
      const data = await response.json();
      
      if (reset || page === 1) {
        setPosts(data.posts || []);
      } else {
        setPosts(prev => [...prev, ...(data.posts || [])]);
      }
      
      // בדיקה אם יש עוד עמודים
      if (data.pagination) {
        setHasMore(data.pagination.hasNextPage);
      } else {
        setHasMore(false);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching posts:', err);
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
      setPage(prev => prev + 1);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'עכשיו';
    if (diffMins < 60) return `לפני ${diffMins} דקות`;
    if (diffHours < 24) return `לפני ${diffHours} שעות`;
    if (diffDays < 7) return `לפני ${diffDays} ימים`;
    
    return date.toLocaleDateString('he-IL');
  };

  const truncateContent = (content: string, maxLength = 200) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          שגיאה בטעינת פוסטים
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
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

  return (
    <div className={`space-y-6 ${className}`}>
      {/* כפתור רענון */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          פוסטים אחרונים
        </h2>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>רענן</span>
        </button>
      </div>

      {/* רשימת פוסטים */}
      {posts.length === 0 && !loading ? (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            אין פוסטים עדיין
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            היה הראשון ליצור פוסט!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* תמונה */}
              {post.image_url && (
                <div className="relative h-48 w-full">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="p-6">
                {/* קטגוריה */}
                <div className="flex items-center mb-3">
                  <span
                    className="inline-block px-3 py-1 text-xs font-semibold text-white rounded-full"
                    style={{ backgroundColor: post.category.color }}
                  >
                    {post.category.name}
                  </span>
                </div>

                {/* כותרת */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  {post.title}
                </h3>

                {/* תוכן */}
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  {truncateContent(post.content)}
                </p>

                {/* מידע על הפוסט */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* מחבר */}
                    <div className="flex items-center space-x-2">
                      {post.author.avatar ? (
                        <img
                          src={post.author.avatar}
                          alt={post.author.username}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <User className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                        </div>
                      )}
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {post.author.username}
                      </span>
                    </div>

                    {/* תאריך */}
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        {formatDate(post.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* סטטיסטיקות */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{post.likes_count}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{post.comments_count}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{post.views_count}</span>
                    </div>
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

      {/* אינדיקטור טעינה */}
      {loading && posts.length === 0 && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">טוען פוסטים...</span>
        </div>
      )}
    </div>
  );
};

export default PostsList;