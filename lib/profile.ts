type ProfileLike = { educationLevel?: string; district?: string; state?: string; interests?: string[]; careerGoals?: string[]; currentCourse?: string; institution?: string; subjects?: string[] }

export function calculateProfileCompletion(profile: ProfileLike) {
  const checks = [Boolean(profile.educationLevel), Boolean(profile.district), Boolean(profile.state), Boolean(profile.interests?.length), Boolean(profile.careerGoals?.length), Boolean(profile.currentCourse), Boolean(profile.institution), Boolean(profile.subjects?.length)]
  const percentage = Math.round((checks.filter(Boolean).length / checks.length) * 100)
  return { percentage, completed: checks.slice(0, 5).every(Boolean) }
}
