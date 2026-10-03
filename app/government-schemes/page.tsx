'use client'

import { Suspense } from 'react'
import { CareerSetuApp } from '@/app/page'

export default function GovernmentSchemesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f6faf9]" />}>
      <CareerSetuApp initialSection="schemes" />
    </Suspense>
  )
}
