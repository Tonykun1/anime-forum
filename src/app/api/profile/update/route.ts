// 3. תקן את app/api/profile/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, updateUserProfile, getUserById } from '@/lib/auth';
import path from 'path';
import fs from 'fs/promises';

export async function PUT(request: NextRequest) {
  try {
    console.log('Profile update API called');
    
    // בדיקת אימות
    const user = await verifyToken(request);
    if (!user) {
      console.log('Authentication failed');
      return NextResponse.json(
        { success: false, error: 'נדרש אימות' },
        { status: 401 }
      );
    }

    console.log('Updating profile for user:', user.id);

    // קבל FormData
    const formData = await request.formData();
    console.log('FormData received');

    // חלץ נתונים מהטופס
    const username = formData.get('username') as string;
    const bio = formData.get('bio') as string;
    const avatarUrl = formData.get('avatar_url') as string;
    const coverUrl = formData.get('cover_url') as string;

    console.log('Form data:', { username, bio, avatarUrl, coverUrl });

    // הכן נתוני עדכון
    const updateData: any = {};
    
    if (username && username.trim()) {
      updateData.username = username.trim();
    }
    
    if (bio !== null && bio !== undefined) {
      updateData.bio = bio.trim();
    }
    
    if (avatarUrl && avatarUrl.trim()) {
      updateData.avatar = avatarUrl.trim();
    }
    
    if (coverUrl && coverUrl.trim()) {
      updateData.cover_image = coverUrl.trim();
    }
    
    console.log('Update data prepared:', updateData);
    
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: 'אין נתונים לעדכון' },
        { status: 400 }
      );
    }
    
    // עדכן ב-PostgreSQL האמיתי
    const result = await updateUserProfile(user.id, updateData);
    console.log('Database update result:', result);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'שגיאה בעדכון הפרופיל' },
        { status: 400 }
      );
    }
    
    // קבל את הנתונים המלאים מהDB
    const updatedUser = await getUserById(user.id);
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'משתמש לא נמצא' },
        { status: 404 }
      );
    }
    
    console.log('Profile updated successfully in PostgreSQL:', updatedUser);
    
    return NextResponse.json({
      success: true,
      message: 'הפרופיל עודכן בהצלחה ונשמר במסד הנתונים!',
      user: updatedUser
    });
    
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { success: false, error: 'שגיאה בעדכון הפרופיל: ' + error.message },
      { status: 500 }
    );
  }
}