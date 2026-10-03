'use client'

import { FormEvent, useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refreshUser } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setLoading(false)
        return setError(data.message || 'Invalid email or password')
      }

      setSuccess('Signed in successfully. Redirecting…')
      await refreshUser()

      // Check profile completion status
      try {
        const profileRes = await fetch('/api/profile')
        if (profileRes.ok) {
          const profileData = await profileRes.json()
          const isComplete = profileData.data?.completion?.completed ?? profileData.completion?.completed

          const nextParam = searchParams.get('next')
          if (nextParam) {
            router.push(nextParam)
          } else if (!isComplete) {
            router.push('/profile')
          } else {
            router.push('/dashboard')
          }
          return
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
      }

      const nextParam = searchParams.get('next') || '/dashboard'
      router.push(nextParam)
    } catch (err) {
      console.error('[login-submit]', err)
      setError('Unable to connect to the server. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <Link href="/" className="text-2xl font-black text-slate-900">
        Career<span className="text-teal-600">Setu</span>
      </Link>
      <h1 className="mt-10 text-3xl font-black text-slate-900">Welcome back</h1>
      <p className="mt-2 text-slate-500">Continue your career journey.</p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block text-sm font-bold text-slate-700">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@example.com"
            disabled={loading}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500 disabled:opacity-60"
          />
        </label>

        <label className="block text-sm font-bold text-slate-700">
          Password
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500 disabled:opacity-60"
          />
        </label>

        {error && (
          <p role="alert" className="text-sm font-semibold text-red-600">
            {error}
          </p>
        )}

        {success && (
          <p role="status" className="text-sm font-semibold text-teal-600">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full rounded-xl bg-teal-600 px-4 py-3 font-bold text-white transition hover:bg-teal-700 disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        New to CareerSetu?{' '}
        <Link href="/signup" className="font-bold text-teal-700 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6faf9] px-4">
      <Suspense fallback={<div className="text-slate-400">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </main>
  )
}
