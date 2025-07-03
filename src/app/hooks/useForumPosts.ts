// src/app/hooks/useForumPosts.ts
import { useState, useEffect } from 'react';
import { ForumPostData, ApiPost, convertApiPostToForumPost } from '../types';

export function useForumPosts() {
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
      
      if (data.posts && Array.isArray(data.posts)) {
        const convertedPosts = data.posts.map((apiPost: ApiPost) => 
          convertApiPostToForumPost(apiPost)
        );
        setPosts(convertedPosts);
      } else {
        // אם אין פוסטים מהשרת, נשתמש בפוסטים של דוגמה
        setPosts(getDefaultPosts());
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err instanceof Error ? err.message : 'שגיאה בטעינת הפוסטים');
      // במקרה של שגיאה, נשתמש בפוסטים של דוגמה
      setPosts(getDefaultPosts());
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

  return {
    posts,
    loading,
    error,
    refetch
  };
}

// פוסטים של דוגמה למקרה שהשרת לא עובד
function getDefaultPosts(): ForumPostData[] {
  return [
    {
      id: 'demo-1',
      title: "מה אתם חושבים על הסיום של Attack on Titan?",
      content: "אחרי שצפיתי בפרק האחרון, אני חייב לשאול מה הדעה שלכם על הסיום. האם זה היה מספק? יש לי הרבה מחשבות על הבחירות של אירן ועל הדרך שבה הסדרה בחרה לסיים את הסיפור.",
      author: "AnimeOtaku",
      authorId: 1,
      replies: 45,
      likes: 23,
      time: "לפני 2 שעות",
      avatar: "https://via.placeholder.com/50x50/3B82F6/FFFFFF?text=AO",
      postImage: "https://via.placeholder.com/800x200/3B82F6/FFFFFF?text=Attack+on+Titan",
      category: "דיונים"
    },
    {
      id: 'demo-2',
      title: "המלצות על אנימה עם קרבות מדהימים",
      content: "אני מחפש אנימות עם קרבות שפשוט מפילים מהכיסא. משהו ברמה של Demon Slayer או Jujutsu Kaisen. יש לכם המלצות?",
      author: "ActionFan",
      authorId: 2,
      replies: 78,
      likes: 56,
      time: "לפני 5 שעות",
      avatar: "https://via.placeholder.com/50x50/EF4444/FFFFFF?text=AF",
      postImage: "https://via.placeholder.com/800x200/EF4444/FFFFFF?text=Epic+Battles",
      category: "המלצות"
    },
    {
      id: 'demo-3',
      title: "Demon Slayer Season 4 - תאריך יציאה?",
      content: "מישהו יודע מתי בדיוק צפוי לצאת עונה 4 של Demon Slayer? ראיתי הרבה שמועות אבל אין לי אישור רשמי.",
      author: "DemonSlayerFan",
      authorId: 3,
      replies: 34,
      likes: 42,
      time: "לפני 8 שעות",
      avatar: "https://via.placeholder.com/50x50/F59E0B/FFFFFF?text=DS",
      postImage: "https://via.placeholder.com/800x200/F59E0B/FFFFFF?text=Demon+Slayer",
      category: "חדשות"
    }
  ];
}