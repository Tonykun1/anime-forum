// src/lib/db/schema.ts - טבלה מתוקנת עם כל השדות הנדרשים
export const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(500),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'editor', 'admin')),
    bio TEXT,
    cover_image VARCHAR(500),
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
    color VARCHAR(7) DEFAULT '#6366F1'
  );
`;

export const createPostsTable = `
  CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    category_id INTEGER REFERENCES categories(id),
    author_id INTEGER REFERENCES users(id) DEFAULT 1,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

// פונקציה לעדכון הטבלה הקיימת (אם יש)
export const updateUsersTable = `
  DO $$ 
  BEGIN
    -- הוספת עמודות חסרות אם הן לא קיימות
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='password') THEN
      ALTER TABLE users ADD COLUMN password VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='role') THEN
      ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='avatar') THEN
      ALTER TABLE users ADD COLUMN avatar VARCHAR(500);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='bio') THEN
      ALTER TABLE users ADD COLUMN bio TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='cover_image') THEN
      ALTER TABLE users ADD COLUMN cover_image VARCHAR(500);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='posts_count') THEN
      ALTER TABLE users ADD COLUMN posts_count INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='likes_count') THEN
      ALTER TABLE users ADD COLUMN likes_count INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='updated_at') THEN
      ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
    
    -- הוספת constraints אם חסרים
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name='users' AND constraint_name='users_username_key') THEN
      ALTER TABLE users ADD CONSTRAINT users_username_key UNIQUE (username);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name='users_role_check') THEN
      ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'editor', 'admin'));
    END IF;
  END $$;
`;

export const allTables = [
  createUsersTable,
  createCategoriesTable,
  createPostsTable
];

export const tableUpdates = [
  updateUsersTable
];