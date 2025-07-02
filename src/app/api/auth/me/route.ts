// src/app/api/auth/me/route.ts - Auth endpoint עם PostgreSQL
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';

export async function GET(request: NextRequest) {
  try {
    // כרגע נחזיר משתמש ברירת מחדל
    // בעתיד נוכל להוסיף אימות אמיתי
    
    // נסה לקבל משתמש ברירת מחדל מהמסד
    const result = await db.query(
      'SELECT id, username, email, avatar, role FROM users WHERE email = $1',
      ['user@example.com']
    );

    let user;
    if (result.rows.length > 0) {
      user = result.rows[0];
    } else {
      // אם אין משתמש, צור אחד
      const newUserResult = await db.query(
        'INSERT INTO users (username, email, role) VALUES ($1, $2, $3) RETURNING id, username, email, avatar, role',
        ['משתמש', 'user@example.com', 'user']
      );
      user = newUserResult.rows[0];
    }

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      }
    });

  } catch (error: any) {
    console.error('Error in auth/me:', error);
    
    // אם יש בעיה עם המסד, החזר משתמש ברירת מחדל
    return NextResponse.json({
      user: {
        id: 1,
        username: 'משתמש',
        email: 'user@example.com',
        role: 'user',
        avatar: null
      }
    });
  }
}