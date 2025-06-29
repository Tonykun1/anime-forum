// src/app/api/auth/register/route.ts - עם תיקון ה-_id
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { User } from '@/lib/db/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Starting registration process...');
    await connectDB();
    
    const { username, email, password, confirmPassword } = await request.json();
    console.log('📝 Registration attempt for:', { username, email });
    
    // ולידציה
    if (!username || !email || !password) {
      console.log('❌ Missing required fields');
      return NextResponse.json(
        { error: 'כל השדות נדרשים' },
        { status: 400 }
      );
    }
    
    if (password !== confirmPassword) {
      console.log('❌ Passwords do not match');
      return NextResponse.json(
        { error: 'הסיסמאות לא תואמות' },
        { status: 400 }
      );
    }
    
    if (password.length < 6) {
      console.log('❌ Password too short');
      return NextResponse.json(
        { error: 'סיסמה חייבת להיות לפחות 6 תווים' },
        { status: 400 }
      );
    }
    
    // בדוק אם המשתמש קיים
    console.log('🔍 Checking for existing user...');
    const existingUser = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { username: username }
      ]
    });
    
    if (existingUser) {
      console.log('❌ User already exists:', existingUser.username);
      return NextResponse.json(
        { error: 'משתמש עם אימייל או שם משתמש זה כבר קיים' },
        { status: 409 }
      );
    }
    
    console.log('✅ No existing user found, creating new user...');
    
    // צור משתמש חדש
    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      role: 'user'
    });
    
    console.log('✅ User created successfully:', user.username);
    
    // צור JWT token
    const token = jwt.sign(
      { 
        userId: (user as any)._id.toString(),
        email: user.email,
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log('🎫 JWT token created for new user');
    
    // צור response
    const response = NextResponse.json({
      message: 'רישום בוצע בהצלחה!',
      user: {
        id: (user as any)._id.toString(),
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      },
      success: true
    }, { status: 201 });
    
    // הגדר cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });
    
    console.log('✅ Registration successful for user:', user.username);
    
    return response;
    
  } catch (error: any) {
    console.error('❌ Registration error:', error);
    return NextResponse.json(
      { error: 'שגיאה ברישום: ' + error.message },
      { status: 500 }
    );
  }
}