import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import { connectDB } from './db'
import { User } from '@/models/User'

const COOKIE_NAME = 'careerset_session'
const secret = new TextEncoder().encode(process.env.AUTH_SECRET || process.env.BETTER_AUTH_SECRET || 'development-only-change-me')

type SessionPayload = { userId: string; role: string }

export async function createSession(userId: string, role: string) {
  const token = await new SignJWT({ userId, role } satisfies SessionPayload)
    .setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(secret)
  const jar = await cookies()
  jar.set(COOKIE_NAME, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 })
}

export async function getSession() {
  const token = (await cookies()).get(COOKIE_NAME)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as SessionPayload
  } catch { return null }
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session) return null
  await connectDB()
  return User.findById(session.userId).select('-password').lean()
}

export async function clearSession() { (await cookies()).delete(COOKIE_NAME) }
