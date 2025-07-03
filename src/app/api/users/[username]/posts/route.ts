// src/app/api/users/[username]/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    
    // פוסטים לדוגמה עבור tonykun
    if (username === 'tonykun') {
      return NextResponse.json({
        posts: [
          {
            id: 1,
            title: "ברוכים הבאים לפורום האנימה החדש!",
            content: "היי לכולם! אני מתרגש להכריז על פתיחת הפורום החדש שלנו. כאן תוכלו לדון על כל האנימות החמות, לשתף המלצות ולהכיר חברים חדשים עם תחומי עניין דומים.",
            image_url: "https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Welcome+Post",
            likes_count: 45,
            comments_count: 12,
            created_at: "2024-01-01T10:00:00Z",
            category: {
              name: "הודעות",
              color: "#3B82F6"
            }
          },
          {
            id: 2,
            title: "מה אתם חושבים על Demon Slayer Season 4?",
            content: "הפרק החדש שיצא השבוע היה פשוט מדהים! האנימציה של ufotable ממשיכה לא להפסיק להדהים. מה הרגשות שלכם מהעונה החדשה?",
            image_url: "https://via.placeholder.com/800x400/EF4444/FFFFFF?text=Demon+Slayer",
            likes_count: 67,
            comments_count: 23,
            created_at: "2024-01-15T14:30:00Z",
            category: {
              name: "דיונים",
              color: "#EF4444"
            }
          },
          {
            id: 3,
            title: "רשימת ההמלצות שלי לחורף 2024",
            content: "הכנתי רשימה של האנימות הכי מבטיחות לעונת החורף. יש כאן משהו לכל אחד - מאקשן מטורף ועד רומנטיקה מתוקה.",
            image_url: "https://via.placeholder.com/800x400/8B5CF6/FFFFFF?text=Winter+2024+Anime",
            likes_count: 89,
            comments_count: 34,
            created_at: "2024-01-20T16:45:00Z",
            category: {
              name: "המלצות",
              color: "#8B5CF6"
            }
          }
        ]
      });
    }
    
    // עבור משתמשים אחרים - פוסטים ריקים או מועטים
    return NextResponse.json({
      posts: []
    });
    
  } catch (error: any) {
    console.error('Error fetching user posts:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת פוסטים' },
      { status: 500 }
    );
  }
}