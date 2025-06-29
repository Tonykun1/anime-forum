// src/app/Components/ForumPostsFromServer.tsx
'use client';

import React, { useState, useEffect } from 'react';
import ForumPost from './ForumPost';

interface ForumPostData {
  id: number;
  title: string;
  content: string;
  author: string;
  authorId: number;
  replies: number;
  likes: number;
  time: string;
  avatar: string;
  postImage: string;
  category: string;
}

interface ServerPost {
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

interface ForumPostsFromServerProps {
  expandedPosts: { [key: number]: boolean };
  togglePostExpansion: (postId: number) => void;
  themeClasses: any;
  limit?: number;
  showAll?: boolean;
}

const ForumPostsFromServer: React.FC<ForumPostsFromServerProps> = ({
  expandedPosts,
  togglePostExpansion,
  themeClasses,
  limit = 6,
  showAll = false
}) => {
  const [posts, setPosts] = useState<ForumPostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (!showAll) {
        params.set('limit', limit.toString());
      }
      
      const response = await fetch(`/api/posts?${params}`);
      
      if (!response.ok) {
        throw new Error('שגיאה בטעינת פוסטים');
      }
      
      const data = await response.json();
      
      // המרה מהפורמט של השרת לפורמט הקיים
      const convertedPosts: ForumPostData[] = (data.posts || []).map((post: ServerPost, index: number) => ({
        id: parseInt(post.id) || index + 1,
        title: post.title,
        content: post.content,
        author: post.author.username,
        authorId: parseInt(post.author.id || '1'),
        replies: post.comments_count || 0,
        likes: post.likes_count || 0,
        time: formatTime(post.created_at),
        avatar: post.author.avatar || generateAvatar(post.author.username),
        postImage: post.image_url || generatePlaceholderImage(post.category.name, post.category.color),
        category: post.category.name
      }));
      
      setPosts(convertedPosts);
      setError(null);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err instanceof Error ? err.message : 'שגיאה בטעינת פוסטים');
      
      // במקרה של שגיאה, נציג פוסטים לדוגמה
      setPosts(getFallbackPosts());
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string): string => {
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

  const generateAvatar = (username: string): string => {
    const colors = ['3B82F6', 'EF4444', '8B5CF6', 'F59E0B', '10B981', 'EC4899'];
    const colorIndex = username.length % colors.length;
    const initials = username.slice(0, 2).toUpperCase();
    return `https://via.placeholder.com/50x50/${colors[colorIndex]}/FFFFFF?text=${initials}`;
  };

  const generatePlaceholderImage = (category: string, color: string): string => {
    const cleanColor = color.replace('#', '');
    const categoryText = encodeURIComponent(category);
    return `https://via.placeholder.com/800x200/${cleanColor}/FFFFFF?text=${categoryText}`;
  };

  const getFallbackPosts = (): ForumPostData[] => [
    {
      id: 1,
      title: "ברוכים הבאים לפורום!",
      content: "זהו פוסט ברירת מחדל. נסה ליצור פוסטים חדשים או לבדוק את החיבור לשרת.",
      author: "מנהל",
      authorId: 1,
      replies: 0,
      likes: 0,
      time: "עכשיו",
      avatar: "https://via.placeholder.com/50x50/3B82F6/FFFFFF?text=M",
      postImage: "https://via.placeholder.com/800x200/3B82F6/FFFFFF?text=Welcome",
      category: "כללי"
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
        {Array.from({ length: limit }).map((_, index) => (
          <div
            key={index}
            className={`${themeClasses.cardBg} rounded-lg shadow-md ${themeClasses.border} border overflow-hidden animate-pulse`}
          >
            <div className="h-32 bg-gray-300 dark:bg-gray-600"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className={`${themeClasses.cardBg} rounded-lg p-6 text-center ${themeClasses.border} border`}>
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className={`text-lg font-semibold ${themeClasses.text} mb-2`}>
          שגיאה בטעינת פוסטים
        </h3>
        <p className={`${themeClasses.textSecondary} mb-4`}>{error}</p>
        <button
          onClick={fetchPosts}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          נסה שוב
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
      {posts.map(post => (
        <ForumPost 
          key={post.id} 
          post={post} 
          expandedPosts={expandedPosts} 
          togglePostExpansion={togglePostExpansion}
          themeClasses={themeClasses}
        />
      ))}
      
      {/* הודעה אם אין פוסטים */}
      {posts.length === 0 && !loading && (
        <div className={`col-span-full ${themeClasses.cardBg} rounded-lg p-8 text-center ${themeClasses.border} border`}>
          <div className={`${themeClasses.textSecondary} mb-4`}>
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className={`text-lg font-semibold ${themeClasses.text} mb-2`}>
            אין פוסטים עדיין
          </h3>
          <p className={`${themeClasses.textSecondary}`}>
            היה הראשון ליצור פוסט בפורום!
          </p>
        </div>
      )}
    </div>
  );
};

export default ForumPostsFromServer;