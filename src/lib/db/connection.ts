// src/lib/db/connection.ts
import { Pool, PoolClient } from 'pg';

// הגדרת pool עם טיפוסים נכונים
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'anime_forum',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Event listeners
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err: Error) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

// Export DB object with proper types
export const db = {
  async query(text: string, params?: any[]) {
    const client: PoolClient = await pool.connect();
    try {
      const start = Date.now();
      const result = await client.query(text, params);
      const duration = Date.now() - start;
      console.log('🔍 Executed query', { text, duration, rows: result.rowCount });
      return result;
    } finally {
      client.release();
    }
  },

  async getClient(): Promise<PoolClient> {
    return await pool.connect();
  },

  async end() {
    return await pool.end();
  }
};

// פונקציה לבדיקת חיבור
export async function testConnection(): Promise<boolean> {
  try {
    const result = await db.query('SELECT NOW() as current_time');
    console.log('🎉 Database connection successful!', result.rows[0]);
    return true;
  } catch (error) {
    console.error('💥 Database connection failed:', error);
    return false;
  }
}

// 3. וודא שיש לך את החבילות הנכונות
// package.json dependencies שצריכות להיות:
/*
{
  "dependencies": {
    "pg": "^8.11.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "@types/pg": "^8.10.9",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5"
  }
}
*/

// 4. צור קובץ types נפרד אם צריך
// src/app/types/index.ts
export interface ForumPostData {
  id: number;
  title: string;
  content: string;
  author: string;
  authorId?: number;
  likes: number;
  replies: number;
  time: string;
  category: string;
  postImage?: string;
  avatar?: string;
}

export interface ThemeClasses {
  bg: string;
  cardBg: string;
  text: string;
  textSecondary: string;
  border: string;
  hover: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  joinDate: string;
  postsCount: number;
  likesCount: number;
}