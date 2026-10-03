'use client'

import React, { useEffect, useState } from 'react'
import { ArrowRight, ChevronDown, ExternalLink, GraduationCap, Info, Sparkles } from 'lucide-react'
import { PageHeader, Tag } from './Common'
import { toast } from 'sonner'

type T = Record<string, string>

interface SchemeResultItem {
  scheme: {
    _id: string
    title: string
    provider: string
    description: string
    officialUrl: string
    states: string[]
    educationLevels: string[]
    categories: string[]
    gender: string
    incomeLimit?: number | null
    isOfficial: boolean
  }
  status: 'Potentially Eligible' | 'Possibly Relevant' | 'More Information Needed' | 'Not Matched'
  reasons: string[]
  missingCriteria: string[]
}

export function SchemesView({ t }: { t: T }) {
  const [form, setForm] = useState({
    state: 'Maharashtra',
    educationLevel: 'undergraduate',
    category: 'General',
    incomeLimit: '300000',
    gender: 'all',
    courseType: 'Engineering',
  })
  const [results, setResults] = useState<SchemeResultItem[]>([])
  const [checking, setChecking] = useState(false)

  // 1. Pre-fill from student profile
  useEffect(() => {
    async function loadProfileDefaults() {
      try {
        const res = await fetch('/api/profile')
        if (res.ok) {
          const data = await res.json()
          const p = data.data?.profile || data.profile
          if (p) {
            setForm((prev) => ({
              ...prev,
              state: p.state || prev.state,
              educationLevel: p.educationLevel || prev.educationLevel,
              gender: p.gender || prev.gender,
              courseType: p.currentCourse || prev.courseType,
            }))
          }
        }
      } catch (err) {
        console.error('Error fetching profile for schemes:', err)
      }
    }

    loadProfileDefaults()
    // Initial evaluation
    runCheck({
      state: 'Maharashtra',
      educationLevel: 'undergraduate',
      category: 'General',
      incomeLimit: 300000,
      gender: 'all',
      courseType: 'Engineering',
    })
  }, [])

  const runCheck = async (criteria: any) => {
    setChecking(true)
    try {
      const res = await fetch('/api/schemes/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(criteria),
      })
      const data = await res.json()
      setChecking(false)

      if (res.ok) {
        const list: SchemeResultItem[] = data.data?.results || data.results || []
        // Filter out strict "Not Matched" to show only potentially relevant or matching
        const relevant = list.filter((item) => item.status !== 'Not Matched')
        setResults(relevant.length > 0 ? relevant : list)
      }
    } catch (err) {
      console.error('Error checking schemes:', err)
      setChecking(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    runCheck({
      state: form.state,
      educationLevel: form.educationLevel,
      category: form.category,
      incomeLimit: form.incomeLimit ? parseInt(form.incomeLimit, 10) : undefined,
      gender: form.gender,
      courseType: form.courseType,
    })
    toast.success('Schemes evaluated based on your criteria.')
  }

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <>
      <PageHeader
        eyebrow="Scholarships & support"
        title={t.schemesTitle}
        subtitle="Find government schemes and scholarships that may be relevant to you. Always verify final eligibility on the official website."
      />

      <div className="grid gap-6 lg:grid-cols-[.75fr_1.25fr]">
        {/* Left: Interactive Criteria Form */}
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 h-fit">
          <h2 className="text-xl font-black text-slate-900">Tell us about you</h2>
          <p className="mt-1 text-xs text-slate-500">
            We evaluate central and state government scholarship guidelines.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <label className="block text-xs font-bold text-slate-700">
              State
              <input
                value={form.state}
                onChange={(e) => update('state', e.target.value)}
                placeholder="e.g. Maharashtra"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-teal-500"
              />
            </label>

            <label className="block text-xs font-bold text-slate-700">
              Education Level
              <select
                value={form.educationLevel}
                onChange={(e) => update('educationLevel', e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-teal-500 bg-white"
              >
                <option value="class_10">Class 10</option>
                <option value="class_12">Class 12</option>
                <option value="diploma">Diploma / ITI</option>
                <option value="undergraduate">Undergraduate (Degree)</option>
                <option value="postgraduate">Postgraduate</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className="block text-xs font-bold text-slate-700">
              Social Category
              <select
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-teal-500 bg-white"
              >
                <option value="General">General / Open</option>
                <option value="OBC">OBC (Other Backward Classes)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="EWS">EWS (Economically Weaker Section)</option>
              </select>
            </label>

            <label className="block text-xs font-bold text-slate-700">
              Annual Family Income (INR)
              <select
                value={form.incomeLimit}
                onChange={(e) => update('incomeLimit', e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-teal-500 bg-white"
              >
                <option value="150000">Below ₹1,50,000</option>
                <option value="250000">Below ₹2,50,000</option>
                <option value="450000">Below ₹4,50,000</option>
                <option value="800000">Below ₹8,00,000</option>
                <option value="">No Income Limit</option>
              </select>
            </label>

            <label className="block text-xs font-bold text-slate-700">
              Gender
              <select
                value={form.gender}
                onChange={(e) => update('gender', e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-teal-500 bg-white"
              >
                <option value="all">All / Any</option>
                <option value="female">Female (Girl Students)</option>
                <option value="male">Male</option>
              </select>
            </label>

            <button
              type="submit"
              disabled={checking}
              className="mt-2 w-full rounded-xl bg-teal-700 px-4 py-3 font-bold text-white transition hover:bg-teal-800 disabled:opacity-50"
            >
              {checking ? 'Checking eligibility…' : 'Check potential schemes'}
            </button>
          </form>
        </section>

        {/* Right: Evaluated Schemes List */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="text-teal-700" />
            <h2 className="text-xl font-black text-slate-900">Potentially relevant schemes</h2>
          </div>

          {results.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-center text-slate-500 ring-1 ring-slate-100">
              Click &quot;Check potential schemes&quot; to review opportunities.
            </div>
          ) : (
            results.map(({ scheme, status, reasons }) => {
              const statusTone =
                status === 'Potentially Eligible'
                  ? 'teal'
                  : status === 'Possibly Relevant'
                  ? 'blue'
                  : 'orange'

              return (
                <article
                  key={scheme._id || scheme.title}
                  className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="max-w-xl">
                      <div className="flex items-center gap-2">
                        <Tag tone={statusTone}>{status}</Tag>
                        {scheme.isOfficial && <Tag>{t.official}</Tag>}
                      </div>
                      <h3 className="mt-2 text-lg font-black text-slate-900">{scheme.title}</h3>
                      <p className="mt-1 text-xs font-semibold text-slate-400">{scheme.provider}</p>
                    </div>
                  </div>

                  <p className="text-sm leading-6 text-slate-600">{scheme.description}</p>

                  {reasons && reasons.length > 0 && (
                    <div className="rounded-2xl bg-slate-50 p-3 text-xs space-y-1 text-slate-600">
                      <p className="font-bold text-slate-700">Evaluation match details:</p>
                      {reasons.map((r, idx) => (
                        <p key={idx} className="flex items-center gap-1.5">
                          <span className="text-teal-600 font-black">✓</span> {r}
                        </p>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    <a
                      href={scheme.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-800 transition"
                    >
                      View official portal <ExternalLink size={15} />
                    </a>

                    {scheme.incomeLimit && (
                      <span className="text-xs text-slate-400 font-semibold">
                        Income ceiling: ₹{scheme.incomeLimit.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </article>
              )
            })
          )}

          {/* Critical Indian Government Disclaimer */}
          <div className="rounded-2xl bg-orange-50 p-4 border border-orange-100 flex items-start gap-2.5">
            <Info size={18} className="text-orange-700 shrink-0 mt-0.5" />
            <p className="text-xs leading-5 text-orange-800">
              <strong>Notice:</strong> Final eligibility depends on official government guidelines,
              valid domicile, and income verification by local revenue authorities. Always apply directly
              through official state or national portals (scholarships.gov.in / mahaDBT).
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
