'use client'

import React, { useEffect, useState } from 'react'
import { ArrowRight, BarChart3, BookOpen, Compass, Lightbulb, Target, Zap } from 'lucide-react'
import { Progress, Tag } from './Common'
import { useAuth } from '@/components/providers/AuthProvider'

type Section =
  | 'home'
  | 'discover'
  | 'readiness'
  | 'roadmap'
  | 'skills'
  | 'schemes'
  | 'resources'
  | 'safety'
  | 'opportunities'
  | 'competition'
  | 'profile'

type T = Record<string, string>

export function HomeView({ t, go }: { t: T; go: (s: Section) => void }) {
  const { user } = useAuth()
  const [profileCompletion, setProfileCompletion] = useState(80)
  const [topMatch, setTopMatch] = useState<{ title: string; matchPercentage: number } | null>(null)
  const [readinessScore, setReadinessScore] = useState<number | null>(null)
  const [roadmapProgress, setRoadmapProgress] = useState<{ completed: number; total: number; percentage: number } | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [profRes, passRes, readRes, roadRes] = await Promise.allSettled([
          fetch('/api/profile'),
          fetch('/api/assessment/passion'),
          fetch('/api/assessment/readiness'),
          fetch('/api/roadmaps'),
        ])

        if (profRes.status === 'fulfilled' && profRes.value.ok) {
          const profData = await profRes.value.json()
          const comp = profData.data?.completion || profData.completion
          if (comp?.percentage !== undefined) setProfileCompletion(comp.percentage)
        }

        if (passRes.status === 'fulfilled' && passRes.value.ok) {
          const passData = await passRes.value.json()
          const matches = passData.data?.matches || passData.matches
          if (matches && matches.length > 0) {
            setTopMatch({ title: matches[0].title, matchPercentage: matches[0].matchPercentage })
          }
        }

        if (readRes.status === 'fulfilled' && readRes.value.ok) {
          const readData = await readRes.value.json()
          const r = readData.data?.readiness || readData.readiness
          if (r?.overallScore !== undefined) {
            setReadinessScore(r.overallScore)
          }
        }

        if (roadRes.status === 'fulfilled' && roadRes.value.ok) {
          const roadData = await roadRes.value.json()
          const active = roadData.data?.activeRoadmap || roadData.activeRoadmap
          if (active?.steps) {
            const completedCount = active.steps.filter((s: any) => s.completed).length
            setRoadmapProgress({
              completed: completedCount,
              total: active.steps.length,
              percentage: active.overallProgress || Math.round((completedCount / active.steps.length) * 100),
            })
          }
        }
      } catch (err) {
        console.error('Error loading dashboard stats:', err)
      } finally {
        setLoadingStats(false)
      }
    }

    loadDashboardData()
  }, [])

  // Greeting based on time of day
  const hour = new Date().getHours()
  const greetingTime = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const displayName = user?.name ? user.name.split(' ')[0] : 'Student'

  return (
    <>
      <section className="relative overflow-hidden rounded-[2rem] bg-[#123f4a] px-6 py-12 text-white sm:px-12 lg:px-16 lg:py-16">
        <div className="relative z-10 max-w-2xl">
          <Tag tone="orange">A trusted guide for your future</Tag>
          <h1 className="mt-6 text-balance text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
            {t.hero}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-teal-50 sm:text-lg">{t.heroSub}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => go('discover')}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-400 px-5 py-3 font-bold text-orange-950 shadow-lg shadow-orange-950/10 transition hover:bg-orange-300"
            >
              {t.start}
              <ArrowRight size={17} />
            </button>
            <button
              onClick={() => go('readiness')}
              className="rounded-xl border border-white/20 px-5 py-3 font-bold text-white transition hover:bg-white/10"
            >
              {t.explore}
            </button>
          </div>
        </div>
        <div className="absolute -right-10 -top-10 size-64 rounded-full border-[24px] border-teal-800/50 sm:right-20 sm:top-10 sm:size-80">
          <div className="absolute inset-8 rounded-full border border-teal-300/20" />
          <div className="absolute bottom-8 left-8 grid size-16 place-items-center rounded-2xl bg-orange-400 text-3xl shadow-xl">
            ↗
          </div>
        </div>
      </section>

      <div className="mt-10 flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold text-teal-600">Your personalized dashboard</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight">
            {greetingTime}, {displayName}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{t.welcome}</p>
        </div>
        <Tag>Profile {profileCompletion}% complete</Tag>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Target />}
          label={t.match}
          value={topMatch ? topMatch.title : 'Software Developer'}
          meta={topMatch ? `${topMatch.matchPercentage}% Match` : '92% Match'}
          tone="teal"
          onClick={() => go('discover')}
          action={t.view}
        />
        <StatCard
          icon={<BarChart3 />}
          label={t.readinessCard}
          value={readinessScore !== null ? `${readinessScore}%` : '72%'}
          meta={readinessScore !== null && readinessScore >= 70 ? 'Strong foundation' : 'Developing'}
          tone="blue"
          onClick={() => go('readiness')}
          action={t.continue}
        />
        <StatCard
          icon={<Compass />}
          label={t.progress}
          value={roadmapProgress ? `${roadmapProgress.completed} / ${roadmapProgress.total}` : '3 / 6'}
          meta="Steps completed"
          tone="orange"
          onClick={() => go('roadmap')}
          action={t.continue}
        />
        <StatCard
          icon={<BookOpen />}
          label={t.resourcesCard}
          value="6 verified"
          meta="Picked for you"
          tone="purple"
          onClick={() => go('skills')}
          action={t.explore}
        />
      </div>

      <section className="mt-8 grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
        <div className="rounded-3xl border border-orange-100 bg-orange-50 p-6 sm:p-8">
          <div className="flex items-start justify-between">
            <div>
              <Tag tone="orange">{t.nextStep}</Tag>
              <h2 className="mt-4 text-2xl font-black text-slate-900">{t.next}</h2>
              <p className="mt-2 text-slate-600">{t.nextSub}</p>
            </div>
            <div className="grid size-12 place-items-center rounded-2xl bg-orange-400 text-white">
              <Zap size={22} />
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1">
              <Progress
                value={roadmapProgress ? roadmapProgress.percentage : 58}
                color="bg-orange-400"
              />
              <div className="mt-2 flex justify-between text-xs font-semibold text-orange-800">
                <span>Active Track</span>
                <span>{roadmapProgress ? `${roadmapProgress.percentage}%` : '58%'}</span>
              </div>
            </div>
            <button
              onClick={() => go('skills')}
              className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              {t.continue}
            </button>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-teal-50 text-teal-600">
              <Lightbulb size={21} />
            </div>
            <div>
              <p className="text-sm font-bold">A little reminder</p>
              <p className="text-xs text-slate-400">For your journey</p>
            </div>
          </div>
          <p className="mt-6 text-lg font-bold leading-7 text-slate-800">
            “You do not need to know everything today. You only need to start.”
          </p>
          <button
            onClick={() => go('profile')}
            className="mt-5 text-sm font-bold text-teal-700 hover:text-teal-800"
          >
            Complete your profile <ArrowRight className="ml-1 inline" size={15} />
          </button>
        </div>
      </section>
    </>
  )
}

function StatCard({
  icon,
  label,
  value,
  meta,
  tone,
  onClick,
  action,
}: {
  icon: React.ReactNode
  label: string
  value: string
  meta: string
  tone: string
  onClick: () => void
  action: string
}) {
  return (
    <button
      onClick={onClick}
      className="group rounded-3xl bg-white p-5 text-left shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-md"
    >
      <div
        className={`mb-5 grid size-10 place-items-center rounded-xl ${
          tone === 'teal'
            ? 'bg-teal-50 text-teal-600'
            : tone === 'blue'
            ? 'bg-blue-50 text-blue-600'
            : tone === 'orange'
            ? 'bg-orange-50 text-orange-600'
            : 'bg-violet-50 text-violet-600'
        }`}
      >
        {icon}
      </div>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-2 text-lg font-black text-slate-900 line-clamp-1">{value}</p>
      <div className="mt-1 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-500">{meta}</span>
        <span className="text-xs font-bold text-teal-700 opacity-0 transition group-hover:opacity-100">
          {action} →
        </span>
      </div>
    </button>
  )
}
