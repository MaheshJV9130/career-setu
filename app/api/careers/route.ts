import { connectDB } from '@/lib/db'
import { Career } from '@/models/Career'
import { seedDatabase } from '@/lib/seed-data'
import { ok, fail } from '@/lib/api-response'

export async function GET(request: Request) {
  try {
    await connectDB()

    // Auto-seed if database is currently empty
    const count = await Career.countDocuments()
    if (count === 0) {
      await seedDatabase()
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')?.trim() || ''
    const category = searchParams.get('category')?.trim() || ''
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))

    const query: Record<string, unknown> = { isActive: true }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'skills.name': { $regex: search, $options: 'i' } },
      ]
    }

    if (category && category.toLowerCase() !== 'all') {
      query.category = { $regex: `^${category}$`, $options: 'i' }
    }

    const total = await Career.countDocuments(query)
    const careers = await Career.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    const categories = await Career.distinct('category', { isActive: true })

    return ok(
      {
        careers,
        total,
        page,
        pages: Math.ceil(total / limit),
        categories,
      },
      'Careers retrieved successfully'
    )
  } catch (error) {
    console.error('[careers-get]', error)
    return fail('Unable to fetch careers.', 500)
  }
}
