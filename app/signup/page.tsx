'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'

export default function SignupPage() {
  const router = useRouter()
  const { refreshUser } = useAuth()

  const [name, setName] = useState('')
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
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()
      setLoading(false)

      if (!response.ok) {
        return setError(data.message || 'Unable to create account.')
      }

      setSuccess('Account created! Setting up your profile…')
      await refreshUser()

      // Redirect directly to /profile as per instructions
      router.push('/profile')
    } catch (err) {
      console.error('[signup-submit]', err)
      setError('Unable to connect to the server. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6faf9] px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <Link href="/" className="text-2xl font-black text-slate-900">
          Career<span className="text-teal-600">Setu</span>
        </Link>
        <h1 className="mt-10 text-3xl font-black text-slate-900">Create your account</h1>
        <p className="mt-2 text-slate-500">Start with a clearer career path.</p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <label className="block text-sm font-bold text-slate-700">
            Full name
            <input
              required
              minLength={2}
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              disabled={loading}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500 disabled:opacity-60"
            />
          </label>

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
              minLength={6}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
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
            disabled={loading || !name || !email || !password}
            className="w-full rounded-xl bg-teal-600 px-4 py-3 font-bold text-white transition hover:bg-teal-700 disabled:opacity-60"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-teal-700 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
