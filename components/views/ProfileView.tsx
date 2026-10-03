'use client'

import React, { useEffect, useState } from 'react'
import { Check, Edit3, Sparkles } from 'lucide-react'
import { PageHeader, Progress } from './Common'
import { useAuth } from '@/components/providers/AuthProvider'
import { toast } from 'sonner'
import Link from 'next/link'

type T = Record<string, string>

const AVAILABLE_INTERESTS = [
  'Technology',
  'Science',
  'Mathematics',
  'Business',
  'Design',
  'Agriculture',
  'Healthcare',
  'Government jobs',
  'Teaching',
  'Finance',
]

export function ProfileView({
  t,
  saved,
  setSaved,
}: {
  t: T
  saved: boolean
  setSaved: (v: boolean) => void
}) {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [completion, setCompletion] = useState(80)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Technology',
    'Science',
    'Mathematics',
    'Business',
  ])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/profile')
        if (res.ok) {
          const data = await res.json()
          const p = data.data?.profile || data.profile
          const comp = data.data?.completion || data.completion

          if (p) {
            setProfile(p)
            if (p.interests && p.interests.length > 0) {
              setSelectedInterests(p.interests)
            }
          }
          if (comp?.percentage !== undefined) {
            setCompletion(comp.percentage)
          }
        }
      } catch (err) {
        console.error('Error loading profile in view:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          interests: selectedInterests,
        }),
      })

      const data = await res.json()
      setSaving(false)

      if (res.ok) {
        setSaved(true)
        const comp = data.data?.completion || data.completion
        if (comp) setCompletion(comp.percentage)
        toast.success('Career profile updated successfully!')
      } else {
        toast.error(data.message || 'Failed to save profile.')
      }
    } catch (err) {
      console.error('Save error:', err)
      setSaving(false)
      toast.error('Network error saving profile.')
    }
  }

  const displayName = profile?.user?.name || user?.name || 'Mahesh Patil'
  const initial = displayName.trim().charAt(0).toUpperCase() || 'M'
  const displayCourse = profile?.currentCourse || 'BTech Computer Engineering'
  const displayLocation = profile?.location || profile?.district || 'Nashik'
  const displayState = profile?.state || 'Maharashtra'

  return (
    <>
      <PageHeader
        eyebrow="About you"
        title={t.profileTitle}
        subtitle="Tell us about yourself so CareerSetu can recommend the right opportunities and career roadmaps."
      />

      <div className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
        {/* Left: Profile Info Card */}
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900">Personal information</h2>
              <p className="mt-1 text-sm text-slate-500">You can update this anytime.</p>
            </div>
            <span className="text-2xl font-black text-teal-700">{completion}%</span>
          </div>

          <Progress value={completion} />

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
              <span className="text-xs font-bold text-slate-400 block">Full Name</span>
              {displayName}
            </div>

            <div className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
              <span className="text-xs font-bold text-slate-400 block">Age</span>
              {profile?.age || 20} years
            </div>

            <div className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
              <span className="text-xs font-bold text-slate-400 block">Gender</span>
              {profile?.gender ? profile.gender.replace('_', ' ') : 'Select'}
            </div>

            <div className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
              <span className="text-xs font-bold text-slate-400 block">Location</span>
              {displayLocation}
            </div>

            <div className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
              <span className="text-xs font-bold text-slate-400 block">District</span>
              {profile?.district || 'Nashik'}
            </div>

            <div className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
              <span className="text-xs font-bold text-slate-400 block">State</span>
              {displayState}
            </div>

            <div className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
              <span className="text-xs font-bold text-slate-400 block">Education</span>
              {profile?.educationLevel
                ? profile.educationLevel.replace('_', ' ')
                : 'Undergraduate'}
            </div>

            <div className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
              <span className="text-xs font-bold text-slate-400 block">Current Course</span>
              {displayCourse}
            </div>

            <div className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
              <span className="text-xs font-bold text-slate-400 block">Institution</span>
              {profile?.institution || 'College / school name'}
            </div>

            <div className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
              <span className="text-xs font-bold text-slate-400 block">Stream</span>
              {profile?.stream || 'Computer Engineering'}
            </div>
          </div>

          <h2 className="mt-8 text-xl font-black text-slate-900">Your interests</h2>
          <p className="mt-1 text-xs text-slate-500">
            Click to toggle the fields you are excited to explore.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {AVAILABLE_INTERESTS.map((interest) => {
              const isSelected = selectedInterests.includes(interest)
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                    isSelected
                      ? 'bg-teal-100 text-teal-800 ring-1 ring-teal-300 font-bold'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {interest}
                </button>
              )
            })}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-teal-700 px-6 py-3 font-bold text-white transition hover:bg-teal-800 disabled:opacity-50 inline-flex items-center gap-2"
            >
              {saving ? 'Saving…' : saved ? 'Profile saved' : t.save}
              <Check size={16} />
            </button>

            <Link
              href="/profile"
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition inline-flex items-center gap-1.5"
            >
              <Edit3 size={15} /> Edit complete profile
            </Link>
          </div>
        </section>

        {/* Right: Summary Card */}
        <aside className="rounded-3xl bg-[#123f4a] p-7 text-white flex flex-col justify-between">
          <div>
            <div className="grid size-14 place-items-center rounded-2xl bg-orange-400 text-2xl font-black text-slate-950 shadow-md">
              {initial}
            </div>
            <h2 className="mt-5 text-2xl font-black">{displayName}</h2>
            <p className="mt-2 text-teal-100 text-sm">
              {displayCourse} · {displayLocation}
            </p>

            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="text-sm font-bold text-teal-200">What are you looking for?</p>
              <ul className="mt-4 space-y-3 text-sm text-white/90">
                {[
                  'Technology career with verified growth',
                  'Stable employment and social respect',
                  'Opportunities near hometown',
                  'Scholarships & government aid',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check size={16} className="text-orange-300 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-10 text-xs leading-5 text-teal-100/80 border-t border-white/10 pt-4">
            The better we understand your interests, the more accurately CareerSetu can guide you
            toward genuine Indian scholarships, courses, and jobs.
          </p>
        </aside>
      </div>
    </>
  )
}
