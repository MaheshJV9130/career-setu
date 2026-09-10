import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import { loginSchema } from '@/lib/validators'
import { createSession } from '@/lib/auth'
import { fail, ok } from '@/lib/api-response'

export async function POST(request: Request) {
  try {
    const parsed = loginSchema.safeParse(await request.json())
    if (!parsed.success) return fail('Please enter a valid email and password.', 400)
    await connectDB()
    const user = await User.findOne({ email: parsed.data.email }).select('+password')
    if (!user || !(await user.comparePassword(parsed.data.password))) return fail('Email or password is incorrect.', 401)
    if (user.status === 'inactive') return fail('Your account is inactive. Please contact support.', 403)
    await createSession(user.id, user.role)
    return ok({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status } })
  } catch (error) {
    console.error('[login]', error)
    return fail('Unable to sign you in right now.', 500)
  }
}
