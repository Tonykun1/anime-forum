// src/app/api/admin/migrate/route.ts - API להרצת המיגרציה
import { NextRequest, NextResponse } from 'next/server';
import { runMigration , createTestUser} from '@/lib/db/models/migration';
export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Starting database migration...');
    
    // הרצת המיגרציה
    const migrationResult = await runMigration();
    
    if (!migrationResult.success) {
      return NextResponse.json({
        success: false,
        message: migrationResult.message
      }, { status: 500 });
    }

    // יצירת משתמש לבדיקה
    const testUserResult = await createTestUser();
    
    return NextResponse.json({
      success: true,
      message: 'Migration completed successfully!',
      migration: migrationResult,
      testUser: testUserResult
    });

  } catch (error: any) {
    console.error('Migration API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Migration failed: ' + error.message
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // בדיקת סטטוס הטבלאות
    const { db } = require('@/lib/db/connection');
    
    const tablesCheck = await db.query(`
      SELECT 
        table_name,
        (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'categories', 'posts')
      ORDER BY table_name;
    `);

    const usersCheck = await db.query(`
      SELECT COUNT(*) as user_count FROM users;
    `).catch(() => ({ rows: [{ user_count: 'Table not found' }] }));

    return NextResponse.json({
      tables: tablesCheck.rows,
      userCount: usersCheck.rows[0].user_count,
      status: tablesCheck.rows.length === 3 ? 'Ready' : 'Migration needed'
    });

  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      status: 'Error'
    }, { status: 500 });
  }
}