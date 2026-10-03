import mongoose, { Schema, Model, Document } from 'mongoose'

export interface IUserRoadmapStep {
  stepNumber: number
  title: string
  description?: string
  skills?: string[]
  estimatedDuration?: string
  completed: boolean
  completedAt?: Date | null
}

export interface IUserRoadmap extends Document {
  user: mongoose.Types.ObjectId
  career: mongoose.Types.ObjectId
  steps: IUserRoadmapStep[]
  overallProgress: number
  startedAt: Date
  createdAt: Date
  updatedAt: Date
}

const UserRoadmapStepSchema = new Schema<IUserRoadmapStep>(
  {
    stepNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    skills: { type: [String], default: [] },
    estimatedDuration: { type: String, default: '' },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
  },
  { _id: false }
)

const UserRoadmapSchema = new Schema<IUserRoadmap>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    career: { type: Schema.Types.ObjectId, ref: 'Career', required: true },
    steps: { type: [UserRoadmapStepSchema], default: [] },
    overallProgress: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

// Compound index to ensure one roadmap per user-career pair
UserRoadmapSchema.index({ user: 1, career: 1 }, { unique: true })

export const UserRoadmap: Model<IUserRoadmap> =
  mongoose.models.UserRoadmap ||
  mongoose.model<IUserRoadmap>('UserRoadmap', UserRoadmapSchema)
