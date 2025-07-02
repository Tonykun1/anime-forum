// src/app/hooks/useForumPosts.ts
import { useState, useEffect } from 'react';

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

interface UseForumPostsReturn {
  posts: ForumPostData[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useForumPosts(): UseForumPostsReturn {
  const [posts, setPosts] = useState<ForumPostData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/posts');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.posts) {
        setPosts(data.posts);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      console.error('Error fetching posts:', err);
      setError(err.message || 'שגיאה בטעינת הפוסטים');
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    error,
    refetch
  };
}