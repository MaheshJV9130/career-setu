import { ok } from '@/lib/api-response'

export interface OpportunityItem {
  id: string
  name: string
  type: string
  detail: string
  place: string
  category: string
  isGovernment: boolean
  isFree: boolean
}

const LOCAL_OPPORTUNITIES: OpportunityItem[] = [
  {
    id: '1',
    name: 'Government Polytechnic Nashik',
    type: 'College',
    detail: 'Diploma Engineering Programs with AICTE approval',
    place: 'Nashik, Maharashtra',
    category: 'Colleges',
    isGovernment: true,
    isFree: false,
  },
  {
    id: '2',
    name: 'District Skill Development & Entrepreneurship Camp',
    type: 'Workshop',
    detail: 'Free industrial certification & job fair registration',
    place: 'Collectorate Ground, Nashik',
    category: 'Events',
    isGovernment: true,
    isFree: true,
  },
  {
    id: '3',
    name: 'Maha-ITI Training Centre',
    type: 'Training Centre',
    detail: 'Hands-on Electrician, Wireman, and Fitter trades',
    place: 'Satpur MIDC, Nashik',
    category: 'Training',
    isGovernment: true,
    isFree: false,
  },
  {
    id: '4',
    name: 'Yuva Rojgar Melawa (Youth Career Fair)',
    type: 'Career Event',
    detail: 'Direct employer interviews and spot apprenticeship letters',
    place: 'Nashik, Maharashtra',
    category: 'Events',
    isGovernment: true,
    isFree: true,
  },
  {
    id: '5',
    name: 'Rural Agriculture Polyhouse Technology Workshop',
    type: 'Training',
    detail: 'Modern drip irrigation and protected cultivation hands-on training',
    place: 'Dindori, Nashik District',
    category: 'Training',
    isGovernment: false,
    isFree: true,
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')?.trim()

  let list = LOCAL_OPPORTUNITIES
  if (category && category.toLowerCase() !== 'all') {
    if (category.toLowerCase() === 'free') {
      list = list.filter((item) => item.isFree)
    } else if (category.toLowerCase() === 'government') {
      list = list.filter((item) => item.isGovernment)
    } else {
      list = list.filter((item) => item.category.toLowerCase() === category.toLowerCase())
    }
  }

  return ok({ opportunities: list, total: list.length }, 'Opportunities retrieved successfully')
}
