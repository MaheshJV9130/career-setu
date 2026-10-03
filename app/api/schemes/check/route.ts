import { connectDB } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { StudentProfile } from '@/models/StudentProfile'
import { GovernmentScheme, IGovernmentScheme } from '@/models/GovernmentScheme'
import { checkSchemeEligibility, ProfileEligibilityInput } from '@/lib/scheme-engine'
import { schemeCheckerSchema } from '@/lib/validators'
import { seedDatabase } from '@/lib/seed-data'
import { ok, fail } from '@/lib/api-response'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const parsed = schemeCheckerSchema.safeParse(body)

    let inputCriteria: ProfileEligibilityInput = parsed.success ? parsed.data : {}

    await connectDB()

    // Auto-seed if database is currently empty
    const count = await GovernmentScheme.countDocuments()
    if (count === 0) {
      await seedDatabase()
    }

    // Merge with authenticated student profile if available and fields are empty
    const user = await getCurrentUser()
    if (user) {
      const profile = await StudentProfile.findOne({ user: user.id }).lean()
      if (profile) {
        inputCriteria = {
          state: inputCriteria.state || profile.state,
          educationLevel: inputCriteria.educationLevel || profile.educationLevel,
          gender: inputCriteria.gender || profile.gender,
          category: inputCriteria.category || null,
          incomeLimit: inputCriteria.incomeLimit || null,
          courseType: inputCriteria.courseType || profile.currentCourse,
        }
      }
    }

    const allSchemes = await GovernmentScheme.find({ isOfficial: true }).lean()
    const evaluatedResults = checkSchemeEligibility(inputCriteria, allSchemes as unknown as IGovernmentScheme[])

    // Group or filter by status: Potentially Eligible, Possibly Relevant, More Information Needed
    const potentiallyEligible = evaluatedResults.filter((r) => r.status === 'Potentially Eligible')
    const possiblyRelevant = evaluatedResults.filter((r) => r.status === 'Possibly Relevant')
    const moreInfoNeeded = evaluatedResults.filter((r) => r.status === 'More Information Needed')

    return ok(
      {
        criteria: inputCriteria,
        results: evaluatedResults,
        summary: {
          potentiallyEligibleCount: potentiallyEligible.length,
          possiblyRelevantCount: possiblyRelevant.length,
          moreInfoNeededCount: moreInfoNeeded.length,
        },
        disclaimer: 'Final eligibility depends on official government guidelines. Please verify details from the official website.',
      },
      'Government scheme eligibility evaluated successfully'
    )
  } catch (error) {
    console.error('[schemes-check]', error)
    return fail('Unable to evaluate scheme eligibility.', 500)
  }
}

export async function GET(request: Request) {
  return POST(request)
}
