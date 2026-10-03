import { seedDatabase } from '@/lib/seed-data'
import { ok, fail } from '@/lib/api-response'

export async function POST() {
  try {
    const result = await seedDatabase()
    return ok(result, 'Database seeded successfully with CareerSetu data.', 200)
  } catch (error) {
    console.error('[seed-error]', error)
    return fail('Failed to seed database.', 500)
  }
}

export async function GET() {
  return POST()
}
