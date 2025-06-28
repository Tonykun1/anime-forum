// app/api/auth/register/route.ts - Registration endpoint
import { NextRequest, NextResponse } from 'next/server';
import { registerUser, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password, confirmPassword, avatar } = body;
    
    // Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'שם משתמש, אימייל וסיסמה נדרשים' },
        { status: 400 }
      );
    }
    
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'הסיסמאות לא תואמות' },
        { status: 400 }
      );
    }
    
    const result = await registerUser(username, email, password, avatar);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    // Generate token for immediate login
    const token = generateToken({
      id: result.user!.id,
      username: result.user!.username,
      email: result.user!.email,
      role: result.user!.role,
      avatar: result.user!.avatar
    });
    
    // Set HTTP-only cookie
    const response = NextResponse.json({
      message: 'הרישום בוצע בהצלחה',
      user: result.user
    }, { status: 201 });
    
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });
    
    return response;
    
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { error: 'שגיאה ברישום' },
      { status: 500 }
    );
  }
}