import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import { loginSchema } from '@/lib/validators'
import { createToken } from '@/lib/jwt'
import { setAuthCookie } from '@/lib/auth'
import { ok, fail } from '@/lib/api-response'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return fail('Invalid email or password', 401)
    }

    await connectDB()

    // Explicitly select password
    const user = await User.findOne({ email: parsed.data.email }).select('+password')
    if (!user) {
      return fail('Invalid email or password', 401)
    }

    if (user.status === 'inactive') {
      return fail('Your account is currently inactive. Please contact support.', 403)
    }

    const isValidPassword = await user.comparePassword(parsed.data.password)
    if (!isValidPassword) {
      return fail('Invalid email or password', 401)
    }

    // Generate JWT
    const token = await createToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    // Set HttpOnly cookie
    await setAuthCookie(token)

    return ok(
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      'Welcome back to CareerSetu!'
    )
  } catch (error) {
    console.error('[login-error]', error)
    return fail('Unable to sign you in right now. Please try again.', 500)
  }
}
