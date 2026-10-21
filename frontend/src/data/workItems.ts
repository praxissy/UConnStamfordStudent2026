import type { WorkItem } from '@/types'

export const INITIAL_WORK_ITEMS: WorkItem[] = [
  {
    id: '1',
    title: 'Adaptive Learning System for STEM Curricula',
    parentProject: 'Personalized Learning Initiative',
    category: 'Machine Learning',
    status: 'Approved',
    description:
      'A reinforcement-learning engine that personalizes problem difficulty in real time based on student performance signals, integrated into an LMS via xAPI.',
    highlights: [
      'Adaptive difficulty based on real-time performance signals',
      'xAPI integration with existing learning platforms',
      'Instructor analytics for identifying learning gaps',
      'Pilot-ready experience for undergraduate STEM courses',
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1617755870291-1f0de453ad30?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200',
      alt: 'Laptop displaying a digital learning interface on a desk',
    },
    skills: ['Python', 'PyTorch', 'FastAPI', 'PostgreSQL', 'React'],
    university: 'Human-Computer Interaction Lab',
    dateRange: 'Jan 2026 – May 2026',
    links: { github: 'https://github.com', website: 'https://example.com' },
    comments: [],
  },
  {
    id: '2',
    title: 'Real-Time Campus Energy Monitoring Dashboard',
    parentProject: 'Campus Sustainability Program',
    category: 'Data Engineering',
    status: 'Changes Requested',
    description:
      'IoT-based platform aggregating sensor data from 40+ campus buildings to surface anomalies and suggest optimization actions.',
    image: {
      src: 'https://images.unsplash.com/photo-1764885517995-a4a4f940e1a6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200',
      alt: 'Modern building facade covered with solar panels',
    },
    skills: ['Go', 'InfluxDB', 'Grafana', 'MQTT', 'Docker'],
    university: 'Sustainable Systems Lab',
    dateRange: 'Sep 2025 – Dec 2025',
    links: { github: 'https://github.com', docs: 'https://docs.example.com' },
    comments: [
      {
        id: 'c1',
        reviewer: 'Dr. Elena Marchetti',
        avatar: 'EM',
        date: 'Sep 14, 2026',
        category: 'Methodology',
        comment:
          'The anomaly-detection algorithm needs a baseline comparison with existing ASHRAE benchmarks. Please add a section that contextualizes the thresholds you chose.',
        resolved: false,
      },
      {
        id: 'c2',
        reviewer: 'Dr. Elena Marchetti',
        avatar: 'EM',
        date: 'Sep 14, 2026',
        category: 'Presentation',
        comment:
          'The dashboard screenshots lack alt-text descriptions. Add accessible captions and ensure all color-coded alerts also have a shape or label indicator.',
        resolved: true,
      },
    ],
  },
  {
    id: '3',
    title: 'Multilingual NER for Medical Clinical Notes',
    parentProject: 'Clinical Language Intelligence Project',
    category: 'NLP / Clinical AI',
    status: 'Under Review',
    description:
      'Fine-tuned multilingual BERT model for named entity recognition across English, Spanish, and Mandarin clinical narratives.',
    image: {
      src: 'https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200',
      alt: 'Medical researchers reviewing digital imaging on computer monitors',
    },
    skills: ['Python', 'HuggingFace Transformers', 'spaCy', 'Streamlit'],
    university: 'Biomedical Informatics Lab',
    dateRange: 'Feb 2026 – Jun 2026',
    links: { github: 'https://github.com' },
    comments: [],
  },
  {
    id: '4',
    title: 'Open-Source Peer Mentorship Matching Platform',
    parentProject: 'Student Success Digital Services',
    category: 'Full-Stack Web',
    status: 'Draft',
    description:
      'Collaborative matching tool that pairs incoming students with senior mentors using preference questionnaires and compatibility scoring.',
    image: {
      src: 'https://images.unsplash.com/photo-1758270705317-3ef6142d306f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200',
      alt: 'Group of university students collaborating around a laptop',
    },
    skills: ['Next.js', 'TypeScript', 'Prisma', 'Supabase', 'Tailwind CSS'],
    university: 'Digital Education Initiative',
    dateRange: 'Mar 2026 – Ongoing',
    links: { github: 'https://github.com', website: 'https://example.com' },
    comments: [],
  },
]

export const REVIEWER = {
  name: 'Dr. Elena Marchetti',
  role: 'Lab Manager — Sustainable Systems Lab',
  avatar: 'EM',
}

export const CATEGORIES = [
  'Machine Learning',
  'Data Engineering',
  'NLP / Clinical AI',
  'Full-Stack Web',
  'Computer Vision',
  'Systems & Networks',
  'HCI / UX Research',
  'Robotics',
  'Other',
]

export const SKILL_OPTIONS = [
  'Python', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'Java', 'C++',
  'React', 'Next.js', 'Vue', 'Svelte', 'FastAPI', 'Django', 'Node.js',
  'PostgreSQL', 'MySQL', 'MongoDB', 'InfluxDB', 'Redis',
  'PyTorch', 'TensorFlow', 'HuggingFace Transformers', 'scikit-learn',
  'Docker', 'Kubernetes', 'AWS', 'GCP', 'Tailwind CSS', 'Prisma',
]
