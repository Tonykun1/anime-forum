// src/app/api/auth/me/route.ts - בדיקת משתמש מחובר
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'לא מחובר' },
        { status: 401 }
      );
    }
    
    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: 'טוקן לא תקין' },
        { status: 401 }
      );
    }
    
    // Get fresh user data from database
    const result = await db.query(
      'SELECT id, username, email, avatar, role, created_at FROM users WHERE id = $1',
      [decoded.id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'משתמש לא נמצא' },
        { status: 404 }
      );
    }
    
    const user = result.rows[0];
    
    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        joinDate: user.created_at,
        postsCount: 0,
        likesCount: 0
      }
    });
    
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'שגיאה בקבלת נתוני משתמש' },
      { status: 500 }
    );
  }
}