import mongoose, { Schema, Model, Document } from 'mongoose'

export interface IGovernmentScheme extends Document {
  title: string
  description: string
  provider: string
  officialUrl: string
  states: string[]
  educationLevels: string[]
  categories: string[]
  gender: string // 'all' | 'female' | 'male' | 'other'
  incomeLimit?: number | null // annual family income in INR
  courseTypes: string[]
  isOfficial: boolean
  lastVerified: Date
  createdAt: Date
  updatedAt: Date
}

const GovernmentSchemeSchema = new Schema<IGovernmentScheme>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    provider: { type: String, required: true, trim: true },
    officialUrl: { type: String, required: true, trim: true },
    states: { type: [String], default: ['All India'] },
    educationLevels: { type: [String], default: [] },
    categories: { type: [String], default: ['All'] }, // 'General', 'OBC', 'SC', 'ST', 'EWS', 'All'
    gender: { type: String, default: 'all' },
    incomeLimit: { type: Number, default: null },
    courseTypes: { type: [String], default: [] },
    isOfficial: { type: Boolean, default: true },
    lastVerified: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

export const GovernmentScheme: Model<IGovernmentScheme> =
  mongoose.models.GovernmentScheme ||
  mongoose.model<IGovernmentScheme>('GovernmentScheme', GovernmentSchemeSchema)
