import { ok } from '@/lib/api-response'

export interface CompetitionStat {
  id: string
  name: string
  seats: string
  applicants: string
  level: 'Balanced' | 'High' | 'Very high'
  value: number
  description: string
}

const COMPETITION_DATA: CompetitionStat[] = [
  {
    id: '1',
    name: 'State Engineering Entrance (MHT-CET / JEE)',
    seats: '1,40,000 seats',
    applicants: '4,50,000 applicants',
    level: 'High',
    value: 72,
    description: 'Consistent preparation in Physics, Chemistry, and Mathematics ensures admission to premier government colleges.',
  },
  {
    id: '2',
    name: 'State Public Service & Civil Exams (MPSC / UPSC)',
    seats: '600 - 1,200 posts',
    applicants: '3,00,000+ aspirants',
    level: 'Very high',
    value: 94,
    description: 'Highly competitive with multiple preliminary, mains, and interview rounds. Requires structured 1-2 year preparation.',
  },
  {
    id: '3',
    name: 'Skill-Based Tech Careers (Web & Data)',
    seats: 'High industry demand',
    applicants: 'Skill-dependent',
    level: 'Balanced',
    value: 48,
    description: 'Hiring is determined by verified skills and portfolio projects rather than pure examination ranks.',
  },
  {
    id: '4',
    name: 'Banking & Staff Selection (IBPS / SSC)',
    seats: '15,000+ vacancies',
    applicants: '15,00,000+ applicants',
    level: 'Very high',
    value: 88,
    description: 'Speed and accuracy in quantitative aptitude, reasoning, and current affairs are paramount.',
  },
  {
    id: '5',
    name: 'Vocational Trades & Solar Technician',
    seats: 'Growing local demand',
    applicants: 'Moderate',
    level: 'Balanced',
    value: 38,
    description: 'Continuous demand in tier-2/3 cities and rural towns with direct opportunities for self-employment.',
  },
]

export async function GET() {
  return ok({ competitions: COMPETITION_DATA }, 'Competition statistics retrieved successfully')
}
