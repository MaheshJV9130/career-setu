import { IGovernmentScheme } from '@/models/GovernmentScheme'

export type SchemeMatchStatus =
  | 'Potentially Eligible'
  | 'Possibly Relevant'
  | 'More Information Needed'
  | 'Not Matched'

export interface SchemeEvaluationResult {
  scheme: IGovernmentScheme
  status: SchemeMatchStatus
  matchScore: number
  reasons: string[]
  missingCriteria: string[]
}

export interface ProfileEligibilityInput {
  state?: string | null
  educationLevel?: string | null
  category?: string | null
  incomeLimit?: number | null
  gender?: string | null
  courseType?: string | null
}

export function checkSchemeEligibility(
  profile: ProfileEligibilityInput,
  schemes: IGovernmentScheme[]
): SchemeEvaluationResult[] {
  return schemes.map((scheme) => {
    const reasons: string[] = []
    const missingCriteria: string[] = []
    let positiveSignals = 0
    let negativeSignals = 0

    // 1. State check
    const normalizedState = profile.state?.trim().toLowerCase()
    const stateMatches =
      scheme.states.some((s) => s.toLowerCase() === 'all india') ||
      (normalizedState && scheme.states.some((s) => s.toLowerCase() === normalizedState))

    if (stateMatches) {
      positiveSignals += 2
      reasons.push(
        scheme.states.some((s) => s.toLowerCase() === 'all india')
          ? 'Applicable nationwide across all states.'
          : `Specifically targeted for students in ${profile.state}.`
      )
    } else if (profile.state) {
      negativeSignals += 3
    } else {
      missingCriteria.push('State location not specified.')
    }

    // 2. Education level check
    if (scheme.educationLevels.length === 0) {
      positiveSignals += 1
    } else if (profile.educationLevel) {
      const eduMatch = scheme.educationLevels.some(
        (lvl) => lvl.toLowerCase() === profile.educationLevel?.toLowerCase()
      )
      if (eduMatch) {
        positiveSignals += 2
        reasons.push(`Matches your current education level (${profile.educationLevel.replace('_', ' ')}).`)
      } else {
        negativeSignals += 2
      }
    } else {
      missingCriteria.push('Current education level required.')
    }

    // 3. Gender check
    const normalizedGender = profile.gender?.trim().toLowerCase()
    if (scheme.gender.toLowerCase() === 'all') {
      positiveSignals += 1
    } else if (normalizedGender) {
      if (scheme.gender.toLowerCase() === normalizedGender) {
        positiveSignals += 2
        reasons.push(`Reserved scheme for ${profile.gender} students.`)
      } else {
        negativeSignals += 5 // Strict mismatch
      }
    } else {
      missingCriteria.push('Gender verification needed for targeted reservations.')
    }

    // 4. Income limit check
    if (scheme.incomeLimit === null || scheme.incomeLimit === undefined) {
      positiveSignals += 1
      reasons.push('No stringent annual family income ceiling specified.')
    } else if (typeof profile.incomeLimit === 'number' && profile.incomeLimit > 0) {
      if (profile.incomeLimit <= scheme.incomeLimit) {
        positiveSignals += 2
        reasons.push(`Annual family income is within ₹${scheme.incomeLimit.toLocaleString('en-IN')} limit.`)
      } else {
        negativeSignals += 3
      }
    } else {
      missingCriteria.push(`Income eligibility certificate required (max ₹${scheme.incomeLimit.toLocaleString('en-IN')}).`)
    }

    // 5. Category check (General, OBC, SC, ST, EWS)
    if (scheme.categories.some((c) => c.toLowerCase() === 'all')) {
      positiveSignals += 1
    } else if (profile.category) {
      const catMatch = scheme.categories.some(
        (c) => c.toLowerCase() === profile.category?.trim().toLowerCase()
      )
      if (catMatch) {
        positiveSignals += 2
        reasons.push(`Applies to ${profile.category} category.`)
      } else {
        negativeSignals += 2
      }
    } else {
      missingCriteria.push('Category certificate verification needed.')
    }

    // Determine final status — Never say "You are definitely eligible"
    let status: SchemeMatchStatus
    if (negativeSignals >= 3) {
      status = 'Not Matched'
    } else if (positiveSignals >= 6 && missingCriteria.length === 0) {
      status = 'Potentially Eligible'
    } else if (positiveSignals >= 4) {
      status = 'Possibly Relevant'
    } else if (missingCriteria.length > 0) {
      status = 'More Information Needed'
    } else {
      status = 'Not Matched'
    }

    return {
      scheme,
      status,
      matchScore: positiveSignals,
      reasons,
      missingCriteria,
    }
  })
}
