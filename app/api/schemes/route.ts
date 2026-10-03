import { connectDB } from '@/lib/db'
import { GovernmentScheme } from '@/models/GovernmentScheme'
import { seedDatabase } from '@/lib/seed-data'
import { ok, fail } from '@/lib/api-response'

export async function GET(request: Request) {
  try {
    await connectDB()

    const count = await GovernmentScheme.countDocuments()
    if (count === 0) {
      await seedDatabase()
    }

    const { searchParams } = new URL(request.url)
    const state = searchParams.get('state')?.trim()
    const search = searchParams.get('search')?.trim()

    const query: Record<string, unknown> = {}

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { provider: { $regex: search, $options: 'i' } },
      ]
    }

    if (state && state.toLowerCase() !== 'all') {
      query.states = { $in: [new RegExp(`^${state}$`, 'i'), 'All India'] }
    }

    const schemes = await GovernmentScheme.find(query).sort({ isOfficial: -1, createdAt: -1 }).lean()
    const states = await GovernmentScheme.distinct('states')

    return ok(
      {
        schemes,
        total: schemes.length,
        states,
      },
      'Government schemes retrieved successfully'
    )
  } catch (error) {
    console.error('[schemes-get]', error)
    return fail('Unable to fetch government schemes.', 500)
  }
}
