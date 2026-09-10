import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import { signupSchema } from '@/lib/validators'
import { seedAdmin } from '@/lib/seed-admin'
import { fail, ok } from '@/lib/api-response'

export async function POST(request: Request) {
  try {
    const parsed = signupSchema.safeParse(await request.json())
    if (!parsed.success) return fail('Please provide a valid name, email, and password.', 400)
    await connectDB()
    const exists = await User.exists({ email: parsed.data.email })
    if (exists) return fail('An account with this email already exists.', 409)
    const isFirstUser = (await User.countDocuments()) === 0
    if (isFirstUser) await seedAdmin()
    const user = await User.create(parsed.data)
    return ok({ message: 'Account created successfully', user: { id: user.id, name: user.name, email: user.email, role: user.role } }, { status: 201 })
  } catch (error) {
    console.error('[signup]', error)
    return fail('Unable to create your account right now.', 500)
  }
}
