// src/lib/db/setup.ts - מתוקן
import { db } from './connection';
import { allTables } from './schema';

export async function setupDatabase(): Promise<{ success: boolean; message: string; details?: any }> {
  try {
    console.log('🚀 Starting database setup...');

    // Drop existing tables in correct order (due to foreign keys)
    console.log('🗑️ Dropping existing tables...');
    await db.query('DROP TABLE IF EXISTS posts CASCADE;');
    await db.query('DROP TABLE IF EXISTS categories CASCADE;');
    await db.query('DROP TABLE IF EXISTS users CASCADE;');

    // Create all tables
    console.log('🏗️ Creating tables...');
    for (const [index, tableQuery] of allTables.entries()) {
      await db.query(tableQuery);
      console.log(`✅ Table ${index + 1}/${allTables.length} created`);
    }

    // Insert basic seed data
    console.log('🌱 Inserting seed data...');
    await insertSeedData();

    // Verify setup
    const verification = await verifySetup();
    
    console.log('🎉 Database setup completed successfully!');
    
    return {
      success: true,
      message: 'Database setup completed successfully!',
      details: verification
    };

  } catch (error: any) {
    console.error('❌ Database setup failed:', error);
    return {
      success: false,
      message: 'Database setup failed: ' + error.message
    };
  }
}

async function insertSeedData(): Promise<void> {
  // Insert categories
  const categories = [
    { name: 'שונן', color: '#FF6B6B' },
    { name: 'אקשן', color: '#4ECDC4' },
    { name: 'רומנטיקה', color: '#45B7D1' },
    { name: 'פנטזיה', color: '#96CEB4' },
    { name: 'מכה', color: '#FFEAA7' },
    { name: 'דרמה', color: '#DDA0DD' }
  ];

  for (const category of categories) {
    await db.query(
      'INSERT INTO categories (name, color) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
      [category.name, category.color]
    );
  }

  // Insert a default user if none exists
  const userCheck = await db.query('SELECT COUNT(*) FROM users');
  if (parseInt(userCheck.rows[0].count) === 0) {
    const bcrypt = require('bcryptjs');
    const defaultPassword = await bcrypt.hash('123456', 12);
    
    await db.query(`
      INSERT INTO users (username, email, password, avatar, role, bio, cover_image) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      'Admin',
      'admin@anime-forum.com',
      defaultPassword,
      'https://via.placeholder.com/100x100/6366F1/FFFFFF?text=AD',
      'admin',
      'מנהל האתר',
      'https://via.placeholder.com/800x200/4F46E5/FFFFFF?text=Admin'
    ]);
  }
}

export async function verifySetup(): Promise<any> {
  try {
    // Check tables exist
    const tablesCheck = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'categories', 'posts')
      ORDER BY table_name;
    `);

    // Count data
    const categoriesCount = await db.query('SELECT COUNT(*) FROM categories');
    const usersCount = await db.query('SELECT COUNT(*) FROM users');
    const postsCount = await db.query('SELECT COUNT(*) FROM posts');

    return {
      tablesCreated: tablesCheck.rows.map(row => row.table_name),
      dataCount: {
        categories: parseInt(categoriesCount.rows[0].count),
        users: parseInt(usersCount.rows[0].count),
        posts: parseInt(postsCount.rows[0].count)
      }
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function checkIfSetupNeeded(): Promise<boolean> {
  try {
    const tablesCheck = await db.query(`
      SELECT COUNT(*) as table_count
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'categories', 'posts');
    `);

    const tableCount = parseInt(tablesCheck.rows[0].table_count);
    return tableCount < 3; // Need setup if less than 3 tables exist
  } catch (error) {
    console.error('Error checking setup status:', error);
    return true; // Assume setup needed if we can't check
  }
}