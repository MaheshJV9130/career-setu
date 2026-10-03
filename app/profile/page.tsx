'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    age: '',
    gender: '',
    location: '',
    district: '',
    state: '',
    educationLevel: '',
    currentCourse: '',
    institution: '',
    stream: '',
    interests: '',
    careerGoals: '',
    subjects: '',
  })
  const [completion, setCompletion] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch('/api/profile')
        if (response.status === 401) {
          router.replace('/login?next=/profile')
          return
        }

        const data = await response.json()
        const profile = data.data?.profile || data.profile
        const comp = data.data?.completion || data.completion

        if (profile) {
          setForm({
            age: profile.age ? String(profile.age) : '',
            gender: profile.gender || '',
            location: profile.location || '',
            district: profile.district || '',
            state: profile.state || '',
            educationLevel: profile.educationLevel || '',
            currentCourse: profile.currentCourse || '',
            institution: profile.institution || '',
            stream: profile.stream || '',
            interests: (profile.interests || []).join(', '),
            careerGoals: (profile.careerGoals || []).join(', '),
            subjects: (profile.subjects || []).join(', '),
          })
        }

        if (comp) {
          setCompletion(comp.percentage || 0)
        }
      } catch (error) {
        console.error('Failed to load profile:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router])

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const payload = {
        age: form.age ? parseInt(form.age, 10) : undefined,
        gender: form.gender || undefined,
        location: form.location.trim() || undefined,
        district: form.district.trim() || undefined,
        state: form.state.trim() || undefined,
        educationLevel: form.educationLevel || undefined,
        currentCourse: form.currentCourse.trim() || undefined,
        institution: form.institution.trim() || undefined,
        stream: form.stream.trim() || undefined,
        interests: form.interests
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        careerGoals: form.careerGoals
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        subjects: form.subjects
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      setSaving(false)

      if (!response.ok) {
        const err = data.message || 'Unable to save profile.'
        setMessage(err)
        toast.error(err)
        return
      }

      const newComp = data.data?.completion || data.completion
      if (newComp) {
        setCompletion(newComp.percentage)
      }

      setMessage('Profile saved successfully!')
      toast.success('Profile saved successfully!')

      if (newComp?.completed) {
        toast.success('Profile completed! Directing to dashboard.')
        setTimeout(() => router.push('/dashboard'), 1000)
      }
    } catch (err) {
      console.error('[profile-submit]', err)
      setSaving(false)
      setMessage('Error saving profile. Please check connection.')
      toast.error('Error saving profile.')
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6faf9]">
        <div className="text-sm font-bold text-teal-700">Loading your profile…</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f6faf9] px-4 py-8 sm:px-6 sm:py-12 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-800">
            Go to Dashboard <ArrowRight size={16} />
          </Link>
        </div>

        <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-sm border border-slate-100">
          <p className="text-sm font-semibold text-teal-700">CareerSetu</p>
          <h1 className="mt-2 text-3xl font-black">Build your career profile</h1>
          <p className="mt-2 text-slate-500">
            Complete your profile so we can personalize your guidance, passion matches, and government schemes.
          </p>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-slate-700">Profile completion</span>
              <span className="font-black text-teal-700">{completion}%</span>
            </div>
            <div className="mt-2 h-2.5 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-teal-600 transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
            {completion >= 80 ? (
              <p className="mt-2 text-xs font-bold text-teal-700">✓ Your profile is complete and ready for career matching!</p>
            ) : (
              <p className="mt-2 text-xs text-slate-500">Add your district, education level, interests, and goals to reach 100%.</p>
            )}
          </div>

          <form onSubmit={submit} className="mt-8 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold">
              <span>Age</span>
              <input
                type="number"
                min={10}
                max={100}
                value={form.age}
                onChange={(e) => update('age', e.target.value)}
                placeholder="e.g. 19"
                className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-teal-500"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold">
              <span>Gender</span>
              <select
                value={form.gender}
                onChange={(e) => update('gender', e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-3 font-normal outline-none focus:border-teal-500 bg-white"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </label>

            <label className="grid gap-2 text-sm font-semibold">
              <span>Education level</span>
              <select
                value={form.educationLevel}
                onChange={(e) => update('educationLevel', e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-3 font-normal outline-none focus:border-teal-500 bg-white"
              >
                <option value="">Select level</option>
                <option value="class_10">Class 10</option>
                <option value="class_12">Class 12</option>
                <option value="diploma">Diploma</option>
                <option value="undergraduate">Undergraduate</option>
                <option value="postgraduate">Postgraduate</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className="grid gap-2 text-sm font-semibold">
              <span>District</span>
              <input
                value={form.district}
                onChange={(e) => update('district', e.target.value)}
                placeholder="e.g. Nashik"
                className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-teal-500"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold">
              <span>State</span>
              <input
                value={form.state}
                onChange={(e) => update('state', e.target.value)}
                placeholder="e.g. Maharashtra"
                className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-teal-500"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold">
              <span>Location / Village / City</span>
              <input
                value={form.location}
                onChange={(e) => update('location', e.target.value)}
                placeholder="e.g. Niphad, Nashik"
                className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-teal-500"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold">
              <span>Current course</span>
              <input
                value={form.currentCourse}
                onChange={(e) => update('currentCourse', e.target.value)}
                placeholder="e.g. BTech Computer Engineering"
                className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-teal-500"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold">
              <span>College / School / Institution</span>
              <input
                value={form.institution}
                onChange={(e) => update('institution', e.target.value)}
                placeholder="e.g. Government Polytechnic"
                className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-teal-500"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold sm:col-span-2">
              <span>Interests (comma separated)</span>
              <input
                value={form.interests}
                onChange={(e) => update('interests', e.target.value)}
                placeholder="e.g. Technology, Coding, Problem Solving, Agriculture"
                className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-teal-500"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold sm:col-span-2">
              <span>Career goals (comma separated)</span>
              <input
                value={form.careerGoals}
                onChange={(e) => update('careerGoals', e.target.value)}
                placeholder="e.g. Become a software developer, work near hometown, prepare for state exams"
                className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-teal-500"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold sm:col-span-2">
              <span>Key subjects (comma separated)</span>
              <input
                value={form.subjects}
                onChange={(e) => update('subjects', e.target.value)}
                placeholder="e.g. Mathematics, Physics, Computer Science, English"
                className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-teal-500"
              />
            </label>

            <div className="mt-4 sm:col-span-2 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-teal-600 px-6 py-3.5 font-bold text-white transition hover:bg-teal-700 disabled:opacity-60 inline-flex items-center gap-2 shadow-sm"
              >
                {saving ? 'Saving profile…' : 'Save profile'}
                <Check size={18} />
              </button>

              <Link
                href="/dashboard"
                className="rounded-xl border border-slate-200 bg-white px-5 py-3.5 font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Continue to Dashboard
              </Link>
            </div>
          </form>

          {message && (
            <p className="mt-4 text-sm font-semibold text-teal-700">{message}</p>
          )}
        </div>
      </div>
    </main>
  )
}
