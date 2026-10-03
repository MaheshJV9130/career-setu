import { cookies } from 'next/headers'
import { connectDB } from './db'
import { User, IUser } from '@/models/User'
import { verifyToken, JWTPayload } from './jwt'
import { fail } from './api-response'

export const AUTH_COOKIE_NAME = 'careersetu_token'

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE_NAME)
  // Also delete old cookie name if present
  cookieStore.delete('careerset_session')
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value || cookieStore.get('careerset_session')?.value
  return token || null
}

export async function getSession(): Promise<JWTPayload | null> {
  const token = await getAuthToken()
  if (!token) return null
  return await verifyToken(token)
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session?.userId) return null

  try {
    await connectDB()
    const user = await User.findById(session.userId).select('-password').lean()
    if (!user || user.status === 'inactive') return null
    return {
      ...user,
      id: user._id.toString(),
    }
  } catch (error) {
    console.error('[getCurrentUser] Database error:', error)
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    return { error: fail('Authentication required.', 401), user: null }
  }
  return { error: null, user }
}

export async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user) {
    return { error: fail('Authentication required.', 401), user: null }
  }
  if (user.role !== 'admin') {
    return { error: fail('Admin access required.', 403), user: null }
  }
  return { error: null, user }
}
