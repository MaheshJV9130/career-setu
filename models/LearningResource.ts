import mongoose, { Schema, Model, Document } from 'mongoose'

export interface ILearningResource extends Document {
  title: string
  description: string
  url: string
  platform: string
  category?: string
  career?: mongoose.Types.ObjectId | string
  skills: string[]
  level: 'beginner' | 'intermediate' | 'advanced' | 'all'
  language: string
  isFree: boolean
  isOfficial: boolean
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

const LearningResourceSchema = new Schema<ILearningResource>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    url: { type: String, required: true, trim: true },
    platform: { type: String, required: true, trim: true },
    category: { type: String, default: 'General' },
    career: { type: Schema.Types.Mixed }, // Can reference Career ObjectId or category string
    skills: { type: [String], default: [] },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'all'],
      default: 'all',
    },
    language: { type: String, default: 'English' },
    isFree: { type: Boolean, default: true },
    isOfficial: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export const LearningResource: Model<ILearningResource> =
  mongoose.models.LearningResource ||
  mongoose.model<ILearningResource>('LearningResource', LearningResourceSchema)
