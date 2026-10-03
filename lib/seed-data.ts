import { connectDB } from './db'
import { Career } from '@/models/Career'
import { GovernmentScheme } from '@/models/GovernmentScheme'
import { LearningResource } from '@/models/LearningResource'
import { User } from '@/models/User'
import bcrypt from 'bcryptjs'

export const SEED_CAREERS = [
  {
    title: 'Software Developer',
    slug: 'software-developer',
    description: 'Build responsive websites, mobile apps, and robust software systems used across India and globally.',
    category: 'Technology',
    growthLevel: 'Very High',
    difficulty: 'Moderate to High',
    educationRequirements: ['12th Science / Diploma', 'BCA / BSc CS / BTech / Self-taught with portfolio'],
    skills: [
      { name: 'Programming Basics', description: 'Python, C++, or JavaScript basics', importance: 'high', requiredLevel: 'intermediate' },
      { name: 'Data Structures & Algorithms', description: 'Arrays, maps, recursion, problem solving', importance: 'high', requiredLevel: 'advanced' },
      { name: 'Web Development', description: 'HTML, CSS, React, Next.js, Node.js', importance: 'high', requiredLevel: 'intermediate' },
      { name: 'Databases & SQL', description: 'MongoDB, PostgreSQL, query optimization', importance: 'medium', requiredLevel: 'intermediate' },
      { name: 'Git & Version Control', description: 'GitHub branching, pull requests, collaboration', importance: 'medium', requiredLevel: 'intermediate' },
    ],
    roadmap: [
      { stepNumber: 1, title: 'Education Foundation', description: 'Master computer fundamentals, logic building, and discrete mathematics.', skills: ['Logic', 'Computer Basics'], estimatedDuration: '4 weeks' },
      { stepNumber: 2, title: 'Learn Core Programming', description: 'Pick one language (Python or JavaScript) and practice syntax and control flow.', skills: ['Python', 'JavaScript'], estimatedDuration: '6 weeks' },
      { stepNumber: 3, title: 'Data Structures & Web Basics', description: 'Understand basic data structures and build static websites with HTML/CSS.', skills: ['Data Structures', 'HTML/CSS'], estimatedDuration: '6 weeks' },
      { stepNumber: 4, title: 'Full-Stack Development & APIs', description: 'Build interactive web apps using React, Next.js, REST APIs, and databases.', skills: ['React', 'Next.js', 'MongoDB'], estimatedDuration: '8 weeks' },
      { stepNumber: 5, title: 'Portfolio Projects & Git', description: 'Deploy 2-3 real-world projects and showcase them on your GitHub profile.', skills: ['GitHub', 'Project Deployment'], estimatedDuration: '4 weeks' },
      { stepNumber: 6, title: 'Internship & Job Applications', description: 'Craft your resume, prepare interview questions, and apply via National Career Service.', skills: ['Interview Prep', 'Resume'], estimatedDuration: '4 weeks' },
    ],
  },
  {
    title: 'Data Analyst',
    slug: 'data-analyst',
    description: 'Transform complex raw data into actionable insights, dashboards, and charts for business decision-making.',
    category: 'Data & Analytics',
    growthLevel: 'High',
    difficulty: 'Moderate',
    educationRequirements: ['12th Any Stream (Math/Stats preferred)', 'Graduation in Science, Commerce, BCA, or Engineering'],
    skills: [
      { name: 'Advanced Excel & Spreadsheets', description: 'Pivot tables, VLOOKUP/XLOOKUP, formulas', importance: 'high', requiredLevel: 'advanced' },
      { name: 'SQL & Relational Databases', description: 'JOINs, GROUP BY, aggregations, data extraction', importance: 'high', requiredLevel: 'advanced' },
      { name: 'Python for Data Analysis', description: 'Pandas, NumPy, Matplotlib, data cleaning', importance: 'high', requiredLevel: 'intermediate' },
      { name: 'Business Intelligence (Power BI/Tableau)', description: 'Interactive dashboard creation and reporting', importance: 'medium', requiredLevel: 'intermediate' },
      { name: 'Business Communication', description: 'Explaining insights to non-technical managers', importance: 'medium', requiredLevel: 'intermediate' },
    ],
    roadmap: [
      { stepNumber: 1, title: 'Spreadsheet Mastery', description: 'Learn advanced Excel techniques, formulas, pivot tables, and data cleaning.', skills: ['Excel', 'Data Cleaning'], estimatedDuration: '4 weeks' },
      { stepNumber: 2, title: 'SQL Fundamentals', description: 'Learn relational database queries, filtering, grouping, and analytical functions.', skills: ['SQL', 'PostgreSQL'], estimatedDuration: '6 weeks' },
      { stepNumber: 3, title: 'Python for Data Analysis', description: 'Use Pandas and Jupyter notebooks to manipulate datasets and extract summaries.', skills: ['Python', 'Pandas'], estimatedDuration: '6 weeks' },
      { stepNumber: 4, title: 'Dashboarding & Visualization', description: 'Build interactive dashboards in Power BI or Tableau.', skills: ['Power BI', 'Visualization'], estimatedDuration: '4 weeks' },
      { stepNumber: 5, title: 'Case Study Projects', description: 'Analyze public Indian datasets (census, agriculture, finance) and publish reports.', skills: ['Case Studies', 'Kaggle'], estimatedDuration: '4 weeks' },
    ],
  },
  {
    title: 'UI/UX Designer',
    slug: 'ui-ux-designer',
    description: 'Design intuitive, accessible digital experiences and visual layouts for websites and smartphone applications.',
    category: 'Creative Design',
    growthLevel: 'High',
    difficulty: 'Moderate',
    educationRequirements: ['12th Any Stream', 'Diploma or Degree in Design, Arts, Multimedia, or Self-taught'],
    skills: [
      { name: 'Figma & UI Prototyping', description: 'Wireframing, auto-layout, components, interactive prototypes', importance: 'high', requiredLevel: 'advanced' },
      { name: 'User Research & Empathy', description: 'User interviews, personas, usability testing', importance: 'high', requiredLevel: 'intermediate' },
      { name: 'Visual Design & Typography', description: 'Color theory, spacing, typography hierarchy, design systems', importance: 'high', requiredLevel: 'intermediate' },
      { name: 'Accessibility & Local UI', description: 'Designing for vernacular languages and low-bandwidth rural networks', importance: 'medium', requiredLevel: 'intermediate' },
    ],
    roadmap: [
      { stepNumber: 1, title: 'Design Principles & Layout', description: 'Study typography, contrast, visual hierarchy, and Indian mobile UX patterns.', skills: ['Design Theory'], estimatedDuration: '3 weeks' },
      { stepNumber: 2, title: 'Figma Mastery', description: 'Learn components, auto-layout, design tokens, and interactive animations.', skills: ['Figma'], estimatedDuration: '5 weeks' },
      { stepNumber: 3, title: 'User Research & Wireframing', description: 'Conduct usability tests and craft low-fidelity wireframes for practical apps.', skills: ['User Research'], estimatedDuration: '4 weeks' },
      { stepNumber: 4, title: 'Build Design Case Studies', description: 'Redesign a government portal or rural utility app with full documentation.', skills: ['Case Studies', 'Portfolio'], estimatedDuration: '6 weeks' },
    ],
  },
  {
    title: 'Government Officer',
    slug: 'government-officer',
    description: 'Serve communities through public administration, civil services, state commissions, and banking institutions.',
    category: 'Public Administration',
    growthLevel: 'Stable',
    difficulty: 'High',
    educationRequirements: ['Bachelor Degree in any discipline from a recognized University'],
    skills: [
      { name: 'General Studies & Current Affairs', description: 'Indian Polity, Economy, Geography, History', importance: 'high', requiredLevel: 'advanced' },
      { name: 'Quantitative Aptitude & Reasoning', description: 'Logical deduction, data interpretation, arithmetic', importance: 'high', requiredLevel: 'advanced' },
      { name: 'Administrative Communication', description: 'Official letter writing, comprehension, precise drafting', importance: 'medium', requiredLevel: 'intermediate' },
      { name: 'Constitutional Awareness', description: 'Fundamental Rights, Directive Principles, district administration', importance: 'high', requiredLevel: 'intermediate' },
    ],
    roadmap: [
      { stepNumber: 1, title: 'Syllabus & Exam Pattern Analysis', description: 'Review UPSC, MPSC, SSC CGL, or IBPS notification syllabus and past papers.', skills: ['Exam Analysis'], estimatedDuration: '2 weeks' },
      { stepNumber: 2, title: 'NCERT & Core Fundamentals', description: 'Study Class 6-12 NCERTs for History, Polity, Geography, and Economics.', skills: ['NCERTs', 'Polity'], estimatedDuration: '12 weeks' },
      { stepNumber: 3, title: 'Aptitude & Language Proficiency', description: 'Daily practice of quantitative aptitude, mental ability, and English/regional language.', skills: ['CSAT', 'Aptitude'], estimatedDuration: '8 weeks' },
      { stepNumber: 4, title: 'Current Affairs & Answer Writing', description: 'Read daily national newspapers and practice structured descriptive answers.', skills: ['Answer Writing'], estimatedDuration: '10 weeks' },
      { stepNumber: 5, title: 'Mock Test Series & Revision', description: 'Take 20+ full-length mock examinations under exam conditions with negative marking.', skills: ['Mock Exams'], estimatedDuration: '8 weeks' },
    ],
  },
  {
    title: 'Agricultural Specialist',
    slug: 'agriculture-specialist',
    description: 'Modernize agriculture through agronomy, organic soil nutrition, precision farming, and agri-business management.',
    category: 'Agriculture & Rural Development',
    growthLevel: 'High',
    difficulty: 'Moderate',
    educationRequirements: ['12th Science (PCB/Agriculture)', 'BSc Agriculture / Horticulture / Diploma in Agriculture'],
    skills: [
      { name: 'Soil Science & Crop Nutrition', description: 'Soil testing, organic fertilizers, pH management', importance: 'high', requiredLevel: 'advanced' },
      { name: 'Drip & Smart Irrigation', description: 'Micro-irrigation layouts, fertigation, solar pump systems', importance: 'high', requiredLevel: 'intermediate' },
      { name: 'Pest Management & Organic Care', description: 'Bio-pesticides, integrated pest management (IPM)', importance: 'medium', requiredLevel: 'intermediate' },
      { name: 'Agri-Business & Government Schemes', description: 'PM-KISAN, e-NAM, Kisan Credit Card, FPO operations', importance: 'medium', requiredLevel: 'intermediate' },
    ],
    roadmap: [
      { stepNumber: 1, title: 'Agro-climatic Fundamentals', description: 'Learn regional soil types, seasonal crops (Kharif, Rabi, Zaid), and climate dynamics.', skills: ['Crop Science'], estimatedDuration: '4 weeks' },
      { stepNumber: 2, title: 'Modern Irrigation & Soil Testing', description: 'Gain practical experience with soil testing kits and drip irrigation design.', skills: ['Soil Testing'], estimatedDuration: '6 weeks' },
      { stepNumber: 3, title: 'Organic & Protected Cultivation', description: 'Master polyhouse farming, organic certification, and bio-fertilizer prep.', skills: ['Polyhouse', 'Organic'], estimatedDuration: '6 weeks' },
      { stepNumber: 4, title: 'Market Linkage & FPO Formation', description: 'Connect farmers to e-NAM digital markets and agricultural cold chains.', skills: ['Agri-Markets'], estimatedDuration: '6 weeks' },
    ],
  },
  {
    title: 'Electrician & Hardware Specialist',
    slug: 'electrical-technician',
    description: 'Install, maintain, and repair electrical grids, solar photovoltaic panels, and industrial wiring systems.',
    category: 'Vocational & Engineering',
    growthLevel: 'High',
    difficulty: 'Moderate',
    educationRequirements: ['10th / 12th Pass', 'ITI Electrician / Wireman Certificate / Diploma in Electrical Engineering'],
    skills: [
      { name: 'Circuit Wiring & Safety Standards', description: 'Single-phase & 3-phase wiring, MCB/ELCB, earthing safety', importance: 'high', requiredLevel: 'advanced' },
      { name: 'Multimeter & Tool Diagnostics', description: 'Voltage, current, resistance testing, fault isolation', importance: 'high', requiredLevel: 'advanced' },
      { name: 'Solar PV Installation', description: 'Solar panel array cabling, inverters, rooftop grid setup', importance: 'medium', requiredLevel: 'intermediate' },
    ],
    roadmap: [
      { stepNumber: 1, title: 'Electrical Safety & Basics', description: 'Ohm’s law, safety protective gear, Indian Electricity Rules.', skills: ['Safety'], estimatedDuration: '3 weeks' },
      { stepNumber: 2, title: 'Domestic & Commercial Wiring', description: 'Conduit wiring, distribution boards, earthing, lighting circuits.', skills: ['Wiring'], estimatedDuration: '6 weeks' },
      { stepNumber: 3, title: 'Solar Rooftop Installation', description: 'Solar PV panel mounting, inverter wiring, net-metering basics.', skills: ['Solar Tech'], estimatedDuration: '6 weeks' },
      { stepNumber: 4, title: 'Apprenticeship & Contractor License', description: 'Register on NAPS apprenticeship portal and prepare for wireman license.', skills: ['Licensing'], estimatedDuration: '8 weeks' },
    ],
  },
]

export const SEED_SCHEMES = [
  {
    title: 'Central Sector Scheme of Scholarships for College & University Students',
    provider: 'Ministry of Education, Government of India',
    description: 'Financial support of ₹12,000 to ₹20,000 per year for meritorious students from low-income families pursuing higher education.',
    officialUrl: 'https://scholarships.gov.in',
    states: ['All India'],
    educationLevels: ['undergraduate', 'postgraduate'],
    categories: ['All'],
    gender: 'all',
    incomeLimit: 450000,
    courseTypes: ['Degree', 'Engineering', 'Medical', 'Arts', 'Commerce', 'Science'],
    isOfficial: true,
  },
  {
    title: 'Post-Matric Scholarship Scheme for SC/ST/OBC Students',
    provider: 'Ministry of Social Justice and Empowerment / State Govts',
    description: 'Complete tuition waiver and monthly maintenance allowance for students pursuing post-matriculation courses.',
    officialUrl: 'https://scholarships.gov.in',
    states: ['All India', 'Maharashtra', 'Madhya Pradesh', 'Uttar Pradesh', 'Bihar'],
    educationLevels: ['class_11', 'class_12', 'diploma', 'undergraduate', 'postgraduate'],
    categories: ['SC', 'ST', 'OBC'],
    gender: 'all',
    incomeLimit: 250000,
    courseTypes: ['All recognized post-matric courses'],
    isOfficial: true,
  },
  {
    title: 'Pragati Scholarship Scheme for Girl Students',
    provider: 'AICTE (All India Council for Technical Education)',
    description: '₹50,000 per year assistance for female students admitted to first year of Degree/Diploma technical programmes.',
    officialUrl: 'https://www.aicte-india.org',
    states: ['All India'],
    educationLevels: ['diploma', 'undergraduate'],
    categories: ['All'],
    gender: 'female',
    incomeLimit: 800000,
    courseTypes: ['Engineering', 'Technology', 'Architecture', 'Pharmacy'],
    isOfficial: true,
  },
  {
    title: 'Pradhan Mantri Kaushal Vikas Yojana (PMKVY 4.0)',
    provider: 'Ministry of Skill Development and Entrepreneurship (MSDE)',
    description: 'Free industry-aligned skill certification courses with stipend, assessment, and placement assistance across India.',
    officialUrl: 'https://www.pmkvyofficial.org',
    states: ['All India'],
    educationLevels: ['class_10', 'class_12', 'diploma', 'undergraduate', 'other'],
    categories: ['All'],
    gender: 'all',
    incomeLimit: null,
    courseTypes: ['Vocational', 'IT-ITeS', 'Agriculture', 'Electronics', 'Healthcare'],
    isOfficial: true,
  },
  {
    title: 'National Means-cum-Merit Scholarship Scheme (NMMSS)',
    provider: 'Department of School Education & Literacy',
    description: 'Scholarship of ₹12,000 per annum to meritorious students from economically weaker sections to arrest dropout at class 8.',
    officialUrl: 'https://scholarships.gov.in',
    states: ['All India'],
    educationLevels: ['class_10', 'class_12'],
    categories: ['All'],
    gender: 'all',
    incomeLimit: 350000,
    courseTypes: ['Secondary School'],
    isOfficial: true,
  },
  {
    title: 'Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna',
    provider: 'Government of Maharashtra (MahaDBT)',
    description: '50% tuition and exam fee reimbursement for Economically Backward Class (EBC) students studying in Maharashtra.',
    officialUrl: 'https://mahadbt.maharashtra.gov.in',
    states: ['Maharashtra'],
    educationLevels: ['diploma', 'undergraduate', 'postgraduate'],
    categories: ['General', 'OBC', 'EWS'],
    gender: 'all',
    incomeLimit: 800000,
    courseTypes: ['Professional & Non-Professional Higher Education'],
    isOfficial: true,
  },
]

export const SEED_RESOURCES = [
  {
    title: 'Python for Beginners (in Hindi)',
    description: 'Free, complete 10-hour course covering Python syntax, loops, functions, and logic building for first-time programmers.',
    url: 'https://www.youtube.com/playlist?list=PLu0W_9lII9agwh1XjRt242xIpHhPT2llg',
    platform: 'CodeWithHarry / YouTube',
    category: 'Programming',
    skills: ['Python', 'Problem Solving'],
    level: 'beginner',
    language: 'Hindi',
    isFree: true,
    isOfficial: false,
    isVerified: true,
  },
  {
    title: 'SWAYAM - Free Government Online Courses',
    description: 'Courses designed by IITs, IIMs, and NCERT for school and college curricula. Free learning with optional certification exam.',
    url: 'https://swayam.gov.in',
    platform: 'Government of India',
    category: 'Higher Education',
    skills: ['Computer Science', 'Management', 'Sciences'],
    level: 'all',
    language: 'English',
    isFree: true,
    isOfficial: true,
    isVerified: true,
  },
  {
    title: 'Skill India Digital Hub',
    description: 'Official digital learning portal of the Ministry of Skill Development offering verified free certificates and job connect.',
    url: 'https://www.skillindiadigital.gov.in',
    platform: 'Skill India',
    category: 'Vocational',
    skills: ['Digital Literacy', 'Electrical', 'Retail', 'Healthcare'],
    level: 'beginner',
    language: 'Hindi',
    isFree: true,
    isOfficial: true,
    isVerified: true,
  },
  {
    title: 'freeCodeCamp Responsive Web Design',
    description: '300 hours of hands-on interactive coding lessons in HTML, CSS, Flexbox, Grid, and mobile responsiveness.',
    url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
    platform: 'freeCodeCamp',
    category: 'Web Development',
    skills: ['HTML', 'CSS', 'Responsive Design'],
    level: 'beginner',
    language: 'English',
    isFree: true,
    isOfficial: false,
    isVerified: true,
  },
  {
    title: 'Kaggle Micro-Courses for Data Analysis',
    description: 'Hands-on bite-sized coding tutorials in Python, Pandas, Data Visualization, and SQL in interactive browser notebooks.',
    url: 'https://www.kaggle.com/learn',
    platform: 'Kaggle',
    category: 'Data & AI',
    skills: ['Python', 'SQL', 'Pandas'],
    level: 'intermediate',
    language: 'English',
    isFree: true,
    isOfficial: false,
    isVerified: true,
  },
  {
    title: 'National Career Service (NCS) Portal',
    description: 'Government platform connecting jobseekers with verified employers, career counselors, and skill training providers.',
    url: 'https://www.ncs.gov.in',
    platform: 'Ministry of Labour & Employment',
    category: 'Career Guidance',
    skills: ['Job Search', 'Career Counseling'],
    level: 'all',
    language: 'English',
    isFree: true,
    isOfficial: true,
    isVerified: true,
  },
]

export async function seedDatabase() {
  await connectDB()

  // 1. Seed Careers
  for (const c of SEED_CAREERS) {
    await Career.findOneAndUpdate({ slug: c.slug }, c, { upsert: true, new: true })
  }

  // 2. Seed Schemes
  for (const s of SEED_SCHEMES) {
    await GovernmentScheme.findOneAndUpdate({ title: s.title }, s, { upsert: true, new: true })
  }

  // 3. Seed Learning Resources
  for (const r of SEED_RESOURCES) {
    await LearningResource.findOneAndUpdate({ title: r.title }, r, { upsert: true, new: true })
  }

  // 4. Seed Admin if credentials provided
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  if (adminEmail && adminPassword) {
    const existingAdmin = await User.findOne({ email: adminEmail })
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12)
      await User.create({
        name: 'CareerSetu Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        status: 'active',
      })
      console.log('[Seed] Admin user created:', adminEmail)
    }
  }

  return {
    careersCount: await Career.countDocuments(),
    schemesCount: await GovernmentScheme.countDocuments(),
    resourcesCount: await LearningResource.countDocuments(),
    usersCount: await User.countDocuments(),
  }
}
