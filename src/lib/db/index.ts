// lib/db/index.ts - Main exports for MongoDB
export { connectDB } from './connection';
export { setupDatabase, checkIfSetupNeeded, verifySetup } from './setup';
export { seedDatabase } from './seed';
export { User } from './models/User';
export { Category } from './models/Category';
export { Post } from './models/Post';

// Types
export type { IUser } from './models/User';
export type { ICategory } from './models/Category';
export type { IPost } from './models/Post';