// src/app/api/posts/route.ts - עם fallback ונתונים זמניים
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';

// GET /api/posts - קבלת כל הפוסטים
export async function GET() {
  try {
    console.log('🔍 Trying to fetch posts...');
    
    // בדוק חיבור למסד נתונים
    try {
      await db.query('SELECT 1');
      console.log('✅ Database connection OK');
    } catch (dbError: any) {
      console.log('❌ Database connection failed:', dbError.message);
      
      // החזר נתונים זמניים אם אין חיבור למסד
      return NextResponse.json({
        posts: [
          {
            id: 1,
            title: 'ברוכים הבאים לפורום!',
            content: 'זהו פוסט זמני. אנא הגדירו את מסד הנתונים.',
            image_url: null,
            likes_count: 0,
            comments_count: 0,
            views_count: 0,
            created_at: new Date().toISOString(),
            author: { username: 'מערכת' },
            category: { name: 'הודעות מערכת', color: '#EF4444' }
          }
        ],
        warning: 'אין חיבור למסד נתונים - מוצגים נתונים זמניים',
        needsSetup: true
      });
    }
    
    // בדוק אם יש טבלת posts
    let tableExists = false;
    try {
      const tableCheck = await db.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'posts'
        );
      `);
      tableExists = tableCheck.rows[0].exists;
    } catch (tableError) {
      console.log('❌ Error checking table existence:', tableError);
    }
    
    if (!tableExists) {
      console.log('❌ Table posts does not exist');
      return NextResponse.json({
        posts: [
          {
            id: 1,
            title: 'מסד הנתונים לא מוגדר',
            content: 'אנא לחצו על "נסה שנית" כדי להגדיר את מסד הנתונים אוטומטיט.',
            image_url: null,
            likes_count: 0,
            comments_count: 0,
            views_count: 0,
            created_at: new Date().toISOString(),
            author: { username: 'מערכת' },
            category: { name: 'הגדרה נדרשת', color: '#F59E0B' }
          }
        ],
        error: 'טבלת הפוסטים לא קיימת',
        needsSetup: true,
        setupUrl: '/api/setup'
      });
    }
    
    console.log('✅ Table posts exists');
    
    // נסה לקבל פוסטים
    const result = await db.query(`
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
        c.name as category_name,
        c.color as category_color
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
      LIMIT 20
    `);
    
    console.log(`✅ Found ${result.rows.length} posts`);
    
    // אם אין פוסטים, החזר הודעה
    if (result.rows.length === 0) {
      return NextResponse.json({
        posts: [
          {
            id: 1,
            title: 'אין פוסטים עדיין',
            content: 'זהו הפורום החדש שלכם! תתחילו ליצור פוסטים מעניינים.',
            image_url: null,
            likes_count: 0,
            comments_count: 0,
            views_count: 0,
            created_at: new Date().toISOString(),
            author: { username: 'מערכת' },
            category: { name: 'ברוכים הבאים', color: '#10B981' }
          }
        ],
        message: 'אין פוסטים במסד הנתונים עדיין',
        isEmpty: true
      });
    }
    
    const posts = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      content: row.content,
      image_url: row.image_url,
      likes_count: row.likes_count || 0,
      comments_count: row.comments_count || 0,
      views_count: row.views_count || 0,
      created_at: row.created_at,
      author: {
        username: row.author_username || 'משתמש'
      },
      category: {
        name: row.category_name || 'כללי',
        color: row.category_color || '#6366F1'
      }
    }));

    return NextResponse.json({ posts });
    
  } catch (error: any) {
    console.error('❌ Error in /api/posts:', error);
    
    // החזר נתונים זמניים גם במקרה של שגיאה כללית
    return NextResponse.json({
      posts: [
        {
          id: 1,
          title: 'שגיאה במערכת',
          content: `אירעה שגיאה: ${error.message}. אנא פנו למפתח.`,
          image_url: null,
          likes_count: 0,
          comments_count: 0,
          views_count: 0,
          created_at: new Date().toISOString(),
          author: { username: 'מערכת' },
          category: { name: 'שגיאות', color: '#EF4444' }
        }
      ],
      error: 'שגיאה כללית במערכת',
      details: error.message,
      code: error.code,
      isError: true
    });
  }
}

// POST /api/posts - יצירת פוסט חדש
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, image_url, category_name } = body;
    
    console.log('📝 Creating new post:', { title, content, image_url, category_name });
    
    // בדיקת נתונים
    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: 'כותרת ותוכן הפוסט נדרשים' },
        { status: 400 }
      );
    }
    
    // בדוק חיבור
    await db.query('SELECT 1');
    
    // קבל או צור משתמש ברירת מחדל
    let userResult = await db.query(
      'SELECT id FROM users WHERE email = $1',
      ['user@example.com']
    );
    
    let userId = userResult.rows[0]?.id;
    if (!userId) {
      const newUserResult = await db.query(
        'INSERT INTO users (username, email, role) VALUES ($1, $2, $3) RETURNING id',
        ['משתמש', 'user@example.com', 'user']
      );
      userId = newUserResult.rows[0].id;
      console.log('✅ Created default user');
    }
    
    // קבל קטגוריה
    let categoryResult = await db.query(
      'SELECT id FROM categories WHERE name = $1',
      [category_name || 'דיונים']
    );
    
    let categoryId = categoryResult.rows[0]?.id;
    if (!categoryId) {
      const firstCategoryResult = await db.query('SELECT id FROM categories LIMIT 1');
      categoryId = firstCategoryResult.rows[0]?.id;
      
      if (!categoryId) {
        // צור קטגוריה ברירת מחדל
        const newCategoryResult = await db.query(
          'INSERT INTO categories (name, color) VALUES ($1, $2) RETURNING id',
          ['כללי', '#6366F1']
        );
        categoryId = newCategoryResult.rows[0].id;
        console.log('✅ Created default category');
      }
    }
    
    // צור פוסט
    const result = await db.query(`
      INSERT INTO posts (title, content, image_url, category_id, author_id) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `, [title.trim(), content.trim(), image_url || null, categoryId, userId]);
    
    const newPost = result.rows[0];
    console.log('✅ Post created successfully:', newPost.id);
    
    return NextResponse.json({
      message: 'הפוסט נוצר בהצלחה!',
      post: {
        id: newPost.id,
        title: newPost.title,
        content: newPost.content,
        image_url: newPost.image_url,
        created_at: newPost.created_at
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