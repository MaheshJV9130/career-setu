'use client'

import React, { useState } from 'react'
import { ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react'
import { PageHeader, Tag } from './Common'

type T = Record<string, string>

interface PortalItem {
  name: string
  category: 'Government' | 'Learning' | 'Scholarships' | 'Jobs'
  desc: string
  url: string
  isOfficial: boolean
}

const TRUSTED_PORTALS: PortalItem[] = [
  {
    name: 'National Career Service (NCS)',
    category: 'Jobs',
    desc: 'Government of India initiative connecting jobseekers with verified employers, counselors, and vocational training.',
    url: 'https://www.ncs.gov.in',
    isOfficial: true,
  },
  {
    name: 'National Scholarship Portal (NSP)',
    category: 'Scholarships',
    desc: 'One-stop electronic portal for applying to all central and state government pre-matric and post-matric scholarships.',
    url: 'https://scholarships.gov.in',
    isOfficial: true,
  },
  {
    name: 'AICTE Student Portal',
    category: 'Government',
    desc: 'All India Council for Technical Education portal for accredited engineering colleges, scholarships, and internships.',
    url: 'https://www.aicte-india.org',
    isOfficial: true,
  },
  {
    name: 'Skill India Digital Hub',
    category: 'Learning',
    desc: 'Ministry of Skill Development digital hub offering vocational certificates and apprenticeship matching.',
    url: 'https://www.skillindiadigital.gov.in',
    isOfficial: true,
  },
  {
    name: 'SWAYAM & NPTEL',
    category: 'Learning',
    desc: 'Free online courses taught by professors from IITs, IISc, and central universities with verified exam certificates.',
    url: 'https://swayam.gov.in',
    isOfficial: true,
  },
  {
    name: 'MDN Web Docs',
    category: 'Learning',
    desc: 'The global standard open documentation for web standards, HTML, CSS, JavaScript, and developer tools.',
    url: 'https://developer.mozilla.org',
    isOfficial: false,
  },
  {
    name: 'Kaggle Learn',
    category: 'Learning',
    desc: 'Free interactive data science and machine learning tutorials with hands-on coding in cloud notebooks.',
    url: 'https://www.kaggle.com/learn',
    isOfficial: false,
  },
  {
    name: 'MahaDBT Scholarship Portal',
    category: 'Scholarships',
    desc: 'Official direct benefit transfer portal for students studying in colleges across Maharashtra state.',
    url: 'https://mahadbt.maharashtra.gov.in',
    isOfficial: true,
  },
]

export function ResourcesView({ t }: { t: T }) {
  const [filter, setFilter] = useState('All resources')

  const filterTabs = ['All resources', 'Government', 'Learning', 'Scholarships', 'Jobs']

  const filtered = TRUSTED_PORTALS.filter((item) => {
    if (filter === 'All resources') return true
    return item.category === filter
  })

  return (
    <>
      <PageHeader
        eyebrow="Verified links"
        title={t.resourcesTitle}
        subtitle="Start with resources that are reliable, accessible, and clear about their official authority."
      />

      {/* Filter Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filterTabs.map((tab) => {
          const isSelected = filter === tab
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                isSelected
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-teal-700'
              }`}
            >
              {tab}
            </button>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((portal) => (
          <article
            key={portal.name}
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="grid size-11 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                  <ShieldCheck size={21} />
                </div>
                <Tag tone={portal.isOfficial ? 'teal' : 'blue'}>
                  {portal.isOfficial ? t.official : t.trusted}
                </Tag>
              </div>

              <h2 className="mt-5 text-lg font-black text-slate-900">{portal.name}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{portal.desc}</p>
            </div>

            <a
              href={portal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-800 transition"
            >
              Open resource <ExternalLink size={15} />
            </a>
          </article>
        ))}
      </div>
    </>
  )
}
