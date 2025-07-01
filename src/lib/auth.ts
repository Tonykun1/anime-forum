// lib/auth.ts - Real authentication with MongoDB
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db/connection';
import { User, IUser } from '@/lib/db/models/User';

export interface SessionUser {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Verify JWT token
export async function verifyToken(request: NextRequest): Promise<SessionUser | null> {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    await connectDB();
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

// Register new user
export async function registerUser(
  username: string,
  email: string,
  password: string,
  avatar?: string
): Promise<{ success: boolean; user?: SessionUser; error?: string }> {
  try {
    await connectDB();
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return {
        success: false,
        error: existingUser.email === email ? 'האימייל כבר רשום' : 'שם המשתמש כבר תפוס'
      };
    }

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password,
      avatar: avatar || `https://via.placeholder.com/100x100/6366F1/FFFFFF?text=${username.charAt(0).toUpperCase()}`,
      coverImage: "https://via.placeholder.com/800x200/6366F1/FFFFFF?text=Welcome+Cover",
      bio: "חבר חדש בקהילה!"
    });

    const userWithoutPassword = {
      id: newUser._id.toString(),
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar
    };

    return {
      success: true,
      user: userWithoutPassword
    };
  } catch (error: any) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: 'שגיאה ברישום המשתמש'
    };
  }
}

// Login user
export async function loginUser(
  email: string,
  password: string,
  ipAddress?: string
): Promise<{ success: boolean; user?: SessionUser; token?: string; error?: string }> {
  try {
    await connectDB();
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return {
        success: false,
        error: 'אימייל או סיסמה שגויים'
      };
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return {
        success: false,
        error: 'אימייל או סיסמה שגויים'
      };
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role
    });

    const userWithoutPassword = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    };

    return {
      success: true,
      user: userWithoutPassword,
      token
    };
  } catch (error: any) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'שגיאה בהתחברות'
    };
  }
}

// Generate JWT token
export function generateToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}