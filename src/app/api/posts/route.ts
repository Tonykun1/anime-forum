// src/app/api/posts/route.ts - מתוקן לעבוד עם PostgreSQL
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Helper function to get current user from JWT
async function getCurrentUser(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return null;
    
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

// GET /api/posts - Get all posts from PostgreSQL
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Trying to fetch posts...');
    
    // Test database connection
    await db.query('SELECT 1');
    console.log('✅ Database connection OK');
    
    // Check if posts table exists
    const tableExists = await db.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'posts'
        );
      `);
    
    if (!tableExists.rows[0].exists) {
      console.log('❌ Posts table does not exist');
      return NextResponse.json(
        { error: 'טבלת הפוסטים לא קיימת. אנא הרץ את ההגדרות תחילה.' },
        { status: 500 }
      );
    }
    
    console.log('✅ Table posts exists');
    
    // Fetch posts with user and category information
    const postsQuery = `
      SELECT 
        p.id,
        p.title,
        p.content,
        p.image_url,
        p.likes_count,
        p.comments_count,
        p.views_count,
        p.created_at,
        u.username as author_username,
        u.avatar as author_avatar,
        c.name as category_name,
        c.color as category_color
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
      LIMIT 20
    `;
    
    const result = await db.query(postsQuery);
    console.log(`✅ Found ${result.rows.length} posts`);
    
    const formattedPosts = result.rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      content: row.content,
      image_url: row.image_url,
      likes_count: row.likes_count || 0,
      comments_count: row.comments_count || 0,
      views_count: row.views_count || 0,
      created_at: row.created_at,
      author: {
        username: row.author_username || 'משתמש לא ידוע'
      },
      category: {
        name: row.category_name || 'כללי',
        color: row.category_color || '#6366F1'
      }
    }));
    
    return NextResponse.json({ posts: formattedPosts });
    
  } catch (error: any) {
    console.error('❌ Error fetching posts:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת פוסטים: ' + error.message },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create new post in PostgreSQL
export async function POST(request: NextRequest) {
  try {
    console.log('📝 Creating new post...');
    
    // Get current user
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'יש להתחבר כדי ליצור פוסט' },
        { status: 401 }
      );
    }
    
    console.log('👤 Current user:', currentUser.username);
    
    const body = await request.json();
    const { title, content, image_url, category_name } = body;
    
    console.log('📄 Post data:', { title, content, image_url, category_name });
    
    // Validation
    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: 'כותרת ותוכן הפוסט נדרשים' },
        { status: 400 }
      );
    }
    
    // Get category ID
    let categoryId = 1; // Default category
    if (category_name) {
      const categoryResult = await db.query(
        'SELECT id FROM categories WHERE name = $1',
        [category_name]
      );
      if (categoryResult.rows.length > 0) {
        categoryId = categoryResult.rows[0].id;
      }
    }
    
    // Insert new post
    const insertQuery = `
      INSERT INTO posts (title, content, image_url, category_id, author_id, likes_count, comments_count, views_count)
      VALUES ($1, $2, $3, $4, $5, 0, 0, 0)
      RETURNING id, title, content, image_url, created_at
    `;
    
    const result = await db.query(insertQuery, [
      title.trim(),
      content.trim(),
      image_url || null,
      categoryId,
      currentUser.id
    ]);
    
    const newPost = result.rows[0];
    console.log('✅ Post created:', newPost);
    
    // Get the complete post with user and category info
    const fullPostQuery = `
      SELECT 
        p.id, p.title, p.content, p.image_url, p.created_at,
        u.username as author_username,
        u.avatar as author_avatar,
        c.name as category_name,
        c.color as category_color
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `;
    
    const fullPostResult = await db.query(fullPostQuery, [newPost.id]);
    const fullPost = fullPostResult.rows[0];
    
    return NextResponse.json({
      message: 'הפוסט נוצר בהצלחה!',
      post: {
        id: fullPost.id,
        title: fullPost.title,
        content: fullPost.content,
        image_url: fullPost.image_url,
        created_at: fullPost.created_at,
        author: {
          username: fullPost.author_username
        },
        category: {
          name: fullPost.category_name,
          color: fullPost.category_color
        }
      }
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('❌ Error creating post:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת פוסט: ' + error.message },
      { status: 500 }
    );
  }
}