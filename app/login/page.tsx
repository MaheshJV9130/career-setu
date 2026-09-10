'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  async function submit(event: FormEvent) { event.preventDefault(); setError(''); setLoading(true); const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) }); const data = await response.json(); setLoading(false); if (!response.ok) return setError(data.message); router.push(params.get('next') || '/') }
  return <main className="flex min-h-screen items-center justify-center bg-[#f6faf9] px-4"><div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"><Link href="/" className="text-2xl font-black text-slate-900">Career<span className="text-teal-600">Setu</span></Link><h1 className="mt-10 text-3xl font-black text-slate-900">Welcome back</h1><p className="mt-2 text-slate-500">Continue your career journey.</p><form onSubmit={submit} className="mt-8 space-y-4"><label className="block text-sm font-bold text-slate-700">Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500" /></label><label className="block text-sm font-bold text-slate-700">Password<input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500" /></label>{error && <p role="alert" className="text-sm font-semibold text-red-600">{error}</p>}<button disabled={loading} className="w-full rounded-xl bg-teal-600 px-4 py-3 font-bold text-white disabled:opacity-60">{loading ? 'Signing in…' : 'Sign in'}</button></form><p className="mt-6 text-center text-sm text-slate-500">New to CareerSetu? <Link href="/signup" className="font-bold text-teal-700">Create an account</Link></p></div></main>
}
