'use client'

import React, { useEffect, useState } from 'react'
import { ArrowRight, BookOpen, ExternalLink, ShieldCheck } from 'lucide-react'
import { PageHeader, Tag } from './Common'

type T = Record<string, string>

interface ResourceItem {
  _id: string
  title: string
  description: string
  url: string
  platform: string
  category: string
  level: string
  language: string
  isFree: boolean
  isOfficial: boolean
  isVerified: boolean
}

export function SkillsView({ t }: { t: T }) {
  const [resources, setResources] = useState<ResourceItem[]>([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  const filters = ['All', 'Free', 'Beginner', 'Intermediate', 'Official', 'Hindi', 'English']

  useEffect(() => {
    async function fetchResources() {
      setLoading(true)
      try {
        let queryUrl = '/api/resources'
        const params = new URLSearchParams()

        if (filter === 'Free') params.set('free', 'true')
        else if (filter === 'Beginner' || filter === 'Intermediate') params.set('level', filter.toLowerCase())
        else if (filter === 'Official') params.set('official', 'true')
        else if (filter === 'Hindi' || filter === 'English') params.set('language', filter)

        if (params.toString()) {
          queryUrl += `?${params.toString()}`
        }

        const res = await fetch(queryUrl)
        if (res.ok) {
          const data = await res.json()
          setResources(data.data?.resources || data.resources || [])
        }
      } catch (err) {
        console.error('Error fetching learning resources:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [filter])

  return (
    <>
      <PageHeader
        eyebrow="Learning library"
        title={t.skillsTitle}
        subtitle="Choose practical, verified lessons designed for Indian students. Master in-demand tools and build job momentum."
      />

      {/* Filter Chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => {
          const isSelected = filter === f
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                isSelected
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:border-teal-400 hover:text-teal-700'
              }`}
            >
              {f}
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading learning resources…</div>
      ) : resources.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center text-slate-500 ring-1 ring-slate-100">
          No resources found matching this filter.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {resources.map((item) => (
            <article
              key={item._id || item.title}
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="grid size-12 place-items-center rounded-2xl bg-teal-50 text-teal-700">
                    <BookOpen size={21} />
                  </div>
                  <Tag tone={item.isOfficial ? 'teal' : 'blue'}>
                    {item.isOfficial ? t.official : t.trusted}
                  </Tag>
                </div>

                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">
                  {item.platform || item.category || 'General'}
                </p>
                <h2 className="mt-1 text-xl font-black text-slate-900">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500 line-clamp-2">
                  {item.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Tag tone="blue">{item.level ? `${item.level} level` : 'All levels'}</Tag>
                  <Tag tone="orange">{item.isFree ? 'Free Access' : 'Verified'}</Tag>
                  {item.language && <Tag tone="teal">{item.language}</Tag>}
                </div>
              </div>

              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Start learning <ExternalLink size={15} />
              </a>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
