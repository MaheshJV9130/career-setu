export type ProfileLike = {
  educationLevel?: string | null
  district?: string | null
  state?: string | null
  interests?: string[] | null
  careerGoals?: string[] | null
  currentCourse?: string | null
  institution?: string | null
  subjects?: string[] | null
  age?: number | null
}

export function calculateProfileCompletion(profile: ProfileLike): { percentage: number; completed: boolean } {
  if (!profile) return { percentage: 0, completed: false }

  const checks = [
    Boolean(profile.educationLevel && profile.educationLevel.trim()),
    Boolean(profile.district && profile.district.trim()),
    Boolean(profile.state && profile.state.trim()),
    Boolean(Array.isArray(profile.interests) && profile.interests.length > 0),
    Boolean(Array.isArray(profile.careerGoals) && profile.careerGoals.length > 0),
    Boolean(profile.currentCourse && profile.currentCourse.trim()),
    Boolean(profile.institution && profile.institution.trim()),
    Boolean(Array.isArray(profile.subjects) && profile.subjects.length > 0),
    Boolean(typeof profile.age === 'number' && profile.age > 0),
  ]

  const count = checks.filter(Boolean).length
  const percentage = Math.round((count / checks.length) * 100)
  // Completed if at least 70% or basic core info is provided
  const completed = count >= 6 || checks.slice(0, 5).every(Boolean)

  return { percentage, completed }
}
