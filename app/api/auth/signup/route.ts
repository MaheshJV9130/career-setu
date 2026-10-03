import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import { signupSchema } from '@/lib/validators'
import { createToken } from '@/lib/jwt'
import { setAuthCookie } from '@/lib/auth'
import { ok, fail } from '@/lib/api-response'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = signupSchema.safeParse(body)
    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || 'Please provide a valid name, email, and password.'
      return fail(errorMsg, 400, parsed.error.issues)
    }

    await connectDB()

    const existingUser = await User.findOne({ email: parsed.data.email })
    if (existingUser) {
      return fail('An account with this email already exists.', 409)
    }

    // Create user (password automatically hashed by pre-save hook)
    const user = await User.create({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
      role: 'student',
      status: 'active',
    })

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
      'Welcome to CareerSetu!',
      201
    )
  } catch (error) {
    console.error('[signup-error]', error)
    return fail('Unable to create your account right now. Please try again.', 500)
  }
}
