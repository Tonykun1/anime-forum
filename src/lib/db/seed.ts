// src/lib/db/seed.ts - קובץ זרעים למסד הנתונים
import { db } from './connection';

export const allSeedData: string[] = [
  // Categories seed data
  `INSERT INTO categories (name, color) VALUES 
    ('שונן', '#FF6B6B'),
    ('אקשן', '#4ECDC4'),
    ('רומנטיקה', '#45B7D1'),
    ('פנטזיה', '#96CEB4'),
    ('מכה', '#FFEAA7'),
    ('דרמה', '#DDA0DD')
    ON CONFLICT (name) DO NOTHING;`,

  // Default admin user
  `INSERT INTO users (username, email, password, avatar, role, bio, cover_image) VALUES 
    ('Admin', 'admin@anime-forum.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LEeHDYtELRExgOhYy', 
     'https://via.placeholder.com/100x100/6366F1/FFFFFF?text=AD', 'admin', 'מנהל האתר',
     'https://via.placeholder.com/800x200/4F46E5/FFFFFF?text=Admin')
    ON CONFLICT (email) DO NOTHING;`
];

export async function seedDatabase(): Promise<{ success: boolean; message: string; details?: any }> {
  try {
    console.log('🌱 Starting database seeding...');

    // Insert categories
    const categories = [
      { name: 'שונן', color: '#FF6B6B' },
      { name: 'אקשן', color: '#4ECDC4' },
      { name: 'רומנטיקה', color: '#45B7D1' },
      { name: 'פנטזיה', color: '#96CEB4' },
      { name: 'מכה', color: '#FFEAA7' },
      { name: 'דרמה', color: '#DDA0DD' }
    ];

    let categoriesAdded = 0;
    for (const category of categories) {
      try {
        const result = await db.query(
          'INSERT INTO categories (name, color) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING RETURNING id',
          [category.name, category.color]
        );
        if (result.rows.length > 0) categoriesAdded++;
      } catch (error) {
        console.warn(`Failed to insert category ${category.name}:`, error);
      }
    }

    // Insert default admin user if not exists
    const userCheck = await db.query('SELECT COUNT(*) FROM users WHERE email = $1', ['admin@anime-forum.com']);
    let adminAdded = false;
    
    if (parseInt(userCheck.rows[0].count) === 0) {
      const bcrypt = require('bcryptjs');
      const defaultPassword = await bcrypt.hash('123456', 12);
      
      try {
        await db.query(`
          INSERT INTO users (username, email, password, avatar, role, bio, cover_image, posts_count, likes_count) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
          'Admin',
          'admin@anime-forum.com',
          defaultPassword,
          'https://via.placeholder.com/100x100/6366F1/FFFFFF?text=AD',
          'admin',
          'מנהל האתר',
          'https://via.placeholder.com/800x200/4F46E5/FFFFFF?text=Admin',
          0,
          0
        ]);
        adminAdded = true;
      } catch (error) {
        console.warn('Failed to create admin user:', error);
      }
    }

    // Verify seeding
    const verification = await verifySeed();
    
    console.log('🎉 Database seeding completed!');
    
    return {
      success: true,
      message: `Seeding completed! Added ${categoriesAdded} categories, admin user: ${adminAdded ? 'created' : 'already exists'}`,
      details: verification
    };

  } catch (error: any) {
    console.error('❌ Database seeding failed:', error);
    return {
      success: false,
      message: 'Database seeding failed: ' + error.message
    };
  }
}

async function verifySeed(): Promise<any> {
  try {
    const categoriesCount = await db.query('SELECT COUNT(*) FROM categories');
    const usersCount = await db.query('SELECT COUNT(*) FROM users');
    const postsCount = await db.query('SELECT COUNT(*) FROM posts');

    const categories = await db.query('SELECT name, color FROM categories ORDER BY name');
    const users = await db.query('SELECT username, email, role FROM users');

    return {
      counts: {
        categories: parseInt(categoriesCount.rows[0].count),
        users: parseInt(usersCount.rows[0].count),
        posts: parseInt(postsCount.rows[0].count)
      },
      data: {
        categories: categories.rows,
        users: users.rows.map((u: any) => ({ username: u.username, email: u.email, role: u.role }))
      }
    };
  } catch (error: any) {
    return { error: error.message };
  }
}