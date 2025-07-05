// 2. תקן את app/api/setup/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';

export async function GET() {
  try {
    console.log('🚀 Starting database setup...');

    // יצירת טבלת users מלאה
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        bio TEXT,
        avatar TEXT,
        cover_image TEXT,
        role VARCHAR(20) DEFAULT 'user',
        posts_count INTEGER DEFAULT 0,
        likes_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // יצירת טבלת categories
    await db.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        color VARCHAR(7) DEFAULT '#6366F1',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // יצירת טבלת posts
    await db.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        image_url VARCHAR(500),
        category_id INTEGER REFERENCES categories(id),
        author_id INTEGER REFERENCES users(id),
        likes_count INTEGER DEFAULT 0,
        comments_count INTEGER DEFAULT 0,
        views_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Tables created');

    // בדוק אם יש נתונים
    const usersCount = await db.query('SELECT COUNT(*) FROM users');
    const categoriesCount = await db.query('SELECT COUNT(*) FROM categories');

    // הכנס נתוני בדיקה אם אין
    if (parseInt(usersCount.rows[0].count) === 0) {
      const bcrypt = require('bcryptjs');
      const passwordHash = await bcrypt.hash('123456', 12);
      
      await db.query(`
        INSERT INTO users (username, email, password, bio, avatar, cover_image, posts_count, likes_count) 
        VALUES 
          ('TestUser', 'test@example.com', $1, 'משתמש לבדיקה', 
           'https://picsum.photos/100/100?random=1', 'https://picsum.photos/800/200?random=1', 0, 0),
          ('AdminUser', 'admin@example.com', $1, 'מנהל המערכת',
           'https://picsum.photos/100/100?random=2', 'https://picsum.photos/800/200?random=2', 0, 0)
      `, [passwordHash]);
      
      console.log('✅ Test users created');
    }

    if (parseInt(categoriesCount.rows[0].count) === 0) {
      await db.query(`
        INSERT INTO categories (name, color) 
        VALUES 
          ('דיונים', '#3B82F6'),
          ('ביקורות', '#10B981'),
          ('המלצות', '#F59E0B'),
          ('שאלות', '#8B5CF6'),
          ('חדשות', '#EF4444'),
          ('מימים', '#EC4899')
      `);
      
      console.log('✅ Categories created');
    }

    // בדיקה סופית
    const finalUsersCount = await db.query('SELECT COUNT(*) FROM users');
    const finalCategoriesCount = await db.query('SELECT COUNT(*) FROM categories');

    console.log('🎉 Database setup completed!');
    
    return NextResponse.json({
      success: true,
      message: 'Database setup completed successfully!',
      counts: {
        users: parseInt(finalUsersCount.rows[0].count),
        categories: parseInt(finalCategoriesCount.rows[0].count)
      }
    });

  } catch (error: any) {
    console.error('❌ Database setup failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Database setup failed: ' + error.message
    }, { status: 500 });
  }
}

export async function POST() {
  return GET();
}