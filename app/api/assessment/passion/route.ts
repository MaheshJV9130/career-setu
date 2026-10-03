import { connectDB } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { PassionAssessment } from '@/models/PassionAssessment'
import { Career } from '@/models/Career'
import { passionAssessmentSchema } from '@/lib/validators'
import { calculateCareerMatches } from '@/lib/passion-engine'
import { ok, fail } from '@/lib/api-response'

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return fail('Authentication required.', 401)

  try {
    const body = await request.json()
    const parsed = passionAssessmentSchema.safeParse(body)
    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || 'Please answer all 10 questions.'
      return fail(errorMsg, 400, parsed.error.issues)
    }

    await connectDB()

    const dbCareers = await Career.find({ isActive: true }).lean()
    const topMatches = calculateCareerMatches(parsed.data.answers, dbCareers as any)

    // Map matches to include valid ObjectIds where available
    const mappedMatches = topMatches.map((m) => {
      const dbMatch = dbCareers.find((c) => c.slug === m.slug || c.title.toLowerCase() === m.title.toLowerCase())
      return {
        career: dbMatch ? dbMatch._id : undefined,
        title: m.title,
        slug: m.slug,
        score: m.score,
        matchPercentage: m.matchPercentage,
        reasons: m.reasons,
      }
    })

    const assessment = await PassionAssessment.create({
      user: user.id,
      answers: parsed.data.answers,
      careerMatches: mappedMatches,
      completed: true,
    })

    return ok(
      {
        assessment: {
          id: assessment._id.toString(),
          completed: assessment.completed,
          createdAt: assessment.createdAt,
          careerMatches: mappedMatches,
        },
        matches: mappedMatches,
      },
      'Passion assessment completed successfully',
      201
    )
  } catch (error) {
    console.error('[passion-assessment-post]', error)
    return fail('Unable to process passion assessment.', 500)
  }
}

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return fail('Authentication required.', 401)

  try {
    await connectDB()
    const latest = await PassionAssessment.findOne({ user: user.id })
      .sort({ createdAt: -1 })
      .populate('careerMatches.career')
      .lean()

    return ok(
      {
        assessment: latest || null,
        matches: latest?.careerMatches || [],
      },
      'Latest assessment retrieved'
    )
  } catch (error) {
    console.error('[passion-assessment-get]', error)
    return fail('Unable to load assessment.', 500)
  }
}
