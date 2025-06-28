// app/api/auth/logout/route.ts - Logout endpoint
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      message: 'התנתקות בוצעה בהצלחה'
    });
    
    // Clear auth cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    });
    
    return response;
    
  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { error: 'שגיאה בהתנתקות' },
      { status: 500 }
    );
  }
}