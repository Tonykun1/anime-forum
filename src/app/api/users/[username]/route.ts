// src/app/api/users/[username]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    
    console.log('Fetching profile for user:', username);
    
    // פשוט החזר משתמש סטטי לבדיקה
    if (username === 'tonykun') {
      return NextResponse.json({
        user: {
          id: 1,
          username: 'tonykun',
          email: 'tony@example.com',
          avatar: 'https://via.placeholder.com/150x150/3B82F6/FFFFFF?text=TK',
          coverImage: 'https://via.placeholder.com/800x200/6366F1/FFFFFF?text=TonyKun',
          bio: 'מנהל הפורום הראשי',
          joinDate: '2024-01-01',
          postsCount: 25,
          likesCount: 150,
          role: 'admin',
          location: 'ישראל',
          website: 'https://animeforum.com',
          isOwnProfile: true
        }
      });
    }
    
    // עבור משתמשים אחרים
    return NextResponse.json({
      user: {
        id: 2,
        username: username,
        email: `${username}@example.com`,
        avatar: `https://via.placeholder.com/150x150/EF4444/FFFFFF?text=${username.substring(0, 2).toUpperCase()}`,
        coverImage: 'https://via.placeholder.com/800x200/DC2626/FFFFFF?text=Cover',
        bio: `היי, אני ${username}`,
        joinDate: '2024-01-15',
        postsCount: 5,
        likesCount: 20,
        role: 'user',
        location: null,
        website: null,
        isOwnProfile: false
      }
    });
    
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת פרופיל המשתמש' },
      { status: 500 }
    );
  }
}