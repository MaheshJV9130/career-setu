import { z } from 'zod'

export const signupSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().trim().toLowerCase().email('Please provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password is too long'),
})

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please provide a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const studentProfileSchema = z.object({
  age: z.coerce.number().int().min(10).max(100).optional().nullable(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional().nullable(),
  location: z.string().trim().max(120).optional().nullable(),
  district: z.string().trim().max(120).optional().nullable(),
  state: z.string().trim().max(120).optional().nullable(),
  educationLevel: z.enum(['class_10', 'class_12', 'diploma', 'undergraduate', 'postgraduate', 'other']).optional().nullable(),
  currentCourse: z.string().trim().max(160).optional().nullable(),
  institution: z.string().trim().max(160).optional().nullable(),
  stream: z.string().trim().max(120).optional().nullable(),
  subjects: z.array(z.string().trim().max(80)).max(30).optional().default([]),
  interests: z.array(z.string().trim().max(80)).max(30).optional().default([]),
  careerGoals: z.array(z.string().trim().max(120)).max(20).optional().default([]),
})

export const passionAssessmentAnswerSchema = z.object({
  questionId: z.number().int().min(1).max(10),
  selectedOption: z.string().trim().min(1),
})

export const passionAssessmentSchema = z.object({
  answers: z.array(passionAssessmentAnswerSchema).length(10, 'All 10 questions must be answered'),
})

export const careerReadinessSchema = z.object({
  careerId: z.string().min(1, 'Career ID is required'),
  skillAssessments: z.array(
    z.object({
      skillName: z.string().min(1),
      userLevel: z.enum(['beginner', 'intermediate', 'advanced']),
    })
  ).min(1, 'At least one skill must be assessed'),
})

export const roadmapUpdateSchema = z.object({
  careerId: z.string().min(1, 'Career ID is required'),
  stepNumber: z.number().int().min(1),
  completed: z.boolean(),
})

export const schemeCheckerSchema = z.object({
  state: z.string().optional().nullable(),
  educationLevel: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  incomeLimit: z.coerce.number().optional().nullable(),
  gender: z.string().optional().nullable(),
  courseType: z.string().optional().nullable(),
})

export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type StudentProfileInput = z.infer<typeof studentProfileSchema>
export type PassionAssessmentInput = z.infer<typeof passionAssessmentSchema>
export type CareerReadinessInput = z.infer<typeof careerReadinessSchema>
export type RoadmapUpdateInput = z.infer<typeof roadmapUpdateSchema>
export type SchemeCheckerInput = z.infer<typeof schemeCheckerSchema>
