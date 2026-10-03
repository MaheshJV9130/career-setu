import mongoose, { Schema, Model, Document } from 'mongoose'

export interface ICareerSkill {
  name: string
  description?: string
  importance: 'low' | 'medium' | 'high'
  requiredLevel: 'beginner' | 'intermediate' | 'advanced'
}

export interface ICareerRoadmapStep {
  stepNumber: number
  title: string
  description: string
  skills: string[]
  estimatedDuration?: string
}

export interface ICareer extends Document {
  title: string
  slug: string
  description: string
  category: string
  educationRequirements: string[]
  skills: ICareerSkill[]
  roadmap: ICareerRoadmapStep[]
  growthLevel?: string
  difficulty?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const CareerSkillSchema = new Schema<ICareerSkill>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    importance: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    requiredLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
  },
  { _id: false }
)

const CareerRoadmapStepSchema = new Schema<ICareerRoadmapStep>(
  {
    stepNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    skills: { type: [String], default: [] },
    estimatedDuration: { type: String, default: '4-6 weeks' },
  },
  { _id: false }
)

const CareerSchema = new Schema<ICareer>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    educationRequirements: { type: [String], default: [] },
    skills: { type: [CareerSkillSchema], default: [] },
    roadmap: { type: [CareerRoadmapStepSchema], default: [] },
    growthLevel: { type: String, default: 'High' },
    difficulty: { type: String, default: 'Moderate' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export const Career: Model<ICareer> =
  mongoose.models.Career || mongoose.model<ICareer>('Career', CareerSchema)
