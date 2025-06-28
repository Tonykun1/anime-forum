// lib/db/index.ts - Main exports for Mongoose (NOT API routes!)
export { connectDB } from './connection';
export { setupDatabase, checkIfSetupNeeded } from './setup';
export { seedDatabase } from './seed';
export { User } from './models/User';
export { Category } from './models/Category';
export { Post } from './models/Post';

// Types
export type { IUser } from './models/User';
export type { ICategory } from './models/Category';
export type { IPost } from './models/Post';



// app/api/posts/route.ts - This should be the ACTUAL posts API with Mongoose
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { Post } from '@/lib/db/models/Post';
import { User } from '@/lib/db/models/User';
import { Category } from '@/lib/db/models/Category';

// GET /api/posts - Get all posts with Mongoose
export async function GET() {
  try {
    await connectDB();
    
    const posts = await Post.find()
      .populate('author', 'username avatar')
      .populate('category', 'name color')
      .sort({ createdAt: -1 })
      .lean();

    const formattedPosts = posts.map((post: any) => ({
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      image_url: post.imageUrl,
      likes_count: post.likesCount || 0,
      comments_count: post.commentsCount || 0,
      views_count: post.viewsCount || 0,
      created_at: post.createdAt,
      author: {
        username: post.author?.username || 'משתמש'
      },
      category: {
        name: post.category?.name || 'כללי',
        color: post.category?.color || '#6366F1'
      }
    }));
    
    return NextResponse.json({ posts: formattedPosts });
    
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת פוסטים: ' + error.message },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create new post with Mongoose
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { title, content, image_url, category_name } = body;
    
    console.log('Received post data:', { title, content, image_url, category_name });
    
    // Validation
    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: 'כותרת ותוכן הפוסט נדרשים' },
        { status: 400 }
      );
    }
    
    // Get or create default user
    let defaultUser = await User.findOne({ email: 'user@example.com' });
    if (!defaultUser) {
      defaultUser = await User.create({
        username: 'משתמש',
        email: 'user@example.com'
      });
    }
    
    // Get category
    let category = await Category.findOne({ name: category_name });
    if (!category) {
      // Use first category as default
      category = await Category.findOne();
    }
    
    if (!category) {
      return NextResponse.json(
        { error: 'לא נמצאה קטגוריה - אנא הרץ /api/setup תחילה' },
        { status: 400 }
      );
    }
    
    // Create post with Mongoose
    const newPost = await Post.create({
      title: title.trim(),
      content: content.trim(),
      imageUrl: image_url || undefined,
      author: defaultUser._id,
      category: category._id
    });
    
    // Populate the post for response
    const populatedPost = await Post.findById(newPost._id)
      .populate('author', 'username avatar')
      .populate('category', 'name color');
    
    if (!populatedPost) {
      throw new Error('Failed to create post');
    }
    
    console.log('Post created successfully with MongoDB:', populatedPost);
    
    return NextResponse.json({
      message: 'הפוסט נוצר בהצלחה במסד הנתונים!',
      post: {
        id: populatedPost._id.toString(),
        title: populatedPost.title,
        content: populatedPost.content,
        image_url: populatedPost.imageUrl || null,
        created_at: populatedPost.createdAt,
        author: populatedPost.author,
        category: populatedPost.category
      }
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Error creating post with MongoDB:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת פוסט: ' + error.message },
      { status: 500 }
    );
  }
}