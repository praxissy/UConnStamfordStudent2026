import type { CommentTarget, WorkItemStatus } from '../contract'

const unsplashImageUrl = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`

export interface SeedLab {
  name: string
  area: string
  manager: { name: string; initials: string; email: string; title: string }
}

export const SEED_LABS: SeedLab[] = [
  {
    name: 'Human-Computer Interaction Lab',
    area: 'HCI / UX',
    manager: { name: 'Dr. Marcus Webb', initials: 'MW', email: 'm.webb@uconn.edu', title: 'Lab Manager — Human-Computer Interaction Lab' },
  },
  {
    name: 'Sustainable Systems Lab',
    area: 'Energy',
    manager: { name: 'Dr. Elena Marchetti', initials: 'EM', email: 'e.marchetti@uconn.edu', title: 'Lab Manager — Sustainable Systems Lab' },
  },
  {
    name: 'Biomedical Informatics Lab',
    area: 'Biomedical',
    manager: { name: 'Dr. Priya Raman', initials: 'PR', email: 'p.raman@uconn.edu', title: 'Lab Manager — Biomedical Informatics Lab' },
  },
  {
    name: 'Digital Education Initiative',
    area: 'Education',
    manager: { name: 'Dr. Samuel Okafor', initials: 'SO', email: 's.okafor@uconn.edu', title: 'Lab Manager — Digital Education Initiative' },
  },
]

export interface SeedComment {
  targetField: CommentTarget
  body: string
  commentType: string
  resolved: boolean
}

export interface SeedWorkItem {
  labName: string
  status: WorkItemStatus
  title: string
  parentProject: string
  deliverableType: string
  description: string
  startDate: string
  completedDate: string | null
  tags: string[]
  highlights: string[]
  links: { label: string; url: string }[]
  image: { url: string; caption: string }
  submittedAt?: string
  decidedAt?: string
  comments?: SeedComment[]
}

export const SEED_WORK_ITEMS: SeedWorkItem[] = [
  {
    labName: 'Human-Computer Interaction Lab',
    status: 'accepted',
    title: 'Adaptive Learning System for STEM Curricula',
    parentProject: 'Personalized Learning Initiative',
    deliverableType: 'Machine Learning',
    description:
      'A reinforcement-learning engine that personalizes problem difficulty in real time based on student performance signals, integrated into an LMS via xAPI.',
    startDate: '2026-01-12',
    completedDate: '2026-05-08',
    tags: ['Python', 'PyTorch', 'FastAPI', 'PostgreSQL', 'React'],
    highlights: [
      'Adaptive difficulty based on real-time performance signals',
      'xAPI integration with existing learning platforms',
      'Instructor analytics for identifying learning gaps',
      'Pilot-ready experience for undergraduate STEM courses',
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com' },
      { label: 'Website', url: 'https://example.com' },
    ],
    image: {
      url: 'https://images.unsplash.com/photo-1617755870291-1f0de453ad30?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200',
      caption: 'Laptop displaying a digital learning interface on a desk',
    },
    submittedAt: '2026-05-10T14:00:00Z',
    decidedAt: '2026-05-14T16:30:00Z',
  },
  {
    labName: 'Sustainable Systems Lab',
    status: 'declined',
    title: 'Real-Time Campus Energy Monitoring Dashboard',
    parentProject: 'Campus Sustainability Program',
    deliverableType: 'Data Engineering',
    description:
      'IoT-based platform aggregating sensor data from 40+ campus buildings to surface anomalies and suggest optimization actions.',
    startDate: '2025-09-02',
    completedDate: '2025-12-15',
    tags: ['Go', 'InfluxDB', 'Grafana', 'MQTT', 'Docker'],
    highlights: [
      'Live readings from 40+ instrumented buildings',
      'Anomaly flags surfaced within minutes of a reading',
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com' },
      { label: 'Documentation', url: 'https://docs.example.com' },
    ],
    image: {
      url: 'https://images.unsplash.com/photo-1764885517995-a4a4f940e1a6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200',
      caption: 'Modern building facade covered with solar panels',
    },
    submittedAt: '2026-09-10T15:00:00Z',
    decidedAt: '2026-09-14T13:20:00Z',
    comments: [
      {
        targetField: 'description',
        commentType: 'Methodology',
        body: 'The anomaly-detection algorithm needs a baseline comparison with existing ASHRAE benchmarks. Please add a section that contextualizes the thresholds you chose.',
        resolved: false,
      },
      {
        targetField: 'image',
        commentType: 'Presentation',
        body: 'The dashboard screenshots lack alt-text descriptions. Add accessible captions and ensure all color-coded alerts also have a shape or label indicator.',
        resolved: true,
      },
    ],
  },
  {
    labName: 'Biomedical Informatics Lab',
    status: 'pending_review',
    title: 'Multilingual NER for Medical Clinical Notes',
    parentProject: 'Clinical Language Intelligence Project',
    deliverableType: 'NLP / Clinical AI',
    description:
      'Fine-tuned multilingual BERT model for named entity recognition across English, Spanish, and Mandarin clinical narratives.',
    startDate: '2026-02-02',
    completedDate: '2026-06-19',
    tags: ['Python', 'HuggingFace Transformers', 'spaCy', 'Streamlit'],
    highlights: ['Entity recognition across three languages'],
    links: [{ label: 'GitHub', url: 'https://github.com' }],
    image: {
      url: 'https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200',
      caption: 'Medical researchers reviewing digital imaging on computer monitors',
    },
    submittedAt: '2026-10-28T18:45:00Z',
  },
  {
    labName: 'Digital Education Initiative',
    status: 'draft',
    title: 'Open-Source Peer Mentorship Matching Platform',
    parentProject: 'Student Success Digital Services',
    deliverableType: 'Full-Stack Web',
    description:
      'Collaborative matching tool that pairs incoming students with senior mentors using preference questionnaires and compatibility scoring.',
    startDate: '2026-03-02',
    completedDate: null,
    tags: ['Next.js', 'TypeScript', 'Prisma', 'Supabase', 'Tailwind CSS'],
    highlights: [],
    links: [
      { label: 'GitHub', url: 'https://github.com' },
      { label: 'Website', url: 'https://example.com' },
    ],
    image: {
      url: 'https://images.unsplash.com/photo-1758270705317-3ef6142d306f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200',
      caption: 'Group of university students collaborating around a laptop',
    },
  },

  {
    labName: 'Human-Computer Interaction Lab',
    status: 'accepted',
    title: 'Accessible Campus Wayfinding App',
    parentProject: 'Inclusive Campus Initiative',
    deliverableType: 'HCI / UX Research',
    description:
      'Mobile wayfinding app that routes around stairs and construction using live facilities data, designed with and tested by students who use wheelchairs.',
    startDate: '2025-08-25',
    completedDate: '2025-12-12',
    tags: ['React Native', 'TypeScript', 'Mapbox', 'Figma'],
    highlights: [
      'Step-free routing across 12 campus buildings',
      'Co-designed in four sessions with disabled students',
      'Screen-reader-first navigation flow',
    ],
    links: [{ label: 'GitHub', url: 'https://github.com' }],
    image: { url: unsplashImageUrl('photo-1758685848208-e108b6af94cc'), caption: 'Student testing a mobile app' },
    submittedAt: '2025-12-15T15:10:00Z',
    decidedAt: '2025-12-19T11:00:00Z',
  },
  {
    labName: 'Sustainable Systems Lab',
    status: 'accepted',
    title: 'Solar Microgrid Load Forecasting',
    parentProject: 'Campus Sustainability Program',
    deliverableType: 'Machine Learning',
    description:
      'Gradient-boosted forecasting model predicting 24-hour load on the campus solar microgrid, reducing reliance on grid power during peak hours.',
    startDate: '2026-01-20',
    completedDate: '2026-04-30',
    tags: ['Python', 'scikit-learn', 'Pandas', 'PostgreSQL'],
    highlights: [
      '24-hour load forecast within 6% mean absolute error',
      'Feeds the battery dispatch schedule nightly',
      'Retrains automatically on new meter data',
    ],
    links: [{ label: 'GitHub', url: 'https://github.com' }],
    image: { url: unsplashImageUrl('photo-1766297248047-6ec337099802'), caption: 'Solar array on a campus rooftop' },
    submittedAt: '2026-05-02T13:00:00Z',
    decidedAt: '2026-05-06T10:15:00Z',
  },
  {
    labName: 'Biomedical Informatics Lab',
    status: 'accepted',
    title: 'Clinical Trial Eligibility Screener',
    parentProject: 'Clinical Language Intelligence Project',
    deliverableType: 'NLP / Clinical AI',
    description:
      'Rules-plus-model screener that reads de-identified patient summaries and flags likely matches against open clinical trial criteria for coordinator review.',
    startDate: '2025-09-08',
    completedDate: '2026-01-23',
    tags: ['Python', 'spaCy', 'FastAPI', 'Docker'],
    highlights: [
      'Cut manual pre-screening time by roughly half in a pilot',
      'Every flag shows the criteria text it matched',
      'Runs entirely on de-identified data',
    ],
    links: [{ label: 'Documentation', url: 'https://docs.example.com' }],
    image: { url: unsplashImageUrl('photo-1766297246931-7b861269dab0'), caption: 'Laboratory workstation' },
    submittedAt: '2026-01-26T16:00:00Z',
    decidedAt: '2026-02-02T09:40:00Z',
  },
  {
    labName: 'Digital Education Initiative',
    status: 'accepted',
    title: 'Automated Lecture Captioning Pipeline',
    parentProject: 'Accessible Courseware Project',
    deliverableType: 'Data Engineering',
    description:
      'Pipeline that transcribes recorded lectures, aligns captions to slides, and publishes searchable transcripts to the course site within an hour of upload.',
    startDate: '2026-02-16',
    completedDate: '2026-06-05',
    tags: ['Python', 'Whisper', 'FFmpeg', 'AWS'],
    highlights: [
      'Captions published within an hour of upload',
      'Slide-aligned, searchable transcripts',
      'Processed 300+ hours of lectures in its first term',
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com' },
      { label: 'Website', url: 'https://example.com' },
    ],
    image: { url: unsplashImageUrl('photo-1766297247924-6638d54e7c89'), caption: 'Lecture hall with projected slides' },
    submittedAt: '2026-06-08T14:20:00Z',
    decidedAt: '2026-06-11T12:00:00Z',
  },
]
