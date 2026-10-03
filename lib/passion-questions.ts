export interface PassionOption {
  text: string
  careerWeights: Record<string, number>
}

export interface PassionQuestion {
  id: number
  question: string
  subtitle?: string
  options: PassionOption[]
}

export const PASSION_QUESTIONS: PassionQuestion[] = [
  {
    id: 1,
    question: 'What kind of daily work excites you the most?',
    subtitle: 'Think about how you enjoy spending your energy and focus.',
    options: [
      {
        text: 'Solving tricky logical puzzles or building computer programs',
        careerWeights: { 'software-developer': 4, 'data-analyst': 3, 'ui-ux-designer': 1 },
      },
      {
        text: 'Helping citizens, organizing community programs, or public service',
        careerWeights: { 'government-officer': 4, 'teacher-educator': 3, 'healthcare-assistant': 2 },
      },
      {
        text: 'Drawing, sketching visuals, designing user-friendly products',
        careerWeights: { 'ui-ux-designer': 4, 'software-developer': 1 },
      },
      {
        text: 'Working in the outdoors, modernizing farming, or working with nature',
        careerWeights: { 'agriculture-specialist': 4, 'government-officer': 1 },
      },
      {
        text: 'Fixing electrical equipment, machines, or hardware tools',
        careerWeights: { 'electrical-technician': 4, 'software-developer': 1 },
      },
    ],
  },
  {
    id: 2,
    question: 'When facing a new challenge, how do you prefer to tackle it?',
    subtitle: 'Your natural approach to overcoming hurdles.',
    options: [
      {
        text: 'Analyze numbers, charts, and patterns to find the exact root cause',
        careerWeights: { 'data-analyst': 4, 'software-developer': 2 },
      },
      {
        text: 'Break down the problem into step-by-step code or algorithmic logic',
        careerWeights: { 'software-developer': 4, 'data-analyst': 2 },
      },
      {
        text: 'Talk with people, understand their needs, and guide them patiently',
        careerWeights: { 'teacher-educator': 4, 'healthcare-assistant': 3, 'government-officer': 2 },
      },
      {
        text: 'Hands-on experimentation, physically inspecting and fixing things',
        careerWeights: { 'electrical-technician': 4, 'agriculture-specialist': 3 },
      },
      {
        text: 'Consult official rules, coordinate with local authorities or elders',
        careerWeights: { 'government-officer': 4, 'teacher-educator': 2 },
      },
    ],
  },
  {
    id: 3,
    question: 'Which environment feels most comfortable for your future career?',
    subtitle: 'Where you imagine yourself spending your workday.',
    options: [
      {
        text: 'An office or remote tech workspace with multiple monitors and code editors',
        careerWeights: { 'software-developer': 4, 'data-analyst': 3, 'ui-ux-designer': 3 },
      },
      {
        text: 'A government administrative office serving local people and districts',
        careerWeights: { 'government-officer': 4, 'teacher-educator': 2 },
      },
      {
        text: 'In the field, open agricultural land, polyhouses, or agricultural labs',
        careerWeights: { 'agriculture-specialist': 4 },
      },
      {
        text: 'A school classroom, college campus, or study center teaching youth',
        careerWeights: { 'teacher-educator': 4, 'government-officer': 1 },
      },
      {
        text: 'A clinic, hospital, or primary healthcare center helping patients',
        careerWeights: { 'healthcare-assistant': 4 },
      },
    ],
  },
  {
    id: 4,
    question: 'What type of impact do you most want to create for your family and society?',
    subtitle: 'What makes your hard work feel truly meaningful.',
    options: [
      {
        text: 'Create digital solutions, software apps, and earn high tech industry income',
        careerWeights: { 'software-developer': 4, 'data-analyst': 3, 'ui-ux-designer': 2 },
      },
      {
        text: 'Ensure honest administration, fair public benefits, and social justice',
        careerWeights: { 'government-officer': 4, 'teacher-educator': 2 },
      },
      {
        text: 'Improve crop yields, organic farming, and food security for farmers',
        careerWeights: { 'agriculture-specialist': 4, 'government-officer': 1 },
      },
      {
        text: 'Educate rural children and empower next-generation students with knowledge',
        careerWeights: { 'teacher-educator': 4, 'government-officer': 1 },
      },
      {
        text: 'Provide essential medical care and save lives during emergencies',
        careerWeights: { 'healthcare-assistant': 4 },
      },
    ],
  },
  {
    id: 5,
    question: 'Which subject or skill do you enjoy learning the most in your free time?',
    subtitle: 'Subjects where time passes quickly without feeling like a burden.',
    options: [
      {
        text: 'Computer programming, web development, or AI tech tools',
        careerWeights: { 'software-developer': 4, 'data-analyst': 2 },
      },
      {
        text: 'General knowledge, current affairs, Constitution, and history of India',
        careerWeights: { 'government-officer': 4, 'teacher-educator': 2 },
      },
      {
        text: 'Mathematics, statistics, spreadsheet calculations, and business metrics',
        careerWeights: { 'data-analyst': 4, 'software-developer': 2 },
      },
      {
        text: 'Biology, human anatomy, first aid, and health science',
        careerWeights: { 'healthcare-assistant': 4, 'agriculture-specialist': 1 },
      },
      {
        text: 'Art, graphics, typography, photography, and mobile app design',
        careerWeights: { 'ui-ux-designer': 4 },
      },
    ],
  },
  {
    id: 6,
    question: 'How comfortable are you using digital tools, computers, or smartphones?',
    subtitle: 'Your natural confidence with modern technology.',
    options: [
      {
        text: 'Extremely comfortable — I love learning new tools, software, and shortcuts',
        careerWeights: { 'software-developer': 4, 'data-analyst': 3, 'ui-ux-designer': 3 },
      },
      {
        text: 'I use basic office apps (Word, Excel) for documents and study records',
        careerWeights: { 'government-officer': 3, 'teacher-educator': 3, 'data-analyst': 2 },
      },
      {
        text: 'I prefer hands-on physical equipment more than staring at computer screens',
        careerWeights: { 'electrical-technician': 4, 'agriculture-specialist': 3, 'healthcare-assistant': 2 },
      },
      {
        text: 'I like creative visual software (Canva, Figma, photo editors)',
        careerWeights: { 'ui-ux-designer': 4, 'teacher-educator': 1 },
      },
    ],
  },
  {
    id: 7,
    question: 'When working in a team or group project, which role do you naturally take?',
    subtitle: 'The part you find yourself doing instinctively.',
    options: [
      {
        text: 'The builder who writes the technical parts or builds the core solution',
        careerWeights: { 'software-developer': 4, 'electrical-technician': 3 },
      },
      {
        text: 'The researcher who gathers data, prepares charts, and verifies facts',
        careerWeights: { 'data-analyst': 4, 'agriculture-specialist': 2 },
      },
      {
        text: 'The leader/coordinator who maintains discipline, planning, and deadlines',
        careerWeights: { 'government-officer': 4, 'teacher-educator': 3 },
      },
      {
        text: 'The designer who makes sure the presentation looks appealing and clear',
        careerWeights: { 'ui-ux-designer': 4, 'teacher-educator': 2 },
      },
      {
        text: 'The empathetic helper ensuring everyone is supported and safe',
        careerWeights: { 'healthcare-assistant': 4, 'teacher-educator': 3 },
      },
    ],
  },
  {
    id: 8,
    question: 'What is your preference regarding job security vs. high growth pace?',
    subtitle: 'Balancing stability with competitive opportunities.',
    options: [
      {
        text: 'High growth pace — I am eager to constantly learn new technologies for higher income',
        careerWeights: { 'software-developer': 4, 'data-analyst': 3, 'ui-ux-designer': 3 },
      },
      {
        text: 'Maximum job stability and social prestige through permanent public service',
        careerWeights: { 'government-officer': 4, 'teacher-educator': 3 },
      },
      {
        text: 'Steady, hands-on employment that is in demand everywhere in towns and villages',
        careerWeights: { 'electrical-technician': 4, 'healthcare-assistant': 3 },
      },
      {
        text: 'Self-reliance and growing my own agricultural or rural enterprise',
        careerWeights: { 'agriculture-specialist': 4, 'ui-ux-designer': 1 },
      },
    ],
  },
  {
    id: 9,
    question: 'How do you like to communicate ideas with others?',
    subtitle: 'Your favorite mode of expressing thoughts.',
    options: [
      {
        text: 'Clear step-by-step logic, code demos, or functional prototypes',
        careerWeights: { 'software-developer': 4, 'electrical-technician': 2 },
      },
      {
        text: 'Visual illustrations, diagrams, wireframes, and creative mockups',
        careerWeights: { 'ui-ux-designer': 4, 'data-analyst': 2 },
      },
      {
        text: 'Public speaking, teaching in front of a class, or delivering lectures',
        careerWeights: { 'teacher-educator': 4, 'government-officer': 3 },
      },
      {
        text: 'Data tables, clear metrics, and comparison graphs',
        careerWeights: { 'data-analyst': 4, 'government-officer': 2 },
      },
      {
        text: 'One-on-one compassionate listening and calm reassurance',
        careerWeights: { 'healthcare-assistant': 4, 'teacher-educator': 2 },
      },
    ],
  },
  {
    id: 10,
    question: 'If you could master one superpower this year, what would it be?',
    subtitle: 'The skill you would be proudest to master.',
    options: [
      {
        text: 'Architecting websites and mobile applications that millions of people use',
        careerWeights: { 'software-developer': 4, 'ui-ux-designer': 2 },
      },
      {
        text: 'Cracking competitive examinations (UPSC, MPSC, SSC) and administering welfare',
        careerWeights: { 'government-officer': 4, 'teacher-educator': 2 },
      },
      {
        text: 'Extracting valuable business intelligence from messy spreadsheets and data',
        careerWeights: { 'data-analyst': 4, 'software-developer': 2 },
      },
      {
        text: 'Empowering rural agriculture through smart drip irrigation and organic yield',
        careerWeights: { 'agriculture-specialist': 4 },
      },
      {
        text: 'Diagnosing hardware, electrical circuits, and solar energy installations',
        careerWeights: { 'electrical-technician': 4 },
      },
    ],
  },
]
