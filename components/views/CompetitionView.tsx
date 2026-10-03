'use client'

import React, { useEffect, useState } from 'react'
import { TrendingUp } from 'lucide-react'
import { PageHeader, Progress, Tag } from './Common'
import { CompetitionStat } from '@/app/api/competition/route'

type T = Record<string, string>

export function CompetitionView({ t }: { t: T }) {
  const [competitions, setCompetitions] = useState<CompetitionStat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/competition')
        if (res.ok) {
          const data = await res.json()
          setCompetitions(data.data?.competitions || data.competitions || [])
        }
      } catch (err) {
        console.error('Error fetching competition stats:', err)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  return (
    <>
      <PageHeader
        eyebrow="Make informed choices"
        title={t.competitionTitle}
        subtitle="Understand the competition ratio, total seats, and demand realistic dynamics before committing to an examination or career path."
      />

      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading competition statistics…</div>
      ) : (
        <div className="grid gap-5 md:grid-cols-3">
          {competitions.map((stat) => (
            <article
              key={stat.id}
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="font-black text-slate-900 text-base">{stat.name}</h2>
                  <TrendingUp size={19} className="text-orange-500 shrink-0 ml-2" />
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Seats / Demand
                    </p>
                    <p className="mt-1 font-black text-slate-900 text-sm">{stat.seats}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Applicants / Level
                    </p>
                    <p className="mt-1 font-black text-slate-900 text-sm">{stat.applicants}</p>
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-500 leading-5">{stat.description}</p>
              </div>

              <div className="mt-6 pt-2">
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span className="text-slate-600">Competition Index</span>
                  <Tag
                    tone={
                      stat.level === 'Balanced'
                        ? 'teal'
                        : stat.level === 'High'
                        ? 'orange'
                        : 'red'
                    }
                  >
                    {stat.level}
                  </Tag>
                </div>
                <Progress
                  value={stat.value}
                  color={
                    stat.level === 'Balanced'
                      ? 'bg-teal-500'
                      : stat.level === 'High'
                      ? 'bg-orange-400'
                      : 'bg-red-500'
                  }
                />
              </div>
            </article>
          ))}
        </div>
      )}

      <p className="mt-6 rounded-2xl bg-slate-100 p-4 text-xs leading-5 text-slate-500">
        Competition data is compiled from officially published examination commission statistics (UPSC, NTA,
        MPSC, IBPS) and verified industry surveys. Numbers may vary per annual notification.
      </p>
    </>
  )
}
