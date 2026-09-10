import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const adminPath = ['/admin']
  const studentPath = ['/dashboard', '/profile', '/passion-finder', '/career-readiness', '/roadmap', '/skill-development', '/government-schemes', '/resources', '/scam-awareness', '/opportunities', '/competition', '/careers']
  const needsAdminAuth = adminPath.some((path) => request.nextUrl.pathname.startsWith(path))
  const needsStudentAuth = studentPath.some((path) => request.nextUrl.pathname.startsWith(path))
  const needsAuth = needsAdminAuth || needsStudentAuth
  if (needsAuth && !request.cookies.has('careerset_session')) {
    const login = new URL('/login', request.url)
    login.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(login)
  }
  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*', '/dashboard/:path*', '/profile/:path*', '/passion-finder/:path*', '/career-readiness/:path*', '/roadmap/:path*', '/skill-development/:path*', '/government-schemes/:path*', '/resources/:path*', '/scam-awareness/:path*', '/opportunities/:path*', '/competition/:path*', '/careers/:path*'] }
