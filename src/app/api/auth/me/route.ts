// src/app/api/auth/me/route.ts - עם תיקון ה-_id
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db/connection';
import { User } from '@/lib/db/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// טיפוס לJWT payload
interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // קבל token מ-cookie
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'לא מחובר' },
        { status: 401 }
      );
    }
    
    // בדוק token
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    console.log('🎫 Token decoded for user:', decoded.username);
    
    // מצא משתמש
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      console.log('❌ User not found for ID:', decoded.userId);
      return NextResponse.json(
        { error: 'משתמש לא נמצא' },
        { status: 404 }
      );
    }
    
    console.log('✅ User authenticated:', user.username);
    
    return NextResponse.json({
      user: {
        id: (user as any)._id.toString(),
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      },
      success: true
    });
    
  } catch (error: any) {
    console.error('❌ Auth me error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: 'טוקן לא תקין' },
        { status: 401 }
      );
    }
    
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json(
        { error: 'טוקן פג תוקף' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'שגיאה באימות: ' + error.message },
      { status: 500 }
    );
  }
}