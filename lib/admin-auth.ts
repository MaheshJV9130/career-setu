import { getCurrentUser } from './auth'
import { fail } from './api-response'

export async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user) return { error: fail('Authentication required.', 401), user: null }
  if (user.role !== 'admin') return { error: fail('Admin access required.', 403), user: null }
  return { error: null, user }
}

export async function requireActiveUser() {
  const user = await getCurrentUser()
  if (!user) return { error: fail('Authentication required.', 401), user: null }
  if (user.status !== 'active') return { error: fail('Your account is inactive.', 403), user: null }
  return { error: null, user }
}
