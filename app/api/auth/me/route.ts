import { getCurrentUser } from '@/lib/auth'
import { ok, fail } from '@/lib/api-response'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return fail('Authentication required.', 401)
  }
  return ok({ user }, 'Authenticated user retrieved')
}
