// src/app/api/auth/login/route.ts - עם תיקון ה-_id
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { User } from '@/lib/db/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Starting login process...');
    await connectDB();
    
    const { email, password } = await request.json();
    console.log('📧 Login attempt for email:', email);
    
    // ולידציה
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return NextResponse.json(
        { error: 'אימייל וסיסמה נדרשים' },
        { status: 400 }
      );
    }
    
    // בדוק כמה משתמשים יש
    const userCount = await User.countDocuments();
    console.log('👥 Total users in database:', userCount);
    
    // מצא משתמש
    const user = await User.findOne({ email: email.toLowerCase() });
    console.log('🔍 User found:', user ? 'YES' : 'NO');
    
    if (!user) {
      console.log('❌ User not found for email:', email);
      
      // הצג את כל המשתמשים לdebug
      const allUsers = await User.find({}, 'email username');
      console.log('📋 All users in database:', allUsers.map(u => ({ email: u.email, username: u.username })));
      
      return NextResponse.json(
        { error: 'אימייל או סיסמה שגויים' },
        { status: 401 }
      );
    }
    
    console.log('👤 Found user:', user.username, 'with email:', user.email);
    console.log('🔐 User has password:', user.password ? 'YES' : 'NO');
    
    // בדוק סיסמה
    console.log('🔍 Checking password...');
    const isValidPassword = await (user as any).comparePassword(password);
    console.log('🔍 Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('❌ Invalid password for user:', user.username);
      return NextResponse.json(
        { error: 'אימייל או סיסמה שגויים' },
        { status: 401 }
      );
    }
    
    console.log('✅ Password validation successful');
    
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
    
    console.log('🎫 JWT token created');
    
    // צור response
    const response = NextResponse.json({
      message: 'התחברות בוצעה בהצלחה',
      user: {
        id: (user as any)._id.toString(),
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      },
      success: true
    });
    
    // הגדר cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });
    
    console.log('✅ Login successful for user:', user.username);
    
    return response;
    
  } catch (error: any) {
    console.error('❌ Login error:', error);
    return NextResponse.json(
      { error: 'שגיאה בהתחברות: ' + error.message },
      { status: 500 }
    );
  }
}