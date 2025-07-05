//lib/db/schema.ts - הוסף כל השדות הנדרשים
export const createUsersTable = `
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
`;

export const createCategoriesTable = `
  CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(7) DEFAULT '#6366F1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

export const createPostsTable = `
  CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    category_id INTEGER REFERENCES categories(id),
    author_id INTEGER REFERENCES users(id),
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

// עדכון טבלאות קיימות - זה מה שחסר!
export const tableUpdates = [
  // הוסף עמודות לטבלת users אם לא קיימות
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT;`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS cover_image TEXT;`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS posts_count INTEGER DEFAULT 0;`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`,
  
  // הוסף unique constraint אם לא קיים
  `ALTER TABLE users ADD CONSTRAINT users_username_unique UNIQUE (username) ON CONFLICT DO NOTHING;`,
  
  // עדכן author_id להפנות למשתמשים אמיתיים
  `ALTER TABLE posts ALTER COLUMN author_id SET NOT NULL;`,
  `ALTER TABLE posts ADD CONSTRAINT posts_author_fk FOREIGN KEY (author_id) REFERENCES users(id) ON CONFLICT DO NOTHING;`
];

export const allTables = [
  createUsersTable,
  createCategoriesTable,
  createPostsTable
];