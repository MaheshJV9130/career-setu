'use client'

import React, { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Sparkles, Target } from 'lucide-react'
import { PageHeader, Progress, Tag } from './Common'
import { PASSION_QUESTIONS } from '@/lib/passion-questions'
import { toast } from 'sonner'

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

interface CareerMatchItem {
  careerId?: string
  slug?: string
  title: string
  score: number
  matchPercentage: number
  reasons: string[]
  desc?: string
  skills?: string
  growth?: string
}

export function DiscoverView({
  t,
  go,
  onSelectCareer,
}: {
  t: T
  go: (s: Section) => void
  onSelectCareer?: (careerSlugOrId: string) => void
}) {
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(false)
  const [matches, setMatches] = useState<CareerMatchItem[] | null>(null)

  const currentQuestion = PASSION_QUESTIONS[currentQIndex]
  const selectedForCurrent = answers[currentQuestion.id] || ''

  const handleSelectOption = (optText: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optText }))
  }

  const handleNext = async () => {
    if (!selectedForCurrent) {
      toast.error('Please select an option to continue.')
      return
    }

    if (currentQIndex < PASSION_QUESTIONS.length - 1) {
      setCurrentQIndex(currentQIndex + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Submit assessment
      await submitAssessment()
    }
  }

  const handlePrev = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(currentQIndex - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const submitAssessment = async () => {
    setLoading(true)
    try {
      const payloadAnswers = PASSION_QUESTIONS.map((q) => ({
        questionId: q.id,
        selectedOption: answers[q.id] || q.options[0].text,
      }))

      const res = await fetch('/api/assessment/passion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: payloadAnswers }),
      })

      const data = await res.json()
      setLoading(false)

      if (!res.ok) {
        toast.error(data.message || 'Unable to compute matches.')
        return
      }

      const receivedMatches = data.data?.matches || data.matches || []
      setMatches(receivedMatches)
      toast.success('Your top career matches are ready!')
    } catch (error) {
      console.error('Error submitting assessment:', error)
      setLoading(false)
      toast.error('Network error submitting assessment.')
    }
  }

  const handleReset = () => {
    setAnswers({})
    setCurrentQIndex(0)
    setMatches(null)
  }

  const isDone = matches !== null

  return (
    <>
      <PageHeader
        eyebrow="Passion finder"
        title={isDone ? t.results : t.discoverTitle}
        subtitle={
          isDone
            ? 'Based on your interests and responses, these careers best match your strengths.'
            : t.discoverSub
        }
      />

      {!isDone ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_.4fr]">
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-10">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-teal-700">
                  {t.assessment} {currentQIndex + 1} of {PASSION_QUESTIONS.length}
                </span>
                <h2 className="mt-2 text-2xl font-black text-slate-900">
                  {currentQuestion.question}
                </h2>
                {currentQuestion.subtitle && (
                  <p className="mt-1 text-sm text-slate-500">{currentQuestion.subtitle}</p>
                )}
              </div>
              <div className="text-sm font-black text-slate-400">
                {Math.round(((currentQIndex + 1) / PASSION_QUESTIONS.length) * 100)}%
              </div>
            </div>

            <Progress value={((currentQIndex + 1) / PASSION_QUESTIONS.length) * 100} />

            <div className="mt-8 grid gap-3">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedForCurrent === option.text
                return (
                  <button
                    key={option.text}
                    onClick={() => handleSelectOption(option.text)}
                    className={`flex items-center justify-between rounded-2xl border p-4 text-left font-semibold transition ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50 text-teal-800'
                        : 'border-slate-200 hover:border-teal-300 bg-white'
                    }`}
                  >
                    <span>{option.text}</span>
                    {isSelected && <Check size={18} className="text-teal-700 shrink-0 ml-2" />}
                  </button>
                )
              })}
            </div>

            <div className="mt-8 flex items-center justify-between">
              {currentQIndex > 0 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="rounded-xl border border-slate-200 px-4 py-3 font-bold text-slate-600 hover:bg-slate-50 inline-flex items-center gap-2"
                >
                  <ArrowLeft size={16} /> Previous
                </button>
              ) : (
                <div />
              )}

              <button
                disabled={!selectedForCurrent || loading}
                onClick={handleNext}
                className="rounded-xl bg-teal-700 px-6 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-40 hover:bg-teal-800 transition inline-flex items-center gap-2"
              >
                {loading
                  ? 'Calculating matches…'
                  : currentQIndex === PASSION_QUESTIONS.length - 1
                  ? 'See my matches'
                  : 'Next question'}
                <ArrowRight size={17} />
              </button>
            </div>
          </section>

          <div className="rounded-3xl bg-[#e8f5f2] p-6 h-fit">
            <div className="grid size-12 place-items-center rounded-2xl bg-white text-teal-700">
              <Target />
            </div>
            <h3 className="mt-5 text-xl font-black text-slate-900">There are many good paths</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This assessment is a guidance tool tailored for rural and semi-urban students. It maps
              your authentic preferences to practical Indian employment and higher education tracks.
            </p>
            <div className="mt-6 rounded-2xl bg-white/70 p-4 border border-teal-100 text-xs font-semibold text-teal-900 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-orange-500 shrink-0" />
                <span>Deterministic scoring without guesswork</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-orange-500 shrink-0" />
                <span>Actionable learning roadmap upon completion</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {matches.map((career, i) => (
              <article
                key={career.title}
                className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid size-12 place-items-center rounded-2xl bg-teal-50 text-2xl text-teal-700">
                        {i === 0 ? '✦' : i === 1 ? '⌘' : '◎'}
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          {i === 0 ? 'Best match' : `Match ${i + 1}`}
                        </p>
                        <h2 className="text-xl font-black text-slate-900">{career.title}</h2>
                      </div>
                    </div>
                    <span className="text-2xl font-black text-teal-700">
                      {career.matchPercentage}%
                    </span>
                  </div>

                  <div className="mt-5 space-y-2">
                    <p className="text-xs font-bold uppercase text-slate-400">Why this fits you:</p>
                    <ul className="space-y-1.5 text-xs leading-5 text-slate-600">
                      {career.reasons.map((r, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <Check size={13} className="text-teal-600 shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      if (onSelectCareer && (career.slug || career.careerId)) {
                        onSelectCareer(career.slug || (career.careerId as string))
                      }
                      go('roadmap')
                    }}
                    className="w-full rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800 transition text-center"
                  >
                    View career roadmap →
                  </button>

                  <button
                    onClick={() => {
                      if (onSelectCareer && (career.slug || career.careerId)) {
                        onSelectCareer(career.slug || (career.careerId as string))
                      }
                      go('readiness')
                    }}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition text-center"
                  >
                    Check skill readiness
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleReset}
              className="rounded-3xl border-2 border-dashed border-slate-200 px-8 py-5 text-center font-bold text-slate-500 hover:border-teal-300 hover:text-teal-700 transition"
            >
              Retake assessment <ArrowRight className="ml-1 inline" size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
