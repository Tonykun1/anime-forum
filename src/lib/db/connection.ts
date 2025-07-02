// src/lib/db/connection.ts
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'anime_forum',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
  // אפשרויות נוספות:
  max: 20, // מקסימום חיבורים
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// פונקציה לבדיקת חיבור
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

export const db = {
  async query(text: string, params?: any[]) {
    const client = await pool.connect();
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

  async getClient() {
    return await pool.connect();
  },

  async end() {
    return await pool.end();
  }
};

// פונקציה לבדיקת חיבור
export async function testConnection() {
  try {
    const result = await db.query('SELECT NOW() as current_time');
    console.log('🎉 Database connection successful!', result.rows[0]);
    return true;
  } catch (error) {
    console.error('💥 Database connection failed:', error);
    return false;
  }
}