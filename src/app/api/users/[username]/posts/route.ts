// src/app/api/users/[username]/posts/route.ts - API לפוסטים של משתמש
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    
    console.log('🔍 Fetching posts for user:', username);
    
    // Get user posts
    const postsResult = await db.query(`
      SELECT 
        p.id, p.title, p.content, p.image_url, 
        p.likes_count, p.comments_count, p.created_at,
        c.name as category_name, c.color as category_color
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.author_id = u.id
      WHERE u.username = $1
      ORDER BY p.created_at DESC
      LIMIT 20
    `, [username]);
    
    const posts = postsResult.rows.map(row => ({
      id: row.id,
      title: row.title,
      content: row.content,
      image_url: row.image_url,
      likes_count: row.likes_count || 0,
      comments_count: row.comments_count || 0,
      created_at: row.created_at,
      category: {
        name: row.category_name || 'כללי',
        color: row.category_color || '#6366F1'
      }
    }));
    
    console.log(`✅ Found ${posts.length} posts for user ${username}`);
    
    return NextResponse.json({ posts });
    
  } catch (error: any) {
    console.error('❌ Error fetching user posts:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת פוסטים' },
      { status: 500 }
    );
  }
}