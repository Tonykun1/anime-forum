// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { loginUser, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'אימייל וסיסמה נדרשים' },
        { status: 400 }
      );
    }
    
    const result = await loginUser(email, password);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
    
    // Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      message: 'התחברות בוצעה בהצלחה',
      user: result.user
    });
    
    response.cookies.set('auth-token', result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });
    
    return response;
    
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, error: 'שגיאה בהתחברות' },
      { status: 500 }
    );
  }
}

