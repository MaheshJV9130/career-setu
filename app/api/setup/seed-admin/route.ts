import { seedAdmin } from '@/lib/seed-admin'
import { ok, fail } from '@/lib/api-response'

export async function POST(request: Request) {
  const token = process.env.SETUP_TOKEN
  if (!token) return fail('Setup endpoint is disabled.', 403)
  if (request.headers.get('authorization') !== `Bearer ${token}`) return fail('Unauthorized.', 401)
  try {
    await seedAdmin()
    return ok({ message: 'Admin seeding completed' })
  } catch (error) {
    console.error('[setup-seed-admin]', error)
    return fail('Failed to seed admin.', 500)
  }
}
