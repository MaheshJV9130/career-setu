'use client'

import React, { useEffect, useState } from 'react'
import { ArrowRight, MapPin } from 'lucide-react'
import { PageHeader, Tag } from './Common'
import { OpportunityItem } from '@/app/api/opportunities/route'

type T = Record<string, string>

export function OpportunitiesView({
  t,
  district = 'Nashik, Maharashtra',
}: {
  t: T
  district?: string
}) {
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  const filterTabs = ['All', 'Colleges', 'Training', 'Events', 'Free', 'Government']

  useEffect(() => {
    async function loadOpportunities() {
      setLoading(true)
      try {
        const url = filter === 'All' ? '/api/opportunities' : `/api/opportunities?category=${filter}`
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          setOpportunities(data.data?.opportunities || data.opportunities || [])
        }
      } catch (err) {
        console.error('Error fetching opportunities:', err)
      } finally {
        setLoading(false)
      }
    }

    loadOpportunities()
  }, [filter])

  return (
    <>
      <PageHeader
        eyebrow={district}
        title={t.opportunitiesTitle}
        subtitle="Explore verified colleges, ITIs, training centres, career camps, and workshops close to home."
      />

      {/* Filter Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filterTabs.map((f) => {
          const isSelected = filter === f
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                isSelected
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-teal-700'
              }`}
            >
              {f}
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading opportunities near you…</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {opportunities.map((item) => (
            <article
              key={item.id}
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="grid size-12 place-items-center rounded-2xl bg-orange-50 text-orange-600">
                    <MapPin size={21} />
                  </div>
                  <Tag tone={item.isGovernment ? 'teal' : 'orange'}>
                    {item.type || item.category}
                  </Tag>
                </div>

                <h2 className="mt-5 text-xl font-black text-slate-900">{item.name}</h2>
                <p className="mt-2 text-sm text-slate-500">
                  {item.detail} · <span className="font-semibold text-slate-700">{item.place}</span>
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs font-bold text-slate-400">
                  {item.isFree ? 'Free Admission' : 'Subsidized Program'}
                </span>
                <span className="text-sm font-bold text-teal-700 hover:text-teal-800 transition">
                  {t.view} →
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
