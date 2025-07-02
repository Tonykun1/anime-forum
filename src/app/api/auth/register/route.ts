// app/api/auth/login/route.ts - Login endpoint with PostgreSQL
import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'אימייל וסיסמה נדרשים' },
        { status: 400 }
      );
    }
    
    // Attempt login
    const result = await loginUser(email, password);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }
    
    // Create response with user data
    const response = NextResponse.json({
      message: 'התחברת בהצלחה!',
      user: {
        id: result.user!.id,
        username: result.user!.username,
        email: result.user!.email,
        avatar: result.user!.avatar,
        role: result.user!.role
      }
    }, { status: 200 });
    
    // Set HTTP-only cookie with JWT token
    response.cookies.set('auth-token', result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });
    
    return response;
    
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'שגיאה בהתחברות: ' + error.message },
      { status: 500 }
    );
  }
}