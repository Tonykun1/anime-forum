// src/app/api/auth/login/route.ts - התחברות מתוקנת עם PostgreSQL
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    console.log('🔑 Login attempt for:', email);
    
    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'אימייל וסיסמה נדרשים' },
        { status: 400 }
      );
    }
    
    // Find user by email
    console.log('🔍 Looking for user...');
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'אימייל או סיסמה שגויים' },
        { status: 401 }
      );
    }
    
    const user = result.rows[0];
    console.log('👤 Found user:', { id: user.id, username: user.username });
    
    // Check password
    console.log('🔐 Verifying password...');
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'אימייל או סיסמה שגויים' },
        { status: 401 }
      );
    }
    
    console.log('✅ Password verified successfully');
    
    // Create session user object
    const sessionUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    };
    
    // Generate JWT token
    const token = jwt.sign(sessionUser, JWT_SECRET, { expiresIn: '7d' });
    
    // Set HTTP-only cookie
    const response = NextResponse.json({
      message: 'התחברות בוצעה בהצלחה',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        joinDate: user.created_at,
        postsCount: 0,
        likesCount: 0
      }
    }, { status: 200 });
    
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });
    
    return response;
    
  } catch (error: any) {
    console.error('❌ Login API error:', error);
    return NextResponse.json(
      { error: 'שגיאה בהתחברות: ' + (error.message || 'שגיאה לא ידועה') },
      { status: 500 }
    );
  }
}