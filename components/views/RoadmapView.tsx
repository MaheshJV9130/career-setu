'use client'

import React, { useEffect, useState } from 'react'
import { Check, CheckCircle2, Circle, Clock, Sparkles } from 'lucide-react'
import { PageHeader, Progress, Tag } from './Common'
import { toast } from 'sonner'

type T = Record<string, string>

interface RoadmapStep {
  stepNumber: number
  title: string
  description?: string
  skills?: string[]
  estimatedDuration?: string
  completed: boolean
  completedAt?: string | null
}

interface UserRoadmapData {
  _id: string
  career: {
    _id: string
    title: string
    slug: string
  }
  steps: RoadmapStep[]
  overallProgress: number
}

interface CareerOption {
  _id: string
  title: string
  slug: string
}

export function RoadmapView({
  t,
  selectedCareerSlug,
}: {
  t: T
  selectedCareerSlug?: string
}) {
  const [careerList, setCareerList] = useState<CareerOption[]>([])
  const [currentCareerSlug, setCurrentCareerSlug] = useState<string>(selectedCareerSlug || 'software-developer')
  const [roadmap, setRoadmap] = useState<UserRoadmapData | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingStep, setUpdatingStep] = useState<number | null>(null)

  // 1. Load career list
  useEffect(() => {
    async function loadCareers() {
      try {
        const res = await fetch('/api/careers')
        if (res.ok) {
          const data = await res.json()
          const careers: CareerOption[] = data.data?.careers || data.careers || []
          setCareerList(careers)
          if (selectedCareerSlug) {
            setCurrentCareerSlug(selectedCareerSlug)
          } else if (careers.length > 0 && !currentCareerSlug) {
            setCurrentCareerSlug(careers[0].slug)
          }
        }
      } catch (err) {
        console.error('Error loading career options:', err)
      }
    }
    loadCareers()
  }, [selectedCareerSlug])

  // 2. Load roadmap for current career
  useEffect(() => {
    async function fetchRoadmap() {
      if (!currentCareerSlug) return
      setLoading(true)
      try {
        const res = await fetch(`/api/roadmaps/${currentCareerSlug}`)
        if (res.ok) {
          const data = await res.json()
          const loadedRoadmap = data.data?.roadmap || data.roadmap
          setRoadmap(loadedRoadmap)
        } else {
          // If unauthenticated or no roadmap, fallback to template from career
          const cRes = await fetch(`/api/careers/${currentCareerSlug}`)
          if (cRes.ok) {
            const cData = await cRes.json()
            const c = cData.data?.career || cData.career
            if (c) {
              setRoadmap({
                _id: 'temp',
                career: { _id: c._id, title: c.title, slug: c.slug },
                steps: (c.roadmap || []).map((s: any) => ({
                  ...s,
                  completed: s.stepNumber <= 2, // Sample initial completed state
                })),
                overallProgress: 33,
              })
            }
          }
        }
      } catch (err) {
        console.error('Error fetching roadmap:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRoadmap()
  }, [currentCareerSlug])

  const toggleStep = async (stepNumber: number, currentCompleted: boolean) => {
    if (!roadmap) return
    setUpdatingStep(stepNumber)

    try {
      const res = await fetch('/api/roadmaps', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          careerId: roadmap.career?._id || currentCareerSlug,
          stepNumber,
          completed: !currentCompleted,
        }),
      })

      const data = await res.json()
      setUpdatingStep(null)

      if (res.ok) {
        const updatedSteps = roadmap.steps.map((s) =>
          s.stepNumber === stepNumber ? { ...s, completed: !currentCompleted } : s
        )
        const completedCount = updatedSteps.filter((s) => s.completed).length
        const newProgress = Math.round((completedCount / (updatedSteps.length || 1)) * 100)

        setRoadmap({
          ...roadmap,
          steps: updatedSteps,
          overallProgress: newProgress,
        })

        toast.success(
          !currentCompleted
            ? `Step ${stepNumber} marked as completed!`
            : `Step ${stepNumber} marked as in progress.`
        )
      } else {
        // Fallback local toggle for guest mode
        const updatedSteps = roadmap.steps.map((s) =>
          s.stepNumber === stepNumber ? { ...s, completed: !currentCompleted } : s
        )
        const completedCount = updatedSteps.filter((s) => s.completed).length
        const newProgress = Math.round((completedCount / (updatedSteps.length || 1)) * 100)

        setRoadmap({
          ...roadmap,
          steps: updatedSteps,
          overallProgress: newProgress,
        })
      }
    } catch (err) {
      console.error('Error updating step:', err)
      setUpdatingStep(null)
    }
  }

  const completedSteps = roadmap?.steps.filter((s) => s.completed).length || 0
  const totalSteps = roadmap?.steps.length || 6
  const progressPercent = roadmap?.overallProgress || Math.round((completedSteps / totalSteps) * 100)

  return (
    <>
      <PageHeader
        eyebrow={roadmap?.career?.title || 'Personalized Track'}
        title={t.roadmapTitle}
        subtitle="A clear, structured path from your current skills to your first verified employment opportunity."
      />

      {/* Career selector */}
      <div className="mb-6 flex flex-wrap gap-2">
        {careerList.map((c) => (
          <button
            key={c.slug}
            onClick={() => setCurrentCareerSlug(c.slug)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              currentCareerSlug === c.slug
                ? 'border border-teal-600 bg-teal-50 text-teal-800 font-bold shadow-sm'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-teal-400 hover:text-teal-700'
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      {/* Progress Summary Card */}
      <div className="mb-7 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-slate-500">Your roadmap progress</p>
            <p className="mt-1 text-2xl font-black text-slate-900">
              {completedSteps} / {totalSteps} steps completed
            </p>
          </div>
          <div className="text-right min-w-[160px]">
            <span className="text-3xl font-black text-teal-700">{progressPercent}%</span>
            <div className="mt-1">
              <Progress value={progressPercent} color="bg-teal-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline of Steps */}
      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading your personalized roadmap…</div>
      ) : (
        <div className="relative ml-4 border-l-2 border-teal-100 pl-8 space-y-7">
          {roadmap?.steps.map((step, i) => {
            const isCompleted = step.completed
            const isFirstPending = !isCompleted && roadmap.steps.slice(0, i).every((s) => s.completed)
            const statusLabel = isCompleted ? 'Completed' : isFirstPending ? 'In progress' : 'Next up'

            return (
              <div key={step.stepNumber} className="relative">
                {/* Node Icon on Timeline */}
                <div
                  className={`absolute -left-[53px] grid size-10 place-items-center rounded-full border-4 border-[#f6faf9] text-sm font-black transition-all ${
                    isCompleted
                      ? 'bg-teal-600 text-white'
                      : isFirstPending
                      ? 'bg-orange-400 text-white shadow-md shadow-orange-500/20'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check size={18} strokeWidth={3} /> : step.stepNumber}
                </div>

                <article
                  className={`rounded-3xl p-6 transition ${
                    isFirstPending
                      ? 'bg-orange-50/70 ring-1 ring-orange-200/80 shadow-sm'
                      : isCompleted
                      ? 'bg-white shadow-sm ring-1 ring-teal-100/60'
                      : 'bg-white shadow-sm ring-1 ring-slate-100'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Step {step.stepNumber}
                        {step.estimatedDuration ? ` · ${step.estimatedDuration}` : ''}
                      </p>
                      <h2 className="mt-1 text-xl font-black text-slate-900">{step.title}</h2>
                    </div>

                    <div className="flex items-center gap-3">
                      <Tag
                        tone={
                          isCompleted
                            ? 'teal'
                            : isFirstPending
                            ? 'orange'
                            : 'blue'
                        }
                      >
                        {statusLabel}
                      </Tag>

                      <button
                        onClick={() => toggleStep(step.stepNumber, isCompleted)}
                        disabled={updatingStep === step.stepNumber}
                        className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition flex items-center gap-1.5 ${
                          isCompleted
                            ? 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                            : 'bg-teal-700 text-white hover:bg-teal-800 shadow-xs'
                        }`}
                      >
                        {isCompleted ? 'Mark incomplete' : 'Mark complete'}
                      </button>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {step.description || 'Master key fundamentals and complete the recommended milestone.'}
                  </p>

                  {step.skills && step.skills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {step.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-slate-100/80 px-2.5 py-1 text-xs font-semibold text-slate-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
