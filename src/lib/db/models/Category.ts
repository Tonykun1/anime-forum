import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  color: string;
  createdAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 50
  },
  color: {
    type: String,
    default: '#6366F1',
    match: /^#[0-9A-F]{6}$/i
  }
}, {
  timestamps: true
});

export const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);