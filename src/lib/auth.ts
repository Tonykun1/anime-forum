// lib/auth.ts - Updated with PostgreSQL user registration
import { NextRequest } from 'next/server';
import { db } from './db/connection';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface SessionUser {
  id: number;
  username: string;
  email: string;
  role: string;
  avatar?: string;
}

// Verify JWT token
export async function verifyToken(request: NextRequest): Promise<SessionUser | null> {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return null;
    
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Fetch user from PostgreSQL
    const result = await db.query(
      'SELECT id, username, email, avatar FROM users WHERE id = $1',
      [decoded.id]
    );
    
    if (result.rows.length === 0) return null;
    
    const user = result.rows[0];
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role || 'user',
      avatar: user.avatar
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

// Register new user in PostgreSQL
export async function registerUser(
  username: string,
  email: string,
  password: string,
  avatar?: string
): Promise<{ success: boolean; user?: SessionUser; error?: string }> {
  try {
    // Validation
    if (!username || username.length < 2) {
      return { success: false, error: 'שם משתמש חייב להכיל לפחות 2 תווים' };
    }
    
    if (!email || !email.includes('@')) {
      return { success: false, error: 'כתובת אימייל לא חוקית' };
    }
    
    if (!password || password.length < 6) {
      return { success: false, error: 'סיסמה חייבת להכיל לפחות 6 תווים' };
    }
    
    // Check if user already exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email.toLowerCase(), username]
    );
    
    if (existingUser.rows.length > 0) {
      return { success: false, error: 'משתמש עם האימייל או שם המשתמש כבר קיים' };
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Insert new user into PostgreSQL
    const insertResult = await db.query(
      `INSERT INTO users (username, email, password_hash, avatar, role, created_at) 
       VALUES ($1, $2, $3, $4, $5, NOW()) 
       RETURNING id, username, email, avatar, role, created_at`,
      [username.trim(), email.toLowerCase().trim(), hashedPassword, avatar || null, 'user']
    );
    
    const newUser = insertResult.rows[0];
    
    return {
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar
      }
    };
    
  } catch (error: any) {
    console.error('Registration error:', error);
    return { 
      success: false, 
      error: 'שגיאה ביצירת המשתמש: ' + error.message 
    };
  }
}

// Login user
export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; user?: SessionUser; token?: string; error?: string }> {
  try {
    // Find user in PostgreSQL
    const result = await db.query(
      'SELECT id, username, email, password_hash, avatar, role FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    
    if (result.rows.length === 0) {
      return { success: false, error: 'אימייל או סיסמה שגויים' };
    }
    
    const user = result.rows[0];
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return { success: false, error: 'אימייל או סיסמה שגויים' };
    }
    
    // Generate JWT token
    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    });
    
    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      },
      token
    };
    
  } catch (error: any) {
    console.error('Login error:', error);
    return { 
      success: false, 
      error: 'שגיאה בהתחברות: ' + error.message 
    };
  }
}

// Generate JWT token
export function generateToken(user: any): string {
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      email: user.email,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}