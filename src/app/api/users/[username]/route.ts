// src/app/api/users/[username]/route.ts - API לקבלת פרופיל משתמש
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Helper function to get current user from JWT
async function getCurrentUser(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return null;
    
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    const currentUser = await getCurrentUser(request);
    
    console.log('🔍 Fetching profile for username:', username);
    
    // Get user profile
    const userResult = await db.query(`
      SELECT 
        id, username, email, avatar, role, created_at,
        (SELECT COUNT(*) FROM posts WHERE author_id = users.id) as posts_count,
        0 as likes_count
      FROM users 
      WHERE username = $1
    `, [username]);
    
    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'משתמש לא נמצא' },
        { status: 404 }
      );
    }
    
    const user = userResult.rows[0];
    
    // Check if this is the current user's own profile
    const isOwnProfile = currentUser && currentUser.id === user.id;
    
    const userProfile = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      coverImage: `https://via.placeholder.com/800x200/4F46E5/FFFFFF?text=${user.username}`,
      bio: 'משתמש חדש בקהילה!',
      joinDate: user.created_at,
      postsCount: parseInt(user.posts_count),
      likesCount: user.likes_count,
      role: user.role,
      isOwnProfile
    };
    
    console.log('✅ User profile found:', userProfile);
    
    return NextResponse.json({ user: userProfile });
    
  } catch (error: any) {
    console.error('❌ Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת הפרופיל' },
      { status: 500 }
    );
  }
}