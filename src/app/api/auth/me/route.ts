// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getUserById } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'לא מאומת' },
        { status: 401 }
      );
    }

    // קבל נתונים מעודכנים מהDB
    const fullUser = await getUserById(user.id);
    if (!fullUser) {
      return NextResponse.json(
        { success: false, error: 'משתמש לא נמצא' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: fullUser
    });

  } catch (error: any) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { success: false, error: 'שגיאה בקבלת נתוני משתמש' },
      { status: 500 }
    );
  }
}
