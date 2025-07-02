// src/lib/db/setup.ts - Updated setup with authentication support
import { db } from './connection';
import { allTables, allIndexes } from './schema';
import { allSeedData } from './seed';

export async function setupDatabase(): Promise<{ success: boolean; message: string; details?: any }> {
  try {
    console.log('🚀 Starting database setup...');

    // Drop existing tables in correct order (due to foreign keys)
    console.log('🗑️ Dropping existing tables...');
    await db.query('DROP TABLE IF EXISTS posts CASCADE;');
    await db.query('DROP TABLE IF EXISTS categories CASCADE;');
    await db.query('DROP TABLE IF EXISTS users CASCADE;');

    // Create all tables
    console.log('📋 Creating tables...');
    for (const [index, tableQuery] of allTables.entries()) {
      await db.query(tableQuery);
      console.log(`✅ Table ${index + 1}/${allTables.length} created`);
    }

    // Create indexes and triggers
    console.log('🔗 Creating indexes and triggers...');
    for (const [index, indexQuery] of allIndexes.entries()) {
      await db.query(indexQuery);
      console.log(`✅ Index/Trigger ${index + 1}/${allIndexes.length} created`);
    }

    // Insert seed data
    console.log('🌱 Inserting seed data...');
    for (const [index, seedQuery] of allSeedData.entries()) {
      await db.query(seedQuery);
      console.log(`✅ Seed data ${index + 1}/${allSeedData.length} inserted`);
    }

    // Verify setup
    const verification = await verifySetup();
    
    console.log('🎉 Database setup completed successfully!');
    
    return {
      success: true,
      message: 'Database setup completed successfully with authentication support!',
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

export async function verifySetup(): Promise<any> {
  try {
    // Check tables exist with correct columns
    const usersCheck = await db.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND table_schema = 'public'
      ORDER BY column_name;
    `);

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
      usersTableColumns: usersCheck.rows.map(row => `${row.column_name} (${row.data_type})`),
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
    // Check if tables exist
    const tablesCheck = await db.query(`
      SELECT COUNT(*) as table_count
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'categories', 'posts');
    `);

    const tableCount = parseInt(tablesCheck.rows[0].table_count);
    
    if (tableCount < 3) {
      return true; // Need setup if less than 3 tables exist
    }

    // Check if users table has password_hash column (for authentication)
    const passwordHashCheck = await db.query(`
      SELECT COUNT(*) as column_count
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name = 'password_hash'
      AND table_schema = 'public';
    `);

    const hasPasswordHash = parseInt(passwordHashCheck.rows[0].column_count) > 0;
    
    return !hasPasswordHash; // Need setup if password_hash column doesn't exist

  } catch (error) {
    console.error('Error checking setup status:', error);
    return true; // Assume setup needed if we can't check
  }
}