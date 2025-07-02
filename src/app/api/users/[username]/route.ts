// src/app/api/users/[username]/route.ts - API לקבלת משתמש לפי שם
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username;
    
    console.log('👤 Fetching user profile:', username);
    
    // בדוק שהשם תקין
    if (!username || username.trim().length === 0) {
      return NextResponse.json(
        { error: 'שם משתמש לא תקין' },
        { status: 400 }
      );
    }
    
    // קבל פרטי משתמש עם מספר הפוסטים
    const userResult = await db.query(`
      SELECT 
        u.id,
        u.username,
        u.email,
        u.avatar,
        u.role,
        u.created_at,
        u.updated_at,
        COUNT(p.id) as posts_count
      FROM users u
      LEFT JOIN posts p ON u.id = p.author_id
      WHERE LOWER(u.username) = LOWER($1)
      GROUP BY u.id, u.username, u.email, u.avatar, u.role, u.created_at, u.updated_at
    `, [username.trim()]);
    
    if (userResult.rows.length === 0) {
      console.log('❌ User not found:', username);
      return NextResponse.json(
        { error: 'משתמש לא נמצא' },
        { status: 404 }
      );
    }
    
    const user = userResult.rows[0];
    
    // פורמט התגובה
    const userProfile = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
      posts_count: parseInt(user.posts_count) || 0
    };
    
    console.log('✅ User found:', user.username, 'with', userProfile.posts_count, 'posts');
    
    return NextResponse.json({
      user: userProfile,
      success: true
    });
    
  } catch (error: any) {
    console.error('❌ Error fetching user:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת המשתמש: ' + error.message },
      { status: 500 }
    );
  }
}