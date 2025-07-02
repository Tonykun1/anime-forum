// src/app/api/auth/logout/route.ts - יציאה מהמערכת
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Clear the auth cookie
    const response = NextResponse.json({
      message: 'התנתקת בהצלחה'
    });
    
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // Expire immediately
    });
    
    return response;
    
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'שגיאה ביציאה' },
      { status: 500 }
    );
  }
}