import mongoose, { Schema, Model, Document } from 'mongoose'

export interface ISkillAssessment {
  skillName: string
  requiredLevel: 'beginner' | 'intermediate' | 'advanced'
  userLevel: 'beginner' | 'intermediate' | 'advanced'
  score: number
  status: string
}

export interface ICareerReadiness extends Document {
  user: mongoose.Types.ObjectId
  career: mongoose.Types.ObjectId
  skillAssessments: ISkillAssessment[]
  overallScore: number
  status: 'Needs Major Improvement' | 'Developing' | 'Good' | 'Career Ready'
  recommendations: string[]
  createdAt: Date
  updatedAt: Date
}

const SkillAssessmentSchema = new Schema<ISkillAssessment>(
  {
    skillName: { type: String, required: true },
    requiredLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    userLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    score: { type: Number, required: true },
    status: { type: String, required: true },
  },
  { _id: false }
)

const CareerReadinessSchema = new Schema<ICareerReadiness>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    career: { type: Schema.Types.ObjectId, ref: 'Career', required: true },
    skillAssessments: { type: [SkillAssessmentSchema], default: [] },
    overallScore: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Needs Major Improvement', 'Developing', 'Good', 'Career Ready'],
      required: true,
    },
    recommendations: { type: [String], default: [] },
  },
  { timestamps: true }
)

export const CareerReadiness: Model<ICareerReadiness> =
  mongoose.models.CareerReadiness ||
  mongoose.model<ICareerReadiness>('CareerReadiness', CareerReadinessSchema)
