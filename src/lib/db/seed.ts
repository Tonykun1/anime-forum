// src/lib/db/seed.ts - Updated seed data with authentication
export const seedCategories = `
  INSERT INTO categories (name, color) VALUES
  ('דיונים', '#3B82F6'),
  ('ביקורות', '#10B981'),
  ('המלצות', '#F59E0B'),
  ('שאלות', '#8B5CF6'),
  ('חדשות', '#EF4444'),
  ('מימים', '#EC4899')
  ON CONFLICT (name) DO NOTHING;
`;

// Note: For demo purposes only - in production, passwords should be properly hashed
// This creates a default user with a hashed password for "123456"
export const seedUsers = `
  INSERT INTO users (username, email, password_hash, role) VALUES
  ('משתמש_ברירת_מחדל', 'demo@example.com', '$2a$10$LQ2rLwGIyWlgXBfUyPwKguUAjl8E6yIn9G7jdLKUqByK.2vYZxOHa', 'user')
  ON CONFLICT (email) DO NOTHING;
`;

export const seedPosts = `
  INSERT INTO posts (title, content, author_id, category_id, likes_count, comments_count, views_count) VALUES
  (
    'ברוכים הבאים לפורום האנימה!',
    'זהו הפוסט הראשון בפורום שלנו. כאן תוכלו לדון, לשתף ביקורות ולקבל המלצות על אנימות. אנו מקווים שתיהנו כאן ותמצאו תוכן מעניין וקהילה חמה.',
    1,
    1,
    5,
    3,
    120
  ),
  (
    'איך לכתוב ביקורת איכותית?',
    'כמה טיפים לכתיבת ביקורות טובות: 1. היו ספציפיים ולא כלליים 2. הימנעו מספוילרים 3. דברו על הכוחות והחולשות 4. תנו דירוג הוגן. מה הטיפים שלכם?',
    1,
    2,
    12,
    8,
    89
  ),
  (
    'המלצות לאנימות עם עלילה מורכבת',
    'אני מחפש אנימות עם עלילה מורכבת ועמוקה. משהו שיגרום לי לחשוב. כבר צפיתי ב-Death Note, Steins;Gate ו-Monster. יש לכם המלצות נוספות?',
    1,
    3,
    18,
    15,
    234
  )
  ON CONFLICT DO NOTHING;
`;

export const allSeedData = [
  seedCategories,
  seedUsers,
  seedPosts
];