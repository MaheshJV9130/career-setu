import { connectDB } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { UserRoadmap } from '@/models/UserRoadmap'
import { Career } from '@/models/Career'
import { ok, fail } from '@/lib/api-response'
import mongoose from 'mongoose'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ careerId: string }> }
) {
  const user = await getCurrentUser()
  if (!user) return fail('Authentication required.', 401)

  try {
    const { careerId } = await params
    if (!careerId) return fail('Career ID is required.', 400)

    await connectDB()

    const isObjectId = mongoose.Types.ObjectId.isValid(careerId)
    const career = await Career.findOne(
      isObjectId ? { $or: [{ _id: careerId }, { slug: careerId }] } : { slug: careerId }
    ).lean()

    if (!career) return fail('Career not found.', 404)

    let roadmap = await UserRoadmap.findOne({ user: user.id, career: career._id })
      .populate('career')
      .lean()

    // If user hasn't enrolled yet, initialize it
    if (!roadmap) {
      const copiedSteps = (career.roadmap || []).map((step) => ({
        stepNumber: step.stepNumber,
        title: step.title,
        description: step.description,
        skills: step.skills,
        estimatedDuration: step.estimatedDuration,
        completed: false,
        completedAt: null,
      }))

      const created = await UserRoadmap.create({
        user: user.id,
        career: career._id,
        steps: copiedSteps,
        overallProgress: 0,
        startedAt: new Date(),
      })

      roadmap = await UserRoadmap.findById(created._id).populate('career').lean()
    }

    return ok({ roadmap, career }, 'Career roadmap retrieved')
  } catch (error) {
    console.error('[roadmap-career-get]', error)
    return fail('Unable to fetch roadmap.', 500)
  }
}
