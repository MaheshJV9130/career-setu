import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import { requireAdmin } from '@/lib/admin-auth'
import { fail, ok } from '@/lib/api-response'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error

  const { id } = await params
  if (!id) return fail('User ID is required.', 400)

  try {
    const body = await request.json()
    const { status, role } = body

    if (!status && !role) return fail('Nothing to update.', 400)
    if (status && !['active', 'inactive'].includes(status)) return fail('Invalid status.', 400)
    if (role && !['student', 'admin'].includes(role)) return fail('Invalid role.', 400)

    await connectDB()
    const user = await User.findById(id)
    if (!user) return fail('User not found.', 404)

    if (status) user.status = status
    if (role) user.role = role
    await user.save()

    return ok({ message: 'User updated successfully', user: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status } })
  } catch (error) {
    console.error('[admin-users-patch]', error)
    return fail('Failed to update user.', 500)
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error

  const { id } = await params
  if (!id) return fail('User ID is required.', 400)

  try {
    await connectDB()
    const user = await User.findByIdAndDelete(id)
    if (!user) return fail('User not found.', 404)

    return ok({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('[admin-users-delete]', error)
    return fail('Failed to delete user.', 500)
  }
}
