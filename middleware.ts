import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const AUTH_COOKIE = 'careersetu_token'
const FALLBACK_COOKIE = 'careerset_session'

const PROTECTED_STUDENT_PATHS = [
  '/dashboard',
  '/profile',
  '/passion-finder',
  '/career-readiness',
  '/roadmap',
  '/skill-development',
  '/government-schemes',
  '/opportunities',
  '/competition',
]

const PROTECTED_ADMIN_PATHS = ['/admin']

function getJwtSecretKey() {
  const secret = process.env.JWT_SECRET || 'careersetu_default_secret_jwt_key_at_least_32_characters'
  return new TextEncoder().encode(secret)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const needsAdmin = PROTECTED_ADMIN_PATHS.some((p) => pathname.startsWith(p))
  const needsStudent = PROTECTED_STUDENT_PATHS.some((p) => pathname.startsWith(p))
  const needsAuth = needsAdmin || needsStudent

  if (!needsAuth) {
    return NextResponse.next()
  }

  const token =
    request.cookies.get(AUTH_COOKIE)?.value ||
    request.cookies.get(FALLBACK_COOKIE)?.value

  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey())

    if (needsAdmin && payload.role !== 'admin') {
      // Forbidden for non-admins
      const homeUrl = new URL('/', request.url)
      return NextResponse.redirect(homeUrl)
    }

    return NextResponse.next()
  } catch {
    // Token invalid or expired
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete(AUTH_COOKIE)
    response.cookies.delete(FALLBACK_COOKIE)
    return response
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/passion-finder/:path*',
    '/career-readiness/:path*',
    '/roadmap/:path*',
    '/skill-development/:path*',
    '/government-schemes/:path*',
    '/opportunities/:path*',
    '/competition/:path*',
  ],
}
