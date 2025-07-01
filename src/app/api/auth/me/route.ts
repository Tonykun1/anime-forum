// app/api/auth/me/route.ts - Check authenticated user
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { connectDB } from '@/lib/db/connection';
import { User } from '@/lib/db/models/User';

export async function GET(request: NextRequest) {
  try {
    const sessionUser = await verifyToken(request);
    
    if (!sessionUser) {
      return NextResponse.json(
        { error: 'לא מחובר' },
        { status: 401 }
      );
    }

    await connectDB();
    const user = await User.findById(sessionUser.id).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { error: 'משתמש לא נמצא' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        coverImage: user.coverImage,
        bio: user.bio,
        role: user.role,
        postsCount: user.postsCount,
        likesCount: user.likesCount,
        createdAt: user.createdAt
      }
    });
    
  } catch (error) {
    console.error('Auth me API error:', error);
    return NextResponse.json(
      { error: 'שגיאה בבדיקת האימות' },
      { status: 500 }
    );
  }
}