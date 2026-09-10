import { z } from 'zod'

export const signupSchema = z.object({ name: z.string().trim().min(2).max(100), email: z.string().trim().toLowerCase().email(), password: z.string().min(6).max(100) })
export const loginSchema = z.object({ email: z.string().trim().toLowerCase().email(), password: z.string().min(1) })

export const studentProfileSchema = z.object({
  age: z.number().int().min(13).max(100).optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  location: z.string().trim().max(120).optional(), district: z.string().trim().max(120).optional(), state: z.string().trim().max(120).optional(),
  educationLevel: z.enum(['class_10', 'class_12', 'diploma', 'undergraduate', 'postgraduate', 'other']).optional(),
  currentCourse: z.string().trim().max(160).optional(), institution: z.string().trim().max(160).optional(), stream: z.string().trim().max(120).optional(),
  subjects: z.array(z.string().trim().max(80)).max(30).optional(), interests: z.array(z.string().trim().max(80)).max(30).optional(), careerGoals: z.array(z.string().trim().max(120)).max(20).optional(),
})

export type StudentProfileInput = z.infer<typeof studentProfileSchema>
