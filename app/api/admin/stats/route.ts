import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import { requireAdmin } from '@/lib/admin-auth'
import { fail, ok } from '@/lib/api-response'

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await connectDB()
    const totalUsers = await User.countDocuments()
    const totalStudents = await User.countDocuments({ role: 'student' })
    const totalAdmins = await User.countDocuments({ role: 'admin' })
    const activeUsers = await User.countDocuments({ status: 'active' })
    const inactiveUsers = await User.countDocuments({ status: 'inactive' })

    return ok({
      stats: {
        totalUsers,
        totalStudents,
        totalAdmins,
        activeUsers,
        inactiveUsers,
      },
    })
  } catch (error) {
    console.error('[admin-stats-get]', error)
    return fail('Failed to fetch stats.', 500)
  }
}
