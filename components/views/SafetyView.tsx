'use client'

import React from 'react'
import { CircleAlert, Check, X, ShieldAlert, PhoneCall } from 'lucide-react'
import { PageHeader } from './Common'

type T = Record<string, string>

export function SafetyView({ t }: { t: T }) {
  const scamExamples = [
    {
      title: 'Fake Scholarship Scam',
      quote: '“Pay ₹500 registration fee to receive a guaranteed ₹50,000 scholarship.”',
      note: 'Government scholarships NEVER require an upfront processing charge or payment.',
    },
    {
      title: 'Fake Internship & Job Offer',
      quote: '“Pay ₹2,000 training security deposit and get guaranteed direct employment without interview.”',
      note: 'Legitimate corporate and public internships pay stipends; they never collect security fees.',
    },
    {
      title: 'WhatsApp Job Recruitment Fraud',
      quote: '“Like 3 YouTube videos per day and earn ₹3,000 daily from home.”',
      note: 'A prevalent task-based financial trap designed to drain bank accounts via UPI.',
    },
  ]

  const warningSigns = [
    'Demands upfront processing fees, registration charge, or uniform money',
    'Promises 100% guaranteed selection or government appointment',
    'Uses free Gmail/Yahoo addresses (e.g. ssc.recruitment@gmail.com instead of .gov.in / .nic.in)',
    'Creates urgent deadlines: “Pay in 15 minutes or seat will be canceled”',
    'Requests Aadhaar OTP, bank OTP, or remote screen sharing apps (AnyDesk, TeamViewer)',
  ]

  const verificationRules = [
    'Always verify job circulars on official domains (.gov.in, .nic.in, or registered company website)',
    'Verify organization existence via MCA portal (Ministry of Corporate Affairs)',
    'Never transfer money to any individual UPI ID for a job or internship application',
    'Never share bank OTP, UPI PIN, or debit card CVV under any circumstance',
    'Check if the recruiter provides a verifiable official appointment letter with company CIN/LLPIN',
    'Report cyber fraud immediately at 1930 (National Cyber Crime Helpline) or cybercrime.gov.in',
  ]

  return (
    <>
      <PageHeader
        eyebrow="Scam awareness"
        title={t.safetyTitle}
        subtitle="Protect yourself, your friends, and your family from fake job advertisements, fraudulent scholarships, and cyber scams."
      />

      {/* Critical Alert Banner */}
      <div className="mb-8 flex items-center gap-4 rounded-3xl bg-red-600 p-6 text-white shadow-md shadow-red-600/10">
        <CircleAlert size={34} className="shrink-0" />
        <div>
          <p className="text-lg font-black tracking-tight">
            Never share OTP, passwords, UPI PIN, or banking credentials.
          </p>
          <p className="mt-1 text-sm text-red-100">
            No genuine company, government department, or scholarship board will EVER ask you to transfer
            money or share your OTP to offer an appointment.
          </p>
        </div>
      </div>

      {/* Scam Examples */}
      <div className="grid gap-5 md:grid-cols-3">
        {scamExamples.map((scam) => (
          <article
            key={scam.title}
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-2xl bg-red-50 text-red-600">
                  <ShieldAlert size={22} />
                </div>
                <h2 className="text-lg font-black text-slate-900">{scam.title}</h2>
              </div>

              <p className="mt-5 rounded-2xl bg-red-50 p-4 text-xs font-semibold leading-5 text-red-800 border border-red-100">
                {scam.quote}
              </p>
            </div>

            <p className="mt-4 text-xs font-medium text-slate-500">{scam.note}</p>
          </article>
        ))}
      </div>

      {/* Warning Signs */}
      <section className="mt-8 rounded-3xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-100">
        <h2 className="text-xl font-black text-slate-900">Major warning signs to watch for</h2>
        <ul className="mt-5 space-y-3 text-sm text-slate-600">
          {warningSigns.map((sign) => (
            <li key={sign} className="flex items-start gap-2.5">
              <X size={18} className="text-red-500 shrink-0 mt-0.5" />
              <span>{sign}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* How to verify */}
      <section className="mt-8 rounded-3xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900">How to verify genuine opportunities</h2>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
            Recommended Checklist
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {verificationRules.map((rule) => (
            <div
              key={rule}
              className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-xs font-semibold text-slate-700 leading-5"
            >
              <Check size={18} className="text-teal-600 shrink-0 mt-0.5" />
              <span>{rule}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-slate-100 p-4 text-xs text-slate-600 flex items-center justify-between flex-wrap gap-2">
          <span>Official National Cyber Crime Helpline: <strong>1930</strong> (Toll-Free, 24x7)</span>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-teal-700 hover:underline"
          >
            cybercrime.gov.in →
          </a>
        </div>
      </section>
    </>
  )
}
