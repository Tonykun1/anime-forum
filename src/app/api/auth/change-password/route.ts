// app/api/auth/change-password/route.ts - תיקון שינוי סיסמה
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, changePassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'נדרש אימות' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await request.json();
    
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'נדרשת סיסמה נוכחית וחדשה' },
        { status: 400 }
      );
    }
    
    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'הסיסמה חייבת להיות באורך של לפחות 6 תווים' },
        { status: 400 }
      );
    }
    
    const result = await changePassword(user.id, currentPassword, newPassword);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'הסיסמה שונתה בהצלחה!'
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
    
  } catch (error: any) {
    console.error('Password change API error:', error);
    return NextResponse.json(
      { success: false, error: 'שגיאה בשינוי הסיסמה: ' + error.message },
      { status: 500 }
    );
  }
}