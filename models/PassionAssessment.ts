import mongoose, { Schema, Model, Document } from 'mongoose'

export interface IAssessmentAnswer {
  questionId: number
  selectedOption: string
}

export interface ICareerMatch {
  career: mongoose.Types.ObjectId | string
  title: string
  slug?: string
  score: number
  matchPercentage: number
  reasons: string[]
}

export interface IPassionAssessment extends Document {
  user: mongoose.Types.ObjectId
  answers: IAssessmentAnswer[]
  careerMatches: ICareerMatch[]
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

const AnswerSchema = new Schema<IAssessmentAnswer>(
  {
    questionId: { type: Number, required: true },
    selectedOption: { type: String, required: true },
  },
  { _id: false }
)

const CareerMatchSchema = new Schema<ICareerMatch>(
  {
    career: { type: Schema.Types.ObjectId, ref: 'Career' },
    title: { type: String, required: true },
    slug: { type: String },
    score: { type: Number, required: true },
    matchPercentage: { type: Number, required: true },
    reasons: { type: [String], default: [] },
  },
  { _id: false }
)

const PassionAssessmentSchema = new Schema<IPassionAssessment>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    answers: { type: [AnswerSchema], required: true },
    careerMatches: { type: [CareerMatchSchema], default: [] },
    completed: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export const PassionAssessment: Model<IPassionAssessment> =
  mongoose.models.PassionAssessment ||
  mongoose.model<IPassionAssessment>('PassionAssessment', PassionAssessmentSchema)
