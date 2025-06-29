// src/app/api/health/route.ts - Health check with Mongoose
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import mongoose from 'mongoose';

export async function GET() {
  try {
    // בדיקת חיבור למסד נתונים
    await connectDB();
    
    // בדיקת מצב החיבור
    const dbState = mongoose.connection.readyState;
    const dbStatuses = {
      0: 'disconnected',
      1: 'connected', 
      2: 'connecting',
      3: 'disconnecting'
    };
    
    if (dbState !== 1) {
      throw new Error(`Database not connected. Current state: ${dbStatuses[dbState as keyof typeof dbStatuses]}`);
    }

    // ייבוא מודלים רק אחרי שהחיבור תקין
    const { User } = await import('@/lib/db/models/User');
    const { Category } = await import('@/lib/db/models/Category');
    const { Post } = await import('@/lib/db/models/Post');
    
    // ספירת מסמכים בכל קולקציה
    const [postsCount, categoriesCount, usersCount] = await Promise.all([
      Post.countDocuments(),
      Category.countDocuments(), 
      User.countDocuments()
    ]);
    
    // בדיקה אם נדרש setup
    const needsSetup = categoriesCount === 0 || usersCount === 0;
    
    // בדיקת אוספים (עם בדיקה שהמסד נתונים קיים)
    let collectionNames: string[] = [];
    let databaseInfo = {
      status: 'connected' as const,
      state: dbStatuses[dbState as keyof typeof dbStatuses],
      name: 'unknown',
      host: mongoose.connection.host || 'unknown',
      port: mongoose.connection.port || 0
    };

    if (mongoose.connection.db) {
      try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        collectionNames = collections.map(c => c.name);
        databaseInfo.name = mongoose.connection.db.databaseName || 'unknown';
      } catch (collectionError) {
        console.warn('לא ניתן לקבל רשימת אוספים:', collectionError);
      }
    }

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: databaseInfo,
      collections: collectionNames,
      needsSetup,
      counts: {
        posts: postsCount,
        categories: categoriesCount,
        users: usersCount,
        total: postsCount + categoriesCount + usersCount
      },
      environment: process.env.NODE_ENV || 'development'
    });

  } catch (error: any) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
      database: {
        status: 'error',
        state: mongoose.connection.readyState,
        name: 'unknown',
        host: 'unknown',
        port: 0
      },
      needsSetup: true,
      environment: process.env.NODE_ENV || 'development'
    }, { status: 503 });
  }
}