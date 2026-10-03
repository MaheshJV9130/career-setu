import React from 'react'

export function Progress({
  value,
  color = 'bg-teal-500',
}: {
  value: number
  color?: string
}) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

export function Tag({
  children,
  tone = 'teal',
}: {
  children: React.ReactNode
  tone?: 'teal' | 'orange' | 'blue' | 'red' | 'purple'
}) {
  let classes = 'bg-teal-50 text-teal-700'
  if (tone === 'orange') classes = 'bg-orange-50 text-orange-700'
  if (tone === 'blue') classes = 'bg-blue-50 text-blue-700'
  if (tone === 'red') classes = 'bg-red-50 text-red-700'
  if (tone === 'purple') classes = 'bg-purple-50 text-purple-700'

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${classes}`}
    >
      {children}
    </span>
  )
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: string
  subtitle: string
}) {
  return (
    <div className="mb-8 max-w-3xl">
      <div className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-teal-600">
        {eyebrow}
      </div>
      <h1 className="text-balance text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-base leading-7 text-slate-500">{subtitle}</p>
    </div>
  )
}
