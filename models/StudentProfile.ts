import mongoose, { Schema, type InferSchemaType } from 'mongoose'

const studentProfileSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  age: { type: Number, min: 13, max: 100 },
  gender: { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say'] },
  location: { type: String, trim: true }, district: { type: String, trim: true }, state: { type: String, trim: true },
  educationLevel: { type: String, enum: ['class_10', 'class_12', 'diploma', 'undergraduate', 'postgraduate', 'other'] },
  currentCourse: { type: String, trim: true }, institution: { type: String, trim: true }, stream: { type: String, trim: true },
  subjects: { type: [String], default: [] }, interests: { type: [String], default: [] }, careerGoals: { type: [String], default: [] },
  profileCompleted: { type: Boolean, default: false },
}, { timestamps: true })

export type StudentProfileDocument = InferSchemaType<typeof studentProfileSchema> & { _id: mongoose.Types.ObjectId }
export const StudentProfile = mongoose.models.StudentProfile || mongoose.model('StudentProfile', studentProfileSchema)
