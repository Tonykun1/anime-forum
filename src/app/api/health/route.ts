// app/api/health/route.ts - Health check with Mongoose
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { Post } from '@/lib/db/models/Post';
import { Category } from '@/lib/db/models/Category';
import { User } from '@/lib/db/models/User';

export async function GET() {
  try {
    await connectDB();
    
    // Count documents
    const [postsCount, categoriesCount, usersCount] = await Promise.all([
      Post.countDocuments(),
      Category.countDocuments(),
      User.countDocuments()
    ]);
    
    const needsSetup = categoriesCount === 0 || usersCount === 0;

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      needsSetup,
      counts: {
        posts: postsCount,
        categories: categoriesCount,
        users: usersCount
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
      needsSetup: true
    }, { status: 503 });
  }
}