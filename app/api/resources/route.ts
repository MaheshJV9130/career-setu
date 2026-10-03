import { connectDB } from '@/lib/db'
import { LearningResource } from '@/models/LearningResource'
import { seedDatabase } from '@/lib/seed-data'
import { ok, fail } from '@/lib/api-response'

export async function GET(request: Request) {
  try {
    await connectDB()

    const count = await LearningResource.countDocuments()
    if (count === 0) {
      await seedDatabase()
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')?.trim()
    const skill = searchParams.get('skill')?.trim()
    const level = searchParams.get('level')?.trim()
    const language = searchParams.get('language')?.trim()
    const free = searchParams.get('free')
    const official = searchParams.get('official')
    const search = searchParams.get('search')?.trim()

    const query: Record<string, unknown> = {}

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { platform: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } },
      ]
    }

    if (category && category.toLowerCase() !== 'all') {
      query.category = { $regex: `^${category}$`, $options: 'i' }
    }

    if (skill) {
      query.skills = { $regex: skill, $options: 'i' }
    }

    if (level && level.toLowerCase() !== 'all') {
      query.level = { $in: [level.toLowerCase(), 'all'] }
    }

    if (language && language.toLowerCase() !== 'all') {
      query.language = { $regex: `^${language}$`, $options: 'i' }
    }

    if (free !== null && free !== undefined && free !== '') {
      query.isFree = free === 'true'
    }

    if (official !== null && official !== undefined && official !== '') {
      query.isOfficial = official === 'true'
    }

    const resources = await LearningResource.find(query).sort({ isVerified: -1, createdAt: -1 }).lean()
    const categories = await LearningResource.distinct('category')

    return ok(
      {
        resources,
        total: resources.length,
        categories,
      },
      'Learning resources retrieved successfully'
    )
  } catch (error) {
    console.error('[resources-get]', error)
    return fail('Unable to fetch learning resources.', 500)
  }
}
