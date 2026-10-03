import { connectDB } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { StudentProfile } from '@/models/StudentProfile'
import { studentProfileSchema } from '@/lib/validators'
import { calculateProfileCompletion } from '@/lib/profile'
import { ok, fail } from '@/lib/api-response'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return fail('Authentication required.', 401)

  try {
    await connectDB()
    const profile = await StudentProfile.findOne({ user: user.id }).lean()
    const completion = calculateProfileCompletion(profile || {})

    return ok(
      {
        profile: profile || null,
        completion,
      },
      'Profile retrieved successfully'
    )
  } catch (error) {
    console.error('[profile-get]', error)
    return fail('Unable to load profile at this time.', 500)
  }
}

async function handleSave(request: Request) {
  const user = await getCurrentUser()
  if (!user) return fail('Authentication required.', 401)

  try {
    const body = await request.json()

    // Clean out forbidden fields if sent by client
    delete body.user
    delete body.role
    delete body.createdAt
    delete body.updatedAt
    delete body._id

    const parsed = studentProfileSchema.safeParse(body)
    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || 'Please check your profile details.'
      return fail(errorMsg, 400, parsed.error.issues)
    }

    await connectDB()

    const completion = calculateProfileCompletion(parsed.data)

    const updatedProfile = await StudentProfile.findOneAndUpdate(
      { user: user.id },
      {
        ...parsed.data,
        user: user.id,
        profileCompleted: completion.completed,
        profileCompletion: completion.percentage,
      },
      { upsert: true, new: true, runValidators: true }
    ).lean()

    return ok(
      {
        profile: updatedProfile,
        completion,
      },
      'Profile saved successfully'
    )
  } catch (error) {
    console.error('[profile-save]', error)
    return fail('Unable to save profile right now.', 500)
  }
}

export const POST = handleSave
export const PUT = handleSave
