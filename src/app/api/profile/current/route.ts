// app/api/profile/current/route.ts - קבלת פרטי המשתמש הנוכחי
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Getting current user profile');
    
    // בדיקת אימות
    const user = await verifyToken(request);
    if (!user) {
      console.log('❌ No authenticated user');
      return NextResponse.json(
        { success: false, error: 'נדרש אימות' },
        { status: 401 }
      );
    }

    console.log('🔍 Fetching user data for ID:', user.id);

    // קבלת פרטי המשתמש מהDB
    const result = await db.query(`
      SELECT 
        id,
        username,
        email,
        bio,
        avatar,
        cover_image,
        role,
        posts_count,
        likes_count,
        created_at,
        updated_at
      FROM users 
      WHERE id = $1
    `, [user.id]);

    if (result.rows.length === 0) {
      console.log('❌ User not found in database');
      return NextResponse.json(
        { success: false, error: 'משתמש לא נמצא' },
        { status: 404 }
      );
    }

    const userProfile = result.rows[0];
    console.log('✅ User profile found:', {
      username: userProfile.username,
      cover_image: userProfile.cover_image ? 'יש תמונת רקע' : 'אין תמונת רקע'
    });

    return NextResponse.json({
      success: true,
      user: {
        id: userProfile.id,
        username: userProfile.username,
        email: userProfile.email,
        bio: userProfile.bio,
        avatar: userProfile.avatar,
        cover_image: userProfile.cover_image, // זה החשוב!
        role: userProfile.role,
        posts_count: userProfile.posts_count || 0,
        likes_count: userProfile.likes_count || 0,
        created_at: userProfile.created_at,
        updated_at: userProfile.updated_at
      }
    });

  } catch (error: any) {
    console.error('❌ Error fetching current user profile:', error);
    return NextResponse.json(
      { success: false, error: 'שגיאה בקבלת פרטי המשתמש: ' + error.message },
      { status: 500 }
    );
  }
}