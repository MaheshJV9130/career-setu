import { connectDB } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { CareerReadiness } from '@/models/CareerReadiness'
import { Career } from '@/models/Career'
import { careerReadinessSchema } from '@/lib/validators'
import { ok, fail } from '@/lib/api-response'
import mongoose from 'mongoose'

const LEVEL_POINTS: Record<string, number> = {
  beginner: 30,
  intermediate: 65,
  advanced: 100,
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return fail('Authentication required.', 401)

  try {
    const body = await request.json()
    const parsed = careerReadinessSchema.safeParse(body)
    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || 'Please provide valid skill ratings.'
      return fail(errorMsg, 400, parsed.error.issues)
    }

    await connectDB()

    const isObjectId = mongoose.Types.ObjectId.isValid(parsed.data.careerId)
    const career = await Career.findOne(
      isObjectId
        ? { $or: [{ _id: parsed.data.careerId }, { slug: parsed.data.careerId }] }
        : { slug: parsed.data.careerId }
    ).lean()

    if (!career) {
      return fail('Career not found.', 404)
    }

    const assessedSkills = parsed.data.skillAssessments.map((item) => {
      const dbSkill = career.skills.find(
        (s) => s.name.toLowerCase() === item.skillName.toLowerCase()
      )
      const requiredLevel = dbSkill?.requiredLevel || 'intermediate'
      const userLevel = item.userLevel

      const reqPts = LEVEL_POINTS[requiredLevel]
      const userPts = LEVEL_POINTS[userLevel]

      let score: number
      if (userPts >= reqPts) {
        score = Math.min(100, Math.round(80 + (userPts - reqPts) * 0.4 + (userPts / 100) * 15))
      } else {
        // Skill gap penalty
        score = Math.round((userPts / reqPts) * 70)
      }

      let status = 'Good'
      if (score < 50) {
        status = 'Priority'
      } else if (score < 75) {
        status = 'Needs improvement'
      }

      return {
        skillName: item.skillName,
        requiredLevel,
        userLevel,
        score,
        status,
      }
    })

    const overallScore = Math.round(
      assessedSkills.reduce((sum, s) => sum + s.score, 0) / (assessedSkills.length || 1)
    )

    let status: 'Needs Major Improvement' | 'Developing' | 'Good' | 'Career Ready'
    if (overallScore <= 40) {
      status = 'Needs Major Improvement'
    } else if (overallScore <= 70) {
      status = 'Developing'
    } else if (overallScore <= 85) {
      status = 'Good'
    } else {
      status = 'Career Ready'
    }

    // Generate actionable recommendations
    const recommendations: string[] = []
    const weakSkills = assessedSkills.filter((s) => s.status === 'Priority' || s.status === 'Needs improvement')
    for (const ws of weakSkills.slice(0, 3)) {
      recommendations.push(`Complete dedicated practice modules in ${ws.skillName} to advance from ${ws.userLevel} to ${ws.requiredLevel}.`)
    }
    recommendations.push('Build 1-2 practical portfolio projects demonstrating your core skills.')
    recommendations.push('Review verified learning resources on the platform to strengthen fundamentals.')

    const saved = await CareerReadiness.findOneAndUpdate(
      { user: user.id, career: career._id },
      {
        user: user.id,
        career: career._id,
        skillAssessments: assessedSkills,
        overallScore,
        status,
        recommendations,
      },
      { upsert: true, new: true, runValidators: true }
    ).lean()

    return ok(
      {
        readiness: saved,
        career: { id: career._id, title: career.title, slug: career.slug },
      },
      'Career readiness evaluated successfully',
      201
    )
  } catch (error) {
    console.error('[readiness-post]', error)
    return fail('Unable to evaluate career readiness.', 500)
  }
}

export async function GET(request: Request) {
  const user = await getCurrentUser()
  if (!user) return fail('Authentication required.', 401)

  try {
    const { searchParams } = new URL(request.url)
    const careerId = searchParams.get('careerId')

    await connectDB()

    const query: Record<string, unknown> = { user: user.id }
    if (careerId) {
      const isObjectId = mongoose.Types.ObjectId.isValid(careerId)
      if (isObjectId) {
        query.career = careerId
      } else {
        const foundCareer = await Career.findOne({ slug: careerId }).select('_id').lean()
        if (foundCareer) query.career = foundCareer._id
      }
    }

    const readiness = await CareerReadiness.findOne(query)
      .sort({ updatedAt: -1 })
      .populate('career')
      .lean()

    return ok({ readiness: readiness || null }, 'Latest career readiness retrieved')
  } catch (error) {
    console.error('[readiness-get]', error)
    return fail('Unable to fetch career readiness.', 500)
  }
}
