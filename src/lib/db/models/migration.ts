// src/lib/db/migration.ts - מתוקן לחלוטין ללא שגיאות TypeScript
import { db } from '../connection';
import { tableUpdates, allTables } from '../schema';

export async function runMigration(): Promise<{ success: boolean; message: string; details?: any }> {
  try {
    console.log('🚀 Starting database migration...');

    // בדיקה אם הטבלאות קיימות
    const tablesCheck = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'categories', 'posts')
      ORDER BY table_name;
    `);

    const existingTables = tablesCheck.rows.map((row: any) => row.table_name);
    console.log('📊 Existing tables:', existingTables);

    // אם אין טבלאות, צור הכל מחדש
    if (existingTables.length === 0) {
      console.log('🏗️ Creating all tables from scratch...');
      
      for (const [index, tableQuery] of allTables.entries()) {
        await db.query(tableQuery);
        console.log(`✅ Table ${index + 1}/${allTables.length} created`);
      }
    } else {
      // אם יש טבלאות, הרץ עדכונים
      console.log('🔄 Running table updates...');
      
      for (const [index, updateQuery] of tableUpdates.entries()) {
        await db.query(updateQuery);
        console.log(`✅ Update ${index + 1}/${tableUpdates.length} completed`);
      }
    }

    // בדיקה שהכל תקין
    const verification = await verifyMigration();
    
    console.log('🎉 Database migration completed successfully!');
    
    return {
      success: true,
      message: 'Database migration completed successfully!',
      details: verification
    };

  } catch (error: any) {
    console.error('❌ Database migration failed:', error);
    return {
      success: false,
      message: 'Database migration failed: ' + error.message
    };
  }
}

async function verifyMigration(): Promise<any> {
  try {
    // בדיקת קיום טבלאות
    const tablesCheck = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'categories', 'posts')
      ORDER BY table_name;
    `);

    // בדיקת עמודות בטבלת users
    const usersColumns = await db.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `);

    // ספירת נתונים
    const counts = {
      users: 0,
      categories: 0,
      posts: 0
    };

    if (tablesCheck.rows.some((row: any) => row.table_name === 'users')) {
      const usersCount = await db.query('SELECT COUNT(*) FROM users');
      counts.users = parseInt(usersCount.rows[0].count);
    }

    if (tablesCheck.rows.some((row: any) => row.table_name === 'categories')) {
      const categoriesCount = await db.query('SELECT COUNT(*) FROM categories');
      counts.categories = parseInt(categoriesCount.rows[0].count);
    }

    if (tablesCheck.rows.some((row: any) => row.table_name === 'posts')) {
      const postsCount = await db.query('SELECT COUNT(*) FROM posts');
      counts.posts = parseInt(postsCount.rows[0].count);
    }

    return {
      tablesCreated: tablesCheck.rows.map((row: any) => row.table_name),
      usersTableColumns: usersColumns.rows.map((col: any) => ({
        name: col.column_name,
        type: col.data_type,
        nullable: col.is_nullable === 'YES',
        default: col.column_default
      })),
      dataCount: counts
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

// פונקציה ליצירת משתמש ראשוני לבדיקה
export async function createTestUser(): Promise<{ success: boolean; message: string; user?: any }> {
  try {
    // בדוק אם bcryptjs זמין
    let bcrypt: any;
    try {
      bcrypt = require('bcryptjs');
    } catch (error) {
      return {
        success: false,
        message: 'bcryptjs is not installed. Please run: npm install bcryptjs'
      };
    }
    
    // בדיקה אם יש כבר משתמש ראשוני
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', ['test@example.com']);
    
    if (existingUser.rows.length > 0) {
      return {
        success: true,
        message: 'Test user already exists',
        user: existingUser.rows[0]
      };
    }

    // יצירת משתמש בדיקה
    const passwordHash = await bcrypt.hash('123456', 12);
    
    const result = await db.query(`
      INSERT INTO users (username, email, password_hash, avatar, role, bio, cover_image, posts_count, likes_count) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, username, email, avatar, role
    `, [
      'TestUser',
      'test@example.com',
      passwordHash,
      'https://via.placeholder.com/100x100/6366F1/FFFFFF?text=TU',
      'user',
      'משתמש לבדיקה',
      'https://via.placeholder.com/800x200/4F46E5/FFFFFF?text=TestUser',
      0,
      0
    ]);

    return {
      success: true,
      message: 'Test user created successfully',
      user: result.rows[0]
    };

  } catch (error: any) {
    console.error('Create test user error:', error);
    return {
      success: false,
      message: 'Failed to create test user: ' + error.message
    };
  }
}