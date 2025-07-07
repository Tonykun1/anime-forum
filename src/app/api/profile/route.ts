// src/app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const username = searchParams.get('username');

    if (!userId && !username) {
      return NextResponse.json(
        { error: 'מזהה משתמש או שם משתמש חסר' },
        { status: 400 }
      );
    }

    let query = `
      SELECT 
        u.id, 
        u.username, 
        u.email, 
        u.bio, 
        u.avatar, 
        u.cover_image, 
        u.role, 
        u.created_at, 
        u.updated_at,
        COUNT(DISTINCT p.id) as posts_count,
        COUNT(DISTINCT pl.id) as likes_count
      FROM users u
      LEFT JOIN posts p ON u.id = p.author_id
      LEFT JOIN post_likes pl ON u.id = pl.user_id
      WHERE u.is_active = true
    `;
    
    let params = [];
    
    if (userId) {
      query += ' AND u.id = $1';
      params = [userId];
    } else {
      query += ' AND u.username = $1';
      params = [username];
    }
    
    query += ' GROUP BY u.id, u.username, u.email, u.bio, u.avatar, u.cover_image, u.role, u.created_at, u.updated_at';

    const result = await db.query(query, params);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'משתמש לא נמצא' },
        { status: 404 }
      );
    }

    const user = result.rows[0];

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        coverImage: user.cover_image,
        role: user.role,
        joinDate: user.created_at,
        postsCount: parseInt(user.posts_count) || 0,
        likesCount: parseInt(user.likes_count) || 0,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    });

  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'שגיאה בקבלת פרטי המשתמש: ' + error.message },
      { status: 500 }
    );
  }
}