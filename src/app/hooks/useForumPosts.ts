// src/app/hooks/useForumPosts.ts
import { useState, useEffect } from 'react';
import { ForumPostData } from '../types';

interface UseForumPostsReturn {
  posts: ForumPostData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useForumPosts = (): UseForumPostsReturn => {
  const [posts, setPosts] = useState<ForumPostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/posts', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('שגיאה בטעינת הפוסטים');
      }

      const data = await response.json();
      
      // המרה מהפורמט של הAPI לפורמט של הForumPostData
      const formattedPosts: ForumPostData[] = data.posts.map((post: any) => ({
        id: post.id.toString(),
        title: post.title,
        content: post.content,
        author: post.author?.username || 'משתמש',
        authorId: 1, // זמני
        replies: post.comments_count || 0,
        likes: post.likes_count || 0,
        time: formatTimeAgo(post.created_at),
        avatar: post.author?.avatar || 'https://via.placeholder.com/50x50/6366F1/FFFFFF?text=U',
        postImage: post.image_url || generateRandomImage(post.category?.name || 'כללי'),
        category: post.category?.name || 'כללי'
      }));

      setPosts(formattedPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err instanceof Error ? err.message : 'שגיאה לא ידועה');
      
      // נתונים לדוגמה במקרה של שגיאה
      setPosts([
        {
          id: '1',
          title: "ברוכים הבאים לפורום!",
          content: "זהו פוסט לדוגמה. הפורום כעת עובד עם שרת אמיתי!",
          author: "Admin",
          authorId: 1,
          replies: 5,
          likes: 12,
          time: "לפני שעה",
          avatar: "https://via.placeholder.com/50x50/3B82F6/FFFFFF?text=A",
          postImage: "https://via.placeholder.com/800x200/3B82F6/FFFFFF?text=Welcome",
          category: "הודעות"
        },
        {
          id: '2',
          title: "מה האנימה הכי טובה השנה?",
          content: "רוצה לשמוע מה הדעות שלכם על האנימות החמות השנה. יש לי כמה המלצות אבל מעוניין לשמוע גם מכם!",
          author: "AnimeOtaku",
          authorId: 2,
          replies: 23,
          likes: 45,
          time: "לפני 3 שעות",
          avatar: "https://via.placeholder.com/50x50/EF4444/FFFFFF?text=AO",
          postImage: "https://via.placeholder.com/800x200/EF4444/FFFFFF?text=Best+Anime",
          category: "דיונים"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, loading, error, refetch };
};

// פונקציות עזר
function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'עכשיו';
    if (diffInMinutes < 60) return `לפני ${diffInMinutes} דקות`;
    if (diffInMinutes < 1440) return `לפני ${Math.floor(diffInMinutes / 60)} שעות`;
    return `לפני ${Math.floor(diffInMinutes / 1440)} ימים`;
  } catch {
    return 'עכשיו';
  }
}

function generateRandomImage(category: string): string {
  const colors = ['3B82F6', 'EF4444', '8B5CF6', '10B981', 'F59E0B', 'EC4899'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const encodedCategory = encodeURIComponent(category);
  return `https://via.placeholder.com/800x200/${randomColor}/FFFFFF?text=${encodedCategory}`;
}