import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import { requireAdmin } from '@/lib/admin-auth'
import { fail, ok } from '@/lib/api-response'

export async function GET(request: Request) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const url = new URL(request.url)
    const search = url.searchParams.get('search') || ''
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = 10

    await connectDB()
    const query = search ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] } : {}
    const users = await User.find(query).select('-password').sort({ createdAt: -1 }).limit(limit).skip((page - 1) * limit).lean()
    const total = await User.countDocuments(query)

    return ok({ users, total, page, pages: Math.ceil(total / limit) })
  } catch (error) {
    console.error('[admin-users-get]', error)
    return fail('Failed to fetch users.', 500)
  }
}
