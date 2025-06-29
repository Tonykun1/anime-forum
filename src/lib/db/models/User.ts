// src/lib/db/models/User.ts - עם export של interface
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  role: 'user' | 'editor' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// מחק את המודל הקיים לפני יצירת חדש
if (mongoose.models.User) {
  delete mongoose.models.User;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  avatar: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'editor', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// הצפנת סיסמה לפני שמירה
UserSchema.pre('save', async function(next) {
  console.log('🔐 Pre-save hook triggered for user:', this.username);
  
  if (!this.isModified('password')) {
    console.log('🔐 Password not modified, skipping encryption');
    return next();
  }
  
  try {
    console.log('🔐 Encrypting password for user:', this.username);
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('✅ Password encrypted successfully');
    next();
  } catch (error: any) {
    console.error('❌ Error encrypting password:', error);
    next(error);
  }
});

// השוואת סיסמה
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  console.log('🔍 Comparing password for user:', this.username);
  try {
    const result = await bcrypt.compare(candidatePassword, this.password);
    console.log('🔍 Password comparison result:', result);
    return result;
  } catch (error) {
    console.error('❌ Error comparing passwords:', error);
    return false;
  }
};

// ייצוא המודל והinterface
export const User = mongoose.model<IUser>('User', UserSchema);