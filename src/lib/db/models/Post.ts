// lib/db/models/Post.ts - Post model
import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  imageUrl?: string;
  author: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000
  },
  imageUrl: {
    type: String,
    default: null
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  likesCount: {
    type: Number,
    default: 0,
    min: 0
  },
  commentsCount: {
    type: Number,
    default: 0,
    min: 0
  },
  viewsCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Add indexes for better performance
PostSchema.index({ createdAt: -1 });
PostSchema.index({ author: 1 });
PostSchema.index({ category: 1 });

export const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
