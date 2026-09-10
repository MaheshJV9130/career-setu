import mongoose, { Model, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends mongoose.Document {
  name: string
  email: string
  password: string
  role: 'student' | 'admin'
  status: 'active' | 'inactive'
  comparePassword(candidate: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, minlength: 2, maxlength: 100, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true })

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 12)
})

UserSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password)
}

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
