import { connectDB } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { UserRoadmap } from '@/models/UserRoadmap'
import { Career } from '@/models/Career'
import { roadmapUpdateSchema } from '@/lib/validators'
import { ok, fail } from '@/lib/api-response'
import mongoose from 'mongoose'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return fail('Authentication required.', 401)

  try {
    await connectDB()
    const roadmaps = await UserRoadmap.find({ user: user.id })
      .populate('career')
      .sort({ updatedAt: -1 })
      .lean()

    const activeRoadmap = roadmaps[0] || null

    return ok(
      {
        roadmaps,
        activeRoadmap,
      },
      'User roadmaps retrieved'
    )
  } catch (error) {
    console.error('[roadmaps-get]', error)
    return fail('Unable to fetch roadmaps.', 500)
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return fail('Authentication required.', 401)

  try {
    const body = await request.json()
    const careerId = body.careerId
    if (!careerId) return fail('Career ID is required.', 400)

    await connectDB()

    const isObjectId = mongoose.Types.ObjectId.isValid(careerId)
    const career = await Career.findOne(
      isObjectId ? { $or: [{ _id: careerId }, { slug: careerId }] } : { slug: careerId }
    ).lean()

    if (!career) return fail('Career not found.', 404)

    // Check if user already has this roadmap
    let userRoadmap = await UserRoadmap.findOne({ user: user.id, career: career._id })

    if (!userRoadmap) {
      // Copy steps from Career template
      const copiedSteps = (career.roadmap || []).map((step) => ({
        stepNumber: step.stepNumber,
        title: step.title,
        description: step.description,
        skills: step.skills,
        estimatedDuration: step.estimatedDuration,
        completed: false,
        completedAt: null,
      }))

      userRoadmap = await UserRoadmap.create({
        user: user.id,
        career: career._id,
        steps: copiedSteps,
        overallProgress: 0,
        startedAt: new Date(),
      })
    }

    return ok(
      {
        roadmap: userRoadmap,
        career: { id: career._id, title: career.title, slug: career.slug },
      },
      'Roadmap initialized successfully',
      201
    )
  } catch (error) {
    console.error('[roadmaps-post]', error)
    return fail('Unable to initialize roadmap.', 500)
  }
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser()
  if (!user) return fail('Authentication required.', 401)

  try {
    const body = await request.json()
    const parsed = roadmapUpdateSchema.safeParse(body)
    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || 'Invalid step update.'
      return fail(errorMsg, 400, parsed.error.issues)
    }

    await connectDB()

    const isObjectId = mongoose.Types.ObjectId.isValid(parsed.data.careerId)
    let careerId = parsed.data.careerId
    if (!isObjectId) {
      const found = await Career.findOne({ slug: parsed.data.careerId }).select('_id').lean()
      if (!found) return fail('Career not found.', 404)
      careerId = found._id.toString()
    }

    const userRoadmap = await UserRoadmap.findOne({ user: user.id, career: careerId })
    if (!userRoadmap) {
      return fail('Roadmap not found for this career. Please start the roadmap first.', 404)
    }

    const targetStep = userRoadmap.steps.find((s) => s.stepNumber === parsed.data.stepNumber)
    if (!targetStep) {
      return fail('Roadmap step not found.', 404)
    }

    targetStep.completed = parsed.data.completed
    targetStep.completedAt = parsed.data.completed ? new Date() : null

    // Recalculate progress
    const completedCount = userRoadmap.steps.filter((s) => s.completed).length
    const totalSteps = userRoadmap.steps.length || 1
    userRoadmap.overallProgress = Math.round((completedCount / totalSteps) * 100)

    await userRoadmap.save()

    return ok(
      {
        roadmap: userRoadmap,
        overallProgress: userRoadmap.overallProgress,
        completedCount,
        totalSteps,
      },
      'Roadmap progress updated'
    )
  } catch (error) {
    console.error('[roadmaps-patch]', error)
    return fail('Unable to update roadmap progress.', 500)
  }
}
