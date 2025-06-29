// src/app/api/auth/logout/route.ts - קובץ נפרד להתנתקות
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({
      message: 'התנתקות בוצעה בהצלחה',
      success: true
    });
    
    // מחק cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    });
    
    return response;
    
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'שגיאה בהתנתקות' },
      { status: 500 }
    );
  }
}