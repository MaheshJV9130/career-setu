'use client'

import React, { useEffect, useState } from 'react'
import { PageHeader, Progress, Tag } from './Common'
import { toast } from 'sonner'
import { ArrowRight, CheckCircle2, RotateCw } from 'lucide-react'

type T = Record<string, string>

interface SkillItem {
  name: string
  description?: string
  importance: 'low' | 'medium' | 'high'
  requiredLevel: 'beginner' | 'intermediate' | 'advanced'
}

interface CareerItem {
  _id: string
  title: string
  slug: string
  category: string
  skills: SkillItem[]
}

interface ReadinessResult {
  overallScore: number
  status: 'Needs Major Improvement' | 'Developing' | 'Good' | 'Career Ready'
  skillAssessments: Array<{
    skillName: string
    requiredLevel: string
    userLevel: string
    score: number
    status: string
  }>
  recommendations: string[]
}

export function ReadinessView({
  t,
  selectedCareerSlug,
}: {
  t: T
  selectedCareerSlug?: string
}) {
  const [careers, setCareers] = useState<CareerItem[]>([])
  const [selectedCareer, setSelectedCareer] = useState<CareerItem | null>(null)
  const [userSkillLevels, setUserSkillLevels] = useState<Record<string, 'beginner' | 'intermediate' | 'advanced'>>({})
  const [readinessResult, setReadinessResult] = useState<ReadinessResult | null>(null)
  const [loadingCareers, setLoadingCareers] = useState(true)
  const [evaluating, setEvaluating] = useState(false)

  // 1. Fetch careers list
  useEffect(() => {
    async function loadCareers() {
      try {
        const res = await fetch('/api/careers')
        if (res.ok) {
          const data = await res.json()
          const list: CareerItem[] = data.data?.careers || data.careers || []
          setCareers(list)

          // Pick default career
          if (list.length > 0) {
            const initial =
              list.find((c) => c.slug === selectedCareerSlug) ||
              list.find((c) => c.slug === 'software-developer') ||
              list[0]
            setSelectedCareer(initial)
            initializeSkillLevels(initial)
          }
        }
      } catch (err) {
        console.error('Failed to load careers:', err)
      } finally {
        setLoadingCareers(false)
      }
    }

    loadCareers()
  }, [selectedCareerSlug])

  const initializeSkillLevels = (c: CareerItem) => {
    const defaults: Record<string, 'beginner' | 'intermediate' | 'advanced'> = {}
    c.skills.forEach((s, idx) => {
      // Default to intermediate for first skill, beginner for others
      defaults[s.name] = idx === 0 ? 'intermediate' : 'beginner'
    })
    setUserSkillLevels(defaults)
  }

  const handleCareerChange = (c: CareerItem) => {
    setSelectedCareer(c)
    initializeSkillLevels(c)
    setReadinessResult(null)
  }

  const handleLevelChange = (skillName: string, level: 'beginner' | 'intermediate' | 'advanced') => {
    setUserSkillLevels((prev) => ({ ...prev, [skillName]: level }))
  }

  const handleEvaluate = async () => {
    if (!selectedCareer) return
    setEvaluating(true)

    try {
      const assessments = selectedCareer.skills.map((s) => ({
        skillName: s.name,
        userLevel: userSkillLevels[s.name] || 'beginner',
      }))

      const res = await fetch('/api/assessment/readiness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          careerId: selectedCareer._id,
          skillAssessments: assessments,
        }),
      })

      const data = await res.json()
      setEvaluating(false)

      if (!res.ok) {
        toast.error(data.message || 'Unable to evaluate readiness.')
        return
      }

      const result = data.data?.readiness || data.readiness
      setReadinessResult(result)
      toast.success(`Career readiness evaluated: ${result.overallScore}% (${result.status})`)
    } catch (err) {
      console.error('Error evaluating readiness:', err)
      setEvaluating(false)
      toast.error('Network error evaluating readiness.')
    }
  }

  if (loadingCareers) {
    return <div className="py-12 text-center text-slate-400">Loading career options…</div>
  }

  return (
    <>
      <PageHeader
        eyebrow="Career readiness"
        title="See how prepared you are"
        subtitle="Choose a career to understand your current strengths, detect skill gaps, and view actionable next steps."
      />

      {/* Career Selector Pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        {careers.map((career) => {
          const isSelected = selectedCareer?.slug === career.slug
          return (
            <button
              key={career.slug}
              onClick={() => handleCareerChange(career)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                isSelected
                  ? 'border border-teal-600 bg-teal-50 text-teal-800 font-bold shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-teal-400 hover:text-teal-700'
              }`}
            >
              {career.title}
            </button>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[.7fr_1.3fr]">
        {/* Left: Overall Readiness Score Card */}
        <section className="rounded-3xl bg-[#123f4a] p-8 text-white flex flex-col justify-between">
          <div>
            <p className="text-sm font-semibold text-teal-200">Overall readiness</p>
            <div className="mt-6 flex items-end gap-2">
              <span className="text-7xl font-black">
                {readinessResult ? readinessResult.overallScore : 72}
              </span>
              <span className="mb-3 text-2xl">%</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-teal-100">
              {readinessResult
                ? readinessResult.status === 'Career Ready'
                  ? 'You possess strong industry-standard competencies. Focus on capstones and interviews.'
                  : readinessResult.status === 'Good'
                  ? 'You have a solid foundation. Concentrate on improving high-priority gaps below.'
                  : 'Developing your foundation. Consistent practice will boost your career confidence.'
                : 'You have a good base. Select your skill proficiencies on the right and evaluate.'}
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <Progress
              value={readinessResult ? readinessResult.overallScore : 72}
              color="bg-orange-400"
            />
            <div className="flex justify-between items-center text-xs font-bold text-teal-100">
              <span>{selectedCareer?.title || 'Selected Career'}</span>
              <span>{readinessResult ? readinessResult.status : 'Estimated Baseline'}</span>
            </div>

            <button
              onClick={handleEvaluate}
              disabled={evaluating}
              className="mt-4 w-full rounded-xl bg-orange-400 px-4 py-3 font-bold text-orange-950 shadow hover:bg-orange-300 transition disabled:opacity-50"
            >
              {evaluating ? 'Evaluating…' : 'Re-calculate readiness'}
            </button>
          </div>
        </section>

        {/* Right: Interactive Skills Snapshot */}
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">Skills snapshot</h2>
            <span className="text-xs text-slate-400 font-semibold">Select your current level</span>
          </div>

          <div className="mt-6 space-y-6">
            {selectedCareer?.skills.map((skill) => {
              const currentLevel = userSkillLevels[skill.name] || 'beginner'
              const evaluatedSkill = readinessResult?.skillAssessments.find(
                (s) => s.skillName.toLowerCase() === skill.name.toLowerCase()
              )

              const displayStatus = evaluatedSkill
                ? evaluatedSkill.status
                : currentLevel === skill.requiredLevel
                ? 'Good'
                : currentLevel === 'advanced'
                ? 'Good'
                : 'Needs improvement'

              const scoreValue = evaluatedSkill
                ? evaluatedSkill.score
                : currentLevel === 'advanced'
                ? 100
                : currentLevel === 'intermediate'
                ? 65
                : 35

              return (
                <div key={skill.name} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-bold text-slate-900">{skill.name}</p>
                      <p className="text-xs text-slate-400">
                        Target: <span className="capitalize font-medium text-slate-600">{skill.requiredLevel}</span>
                        {skill.description ? ` · ${skill.description}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Skill Level Buttons */}
                      <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
                        {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => handleLevelChange(skill.name, lvl)}
                            className={`px-2 py-1 rounded-md font-semibold capitalize transition ${
                              currentLevel === lvl
                                ? 'bg-teal-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {lvl.slice(0, 3)}
                          </button>
                        ))}
                      </div>

                      <Tag
                        tone={
                          displayStatus === 'Priority'
                            ? 'red'
                            : displayStatus === 'Good'
                            ? 'teal'
                            : 'orange'
                        }
                      >
                        {displayStatus}
                      </Tag>
                    </div>
                  </div>

                  <div className="mt-3">
                    <Progress
                      value={scoreValue}
                      color={
                        displayStatus === 'Priority'
                          ? 'bg-red-400'
                          : displayStatus === 'Good'
                          ? 'bg-teal-500'
                          : 'bg-orange-400'
                      }
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      {/* Recommended Next Steps */}
      <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <h2 className="text-xl font-black text-slate-900">Recommended next steps</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {(readinessResult?.recommendations || [
            'Practice algorithmic problem solving and core data structures',
            'Build 2 practical portfolio projects matching industry requirements',
            'Study database normalization and SQL query writing',
            'Improve resume and GitHub documentation for technical recruiters',
          ]).map((item, i) => (
            <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
              <span className="grid size-8 place-items-center rounded-full bg-teal-100 text-sm font-black text-teal-700 shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="font-semibold text-sm text-slate-800 leading-snug">{item}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
