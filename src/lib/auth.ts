// src/lib/auth.ts - מימוש מלא של פונקציות האימות
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './db/connection';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface SessionUser {
  id: number;
  username: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface DBUser {
  id: number;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  role: string;
  bio?: string;
  cover_image?: string;
  posts_count: number;
  likes_count: number;
  created_at: Date;
  updated_at: Date;
}

// בדיקת אימות מטוקן
export async function verifyToken(request: NextRequest): Promise<SessionUser | null> {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return null;
    
    const decoded = jwt.verify(token, JWT_SECRET) as SessionUser;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// רישום משתמש חדש
export async function registerUser(
  username: string,
  email: string,
  password: string,
  avatar?: string
): Promise<{ success: boolean; user?: SessionUser; error?: string }> {
  try {
    // בדיקה אם המשתמש כבר קיים
    const existingUser = await db.query(
      'SELECT id, email, username FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );
    
    if (existingUser.rows.length > 0) {
      const existing = existingUser.rows[0];
      if (existing.email === email) {
        return { success: false, error: 'המייל כבר רשום במערכת' };
      }
      if (existing.username === username) {
        return { success: false, error: 'שם המשתמש כבר תפוס' };
      }
    }
    
    // הצפנת סיסמה
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // יצירת אווטר ברירת מחדל אם לא סופק
    const defaultAvatar = avatar || `https://via.placeholder.com/100x100/6366F1/FFFFFF?text=${username.substring(0, 2).toUpperCase()}`;
    const defaultCoverImage = `https://via.placeholder.com/800x200/4F46E5/FFFFFF?text=${username}`;
    
    // הכנסת המשתמש החדש
    const result = await db.query(`
      INSERT INTO users (username, email, password, avatar, cover_image, role, bio, posts_count, likes_count) 
      VALUES ($1, $2, $3, $4, $5, 'user', 'משתמש חדש באתר!', 0, 0)
      RETURNING id, username, email, avatar, role, bio, cover_image, posts_count, likes_count, created_at
    `, [username, email, passwordHash, defaultAvatar, defaultCoverImage]);
    
    if (result.rows.length === 0) {
      return { success: false, error: 'שגיאה ביצירת המשתמש' };
    }
    
    const newUser = result.rows[0];
    const sessionUser: SessionUser = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar
    };
    
    return { success: true, user: sessionUser };
    
  } catch (error: any) {
    console.error('Registration error:', error);
    return { 
      success: false, 
      error: error.code === '23505' ? 'המייל או שם המשתמש כבר קיימים' : 'שגיאה ברישום'
    };
  }
}

// התחברות משתמש
export async function loginUser(
  email: string,
  password: string,
  ipAddress?: string
): Promise<{ success: boolean; user?: SessionUser; token?: string; error?: string }> {
  try {
    // חיפוש המשתמש
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return { success: false, error: 'אימייל או סיסמה שגויים' };
    }
    
    const user: DBUser = result.rows[0];
    
    // בדיקת סיסמה
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { success: false, error: 'אימייל או סיסמה שגויים' };
    }
    
    // יצירת טוקן
    const sessionUser: SessionUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    };
    
    const token = generateToken(sessionUser);
    
    return { success: true, user: sessionUser, token };
    
  } catch (error: any) {
    console.error('Login error:', error);
    return { success: false, error: 'שגיאה בהתחברות' };
  }
}

// יצירת טוקן JWT
export function generateToken(user: SessionUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
}

// עדכון פרופיל משתמש
export async function updateUserProfile(
  userId: number, 
  updates: Partial<Omit<DBUser, 'id' | 'email' | 'password' | 'created_at'>>
): Promise<{ success: boolean; user?: SessionUser; error?: string }> {
  try {
    const allowedFields = ['username', 'avatar', 'bio', 'cover_image'];
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;
    
    Object.entries(updates).forEach(([key, value]) => {
      if (allowedFields.includes(key) && value !== undefined) {
        updateFields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });
    
    if (updateFields.length === 0) {
      return { success: false, error: 'אין שדות לעדכון' };
    }
    
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId);
    
    const query = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, username, email, avatar, role
    `;
    
    const result = await db.query(query, values);
    
    if (result.rows.length === 0) {
      return { success: false, error: 'משתמש לא נמצא' };
    }
    
    const updatedUser = result.rows[0];
    return { success: true, user: updatedUser };
    
  } catch (error: any) {
    console.error('Profile update error:', error);
    return { success: false, error: 'שגיאה בעדכון הפרופיל' };
  }
}

// קבלת משתמש לפי ID
export async function getUserById(userId: number): Promise<SessionUser | null> {
  try {
    const result = await db.query(
      'SELECT id, username, email, avatar, role FROM users WHERE id = $1',
      [userId]
    );
    
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}