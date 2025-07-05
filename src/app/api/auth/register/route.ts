// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { registerUser, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, avatar } = await request.json();
    
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'שם משתמש, אימייל וסיסמה נדרשים' },
        { status: 400 }
      );
    }

    const result = await registerUser(username, email, password, avatar);
    
    if (result.success && result.user) {
      const token = generateToken(result.user);
      
      const response = NextResponse.json({
        success: true,
        user: result.user,
        message: 'הרישום הצליח!'
      });

      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      });

      return response;
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Register API error:', error);
    return NextResponse.json(
      { success: false, error: 'שגיאה ברישום' },
      { status: 500 }
    );
  }
}
