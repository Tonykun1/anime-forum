// src/app/api/auth/login/route.ts - עם תיקון סיסמאות
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db/connection';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    console.log('🔐 Login attempt:', { email, password: '***' });
    
    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'אימייל וסיסמה נדרשים' },
        { status: 400 }
      );
    }
    
    // Find user by email
    const result = await db.query(
      'SELECT id, username, email, password, role, avatar FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      console.log('❌ User not found:', email);
      return NextResponse.json(
        { error: 'אימייל או סיסמה שגויים' },
        { status: 401 }
      );
    }

    const user = result.rows[0];
    console.log('👤 User found:', { username: user.username, hasPassword: !!user.password });
    
    // Check password - תיקון זמני לסיסמאות לא מוצפנות
    let isPasswordValid = false;
    
    if (user.password && user.password.startsWith('$2b$')) {
      // סיסמה מוצפנת - השתמש ב-bcrypt
      console.log('🔒 Checking encrypted password');
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      // סיסמה לא מוצפנת - השווה ישירות (זמני!)
      console.log('⚠️ Checking plain text password (will encrypt after successful login)');
      isPasswordValid = password === user.password;
      
      // אם הסיסמה נכונה, הצפן אותה במסד הנתונים
      if (isPasswordValid) {
        console.log('✅ Password correct, encrypting for future use...');
        const hashedPassword = await bcrypt.hash(password, 12);
        await db.query(
          'UPDATE users SET password = $1 WHERE id = $2',
          [hashedPassword, user.id]
        );
        console.log('🔐 Password encrypted successfully');
      }
    }
    
    console.log('🔍 Password validation result:', isPasswordValid);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'אימייל או סיסמה שגויים' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign({
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    }, JWT_SECRET, { expiresIn: '7d' });

    const userWithoutPassword = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    };

    console.log('✅ Login successful for:', user.username);
    
    // Set HTTP-only cookie
    const response = NextResponse.json({
      message: 'התחברת בהצלחה',
      user: userWithoutPassword
    });
    
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
      { error: 'שגיאה בהתחברות: ' + error.message },
      { status: 500 }
    );
  }
}