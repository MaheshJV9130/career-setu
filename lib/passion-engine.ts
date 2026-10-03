import { PASSION_QUESTIONS } from './passion-questions'
import { ICareer } from '@/models/Career'

export interface PassionAnswerInput {
  questionId: number
  selectedOption: string
}

export interface CalculatedCareerMatch {
  careerId?: string
  slug: string
  title: string
  score: number
  matchPercentage: number
  reasons: string[]
}

const CAREER_METADATA: Record<string, { title: string; defaultReasons: string[] }> = {
  'software-developer': {
    title: 'Software Developer',
    defaultReasons: [
      'Demonstrated high aptitude for logical problem-solving and structured algorithms.',
      'Strong inclination toward digital technologies, coding, and building practical applications.',
      'Enjoys self-directed continuous learning in modern computing tools.',
    ],
  },
  'data-analyst': {
    title: 'Data Analyst',
    defaultReasons: [
      'Strong interest in uncovering patterns from numbers, charts, and facts.',
      'Appreciates data-driven decision making and statistical clarity.',
      'High comfort with spreadsheets, metrics, and quantitative investigations.',
    ],
  },
  'ui-ux-designer': {
    title: 'UI/UX Designer',
    defaultReasons: [
      'Creative flair for visual presentation, clean layouts, and aesthetic harmony.',
      'Empathizes with everyday users to make software intuitive and delightful.',
      'Balances artistic curiosity with practical digital product interfaces.',
    ],
  },
  'government-officer': {
    title: 'Government Officer',
    defaultReasons: [
      'High dedication to social welfare, public service, and citizen empowerment.',
      'Values institutional stability, constitutional governance, and leadership.',
      'Strong interest in general awareness, administrative discipline, and policy execution.',
    ],
  },
  'agriculture-specialist': {
    title: 'Agricultural Specialist',
    defaultReasons: [
      'Enjoys outdoor, field-oriented work in nature, soil, and sustainable farming.',
      'Interested in empowering rural farm productivity with modern techniques.',
      'Practical hands-on mindset solving real-world agro-economic challenges.',
    ],
  },
  'electrical-technician': {
    title: 'Electrician & Hardware Specialist',
    defaultReasons: [
      'Strong aptitude for physical machines, electrical circuits, and hardware tools.',
      'Hands-on troubleshooting instinct in practical household and industrial setups.',
      'Values dependable technical skills that are in high demand across all localities.',
    ],
  },
  'healthcare-assistant': {
    title: 'Healthcare & Nursing Professional',
    defaultReasons: [
      'Deep empathy, patience, and commitment to medical well-being.',
      'Desire to serve patients directly during crucial health needs.',
      'Calm communication style suited for community clinic and hospital settings.',
    ],
  },
  'teacher-educator': {
    title: 'School & Higher Secondary Teacher',
    defaultReasons: [
      'Passion for patiently mentoring youth and simplifying complex subjects.',
      'Strong verbal communication and joy in guiding others toward growth.',
      'Values educational empowerment as the ultimate foundation for societal progress.',
    ],
  },
}

export function calculateCareerMatches(
  answers: PassionAnswerInput[],
  dbCareers: ICareer[] = []
): CalculatedCareerMatch[] {
  const scores: Record<string, number> = {}
  const specificReasons: Record<string, string[]> = {}

  // Initialize
  for (const slug of Object.keys(CAREER_METADATA)) {
    scores[slug] = 0
    specificReasons[slug] = []
  }

  // Calculate scores based on submitted answers
  for (const ans of answers) {
    const q = PASSION_QUESTIONS.find((item) => item.id === ans.questionId)
    if (!q) continue

    const opt = q.options.find(
      (o) => o.text.trim().toLowerCase() === ans.selectedOption.trim().toLowerCase()
    )
    if (!opt) continue

    for (const [slug, weight] of Object.entries(opt.careerWeights)) {
      if (scores[slug] !== undefined) {
        scores[slug] += weight
      }
    }
  }

  // Theoretical maximum score per career across the 10 questions is ~30-36
  const entries = Object.entries(scores).map(([slug, rawScore]) => {
    const meta = CAREER_METADATA[slug]
    const dbMatch = dbCareers.find((c) => c.slug === slug)

    // Normalize match percentage realistically between 50% and 96%
    const maxTheoretical = 32
    const ratio = Math.min(rawScore / maxTheoretical, 1)
    const matchPercentage = Math.round(52 + ratio * 44) // gives 52% - 96%

    const reasons = [
      ...(meta?.defaultReasons || []),
      `Based on your responses across ${answers.length} interest areas.`,
    ].slice(0, 3)

    return {
      careerId: dbMatch?._id ? String(dbMatch._id) : undefined,
      slug,
      title: dbMatch?.title || meta?.title || slug,
      score: rawScore,
      matchPercentage,
      reasons,
    }
  })

  // Sort descending by match percentage and score
  entries.sort((a, b) => b.matchPercentage - a.matchPercentage || b.score - a.score)

  // Return top 3 matches
  return entries.slice(0, 3)
}
