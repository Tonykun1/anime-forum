import { db } from './connection';
import { allTables } from './schema';
import { allSeedData } from './seed';

export async function setupDatabase(): Promise<{ success: boolean; message: string; details?: any }> {
  try {
    console.log('🚀 Starting database setup...');

    // Create all tables
    for (const [index, tableQuery] of allTables.entries()) {
      await db.query(tableQuery);
      console.log(`✅ Table ${index + 1}/${allTables.length} created`);
    }

    // Insert seed data
    for (const [index, seedQuery] of allSeedData.entries()) {
      await db.query(seedQuery);
      console.log(`✅ Seed data ${index + 1}/${allSeedData.length} inserted`);
    }

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
    return { error: error.message};
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