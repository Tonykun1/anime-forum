// src/app/api/auth/register/route.ts - רישום מתוקן עם PostgreSQL
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password, confirmPassword, avatar } = body;
    
    console.log('📝 Registration attempt:', { username, email, avatar: avatar ? 'provided' : 'none' });
    
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

    // Check if user already exists
    console.log('🔍 Checking if user exists...');
    const existingUser = await db.query(
      'SELECT id, email, username FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );
    
    if (existingUser.rows.length > 0) {
      const existing = existingUser.rows[0];
      if (existing.email === email) {
        return NextResponse.json(
          { error: 'המייל כבר רשום במערכת' },
          { status: 400 }
        );
      }
      if (existing.username === username) {
        return NextResponse.json(
          { error: 'שם המשתמש כבר תפוס' },
          { status: 400 }
        );
      }
    }
    
    // Hash password
    console.log('🔐 Hashing password...');
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Create default avatar if not provided
    const defaultAvatar = avatar || `https://via.placeholder.com/100x100/6366F1/FFFFFF?text=${username.substring(0, 2).toUpperCase()}`;
    const defaultCoverImage = `https://via.placeholder.com/800x200/4F46E5/FFFFFF?text=${username}`;
    
    // Insert new user
    console.log('👤 Creating new user...');
    const result = await db.query(`
      INSERT INTO users (username, email, password, avatar, role) 
      VALUES ($1, $2, $3, $4, 'user')
      RETURNING id, username, email, avatar, role, created_at
    `, [username, email, passwordHash, defaultAvatar]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'שגיאה ביצירת המשתמש' },
        { status: 500 }
      );
    }
    
    const newUser = result.rows[0];
    console.log('✅ User created successfully:', { id: newUser.id, username: newUser.username });
    
    // Create session user object
    const sessionUser = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar
    };
    
    // Generate JWT token
    const token = jwt.sign(sessionUser, JWT_SECRET, { expiresIn: '7d' });
    
    // Set HTTP-only cookie
    const response = NextResponse.json({
      message: 'הרישום בוצע בהצלחה',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
        joinDate: newUser.created_at,
        postsCount: 0,
        likesCount: 0
      }
    }, { status: 201 });
    
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });
    
    return response;
    
  } catch (error: any) {
    console.error('❌ Registration API error:', error);
    
    // Handle specific PostgreSQL errors
    if (error.code === '23505') {
      if (error.constraint?.includes('email')) {
        return NextResponse.json(
          { error: 'האימייל כבר רשום במערכת' },
          { status: 400 }
        );
      }
      if (error.constraint?.includes('username')) {
        return NextResponse.json(
          { error: 'שם המשתמש כבר תפוס' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'שגיאה ברישום: ' + (error.message || 'שגיאה לא ידועה') },
      { status: 500 }
    );
  }
}