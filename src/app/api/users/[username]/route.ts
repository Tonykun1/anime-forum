// src/app/api/users/[username]/route.ts - מעודכן למסד הנתונים שלך
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    
    console.log('API: Fetching profile for:', username);
    
    // שליפת המשתמש מהמסד נתונים שלך
    const userQuery = `
      SELECT 
        id,
        username,
        email,
        avatar,
        role,
        created_at
      FROM users 
      WHERE username = $1
    `;
    
    const result = await db.query(userQuery, [username]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'משתמש לא נמצא' },
        { status: 404 }
      );
    }
    
    const user = result.rows[0];
    
    // ספירת פוסטים של המשתמש מהטבלה שלך
    const postsCountQuery = `
      SELECT COUNT(*) as posts_count 
      FROM posts 
      WHERE author_id = $1
    `;
    const postsCountResult = await db.query(postsCountQuery, [user.id]);
    const postsCount = parseInt(postsCountResult.rows[0].posts_count) || 0;
    
    // חישוב סך הלייקים שקיבל המשתמש מכל הפוסטים שלו
    const likesQuery = `
      SELECT COALESCE(SUM(likes_count), 0) as total_likes 
      FROM posts 
      WHERE author_id = $1
    `;
    const likesResult = await db.query(likesQuery, [user.id]);
    const totalLikes = parseInt(likesResult.rows[0].total_likes) || 0;
    
    // פורמט התאריך
    const joinDate = new Date(user.created_at).toLocaleDateString('he-IL');
    
    // יצירת אובייקט המשתמש
    const userProfile = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar || `https://via.placeholder.com/150x150/3B82F6/FFFFFF?text=${user.username.substring(0, 2).toUpperCase()}`,
      coverImage: `https://via.placeholder.com/800x200/6366F1/FFFFFF?text=${user.username}`,
      bio: `היי, אני ${user.username} - חובב אנימה`,
      joinDate: joinDate,
      postsCount: postsCount,
      likesCount: totalLikes,
      role: user.role || 'user',
      location: 'ישראל',
      website: null,
      isOwnProfile: false // יוגדר בצד הלקוח
    };

    console.log('Profile data:', {
      username: user.username,
      postsCount,
      totalLikes,
      joinDate
    });

    return NextResponse.json({
      user: userProfile
    });
    
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת פרופיל המשתמש: ' + error.message },
      { status: 500 }
    );
  }
}