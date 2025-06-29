// src/app/hooks/useForumPosts.ts - עם טיפוסים מתוקנים
import { useState, useEffect, useCallback } from 'react';
import { ForumPostData, ApiPost } from '../types/ForumPost';

export const useForumPosts = () => {
  const [posts, setPosts] = useState<ForumPostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert API post to ForumPostData format
  const convertApiPost = (apiPost: ApiPost): ForumPostData => {
    return {
      id: apiPost.id,
      title: apiPost.title,
      content: apiPost.content,
      author: apiPost.author.username,
      authorId: 1, // Default author ID
      replies: apiPost.comments_count,
      likes: apiPost.likes_count,
      time: formatTime(apiPost.created_at),
      avatar: `https://via.placeholder.com/50x50/6366F1/FFFFFF?text=${apiPost.author.username.charAt(0)}`,
      postImage: apiPost.image_url || `https://via.placeholder.com/800x200/${apiPost.category.color.substring(1)}/FFFFFF?text=${encodeURIComponent(apiPost.category.name)}`,
      category: apiPost.category.name
    };
  };

  // Format time helper
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'לפני כמה דקות';
    if (diffInHours < 24) return `לפני ${diffInHours} שעות`;
    if (diffInHours < 48) return 'אתמול';
    return date.toLocaleDateString('he-IL');
  };

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching posts from API...');
      
      const response = await fetch('/api/posts', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📊 API Response:', data);
      
      if (data.posts && Array.isArray(data.posts)) {
        const convertedPosts: ForumPostData[] = data.posts.map((apiPost: ApiPost) => convertApiPost(apiPost));
        console.log('✅ Converted posts:', convertedPosts.map((p: ForumPostData) => ({ id: p.id, title: p.title })));
        setPosts(convertedPosts);
      } else {
        console.warn('No posts found in response:', data);
        setPosts([]);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err instanceof Error ? err.message : 'שגיאה בטעינת פוסטים');
      
      // Set default posts as fallback
      setPosts([
        {
          id: 'default-1',
          title: "ברוכים הבאים לפורום!",
          content: "זהו פוסט ברירת מחדל. יתכן שהשרת עדיין מתחיל או שיש בעיה בחיבור לבסיס הנתונים.",
          author: "מערכת",
          authorId: 1,
          replies: 0,
          likes: 0,
          time: "עכשיו",
          avatar: "https://via.placeholder.com/50x50/6366F1/FFFFFF?text=S",
          postImage: "https://via.placeholder.com/800x200/6366F1/FFFFFF?text=Welcome",
          category: "הכרזות"
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addPost = useCallback((newPost: ForumPostData) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  }, []);

  const updatePost = useCallback((postId: string, updates: Partial<ForumPostData>) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId ? { ...post, ...updates } : post
      )
    );
  }, []);

  const deletePost = useCallback((postId: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    addPost,
    updatePost,
    deletePost,
    refetch: fetchPosts
  };
};