import { connectDB } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { StudentProfile } from '@/models/StudentProfile'
import { studentProfileSchema } from '@/lib/validators'
import { calculateProfileCompletion } from '@/lib/profile'
import { fail, ok } from '@/lib/api-response'

export async function GET() {
  const session = await getSession(); if (!session) return fail('Unauthorized', 401)
  try { await connectDB(); const profile = await StudentProfile.findOne({ user: session.userId }).lean(); return ok({ profile: profile ?? null, completion: calculateProfileCompletion(profile ?? {}) }) } catch { return fail('Unable to load profile.', 500) }
}

async function save(request: Request) {
  const session = await getSession(); if (!session) return fail('Unauthorized', 401)
  const parsed = studentProfileSchema.safeParse(await request.json()); if (!parsed.success) return fail('Please check your profile details.', 400)
  try {
    await connectDB(); const completion = calculateProfileCompletion(parsed.data)
    const profile = await StudentProfile.findOneAndUpdate({ user: session.userId }, { ...parsed.data, profileCompleted: completion.completed }, { upsert: true, new: true, runValidators: true }).lean()
    return ok({ message: 'Profile saved successfully', profile, completion })
  } catch { return fail('Unable to save profile.', 500) }
}
export const POST = save
export const PUT = save
