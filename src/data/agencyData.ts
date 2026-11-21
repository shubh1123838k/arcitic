export type ProjectCategory =
  | 'All'
  | 'AI Development'
  | 'Web Design & Development'
  | 'Personal Branding'
  | 'AI & Web Development';

export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceItem {
  number: string;
  title: string;
  description: string;
  features: string[];
  filterCategory: ProjectCategory;
}

export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  category: Exclude<ProjectCategory, 'All'>;
  description: string;
  overview: string;
  deliverables: string[];
  techStack: string[];
  deliveryTimeline: string;
  imageUrl: string;
  imageAlt: string;
  isDemoConcept: boolean;
  externalUrl?: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface WhyItem {
  number: string;
  title: string;
  description: string;
}

export interface TestimonialSlot {
  id: string;
  slotLabel: string;
  quote: string;
  clientName: string;
  roleOrCompany: string;
  isPlaceholder: boolean;
}

export const AGENCY_EMAIL = 'work.shubhjain@gmail.com';
export const FOUNDER_LINKEDIN_URL = 'https://www.linkedin.com/in/shubh-jain-ai/';
export const MAILTO_PROJECT_URL = `mailto:${AGENCY_EMAIL}?subject=${encodeURIComponent(
  'New Project Inquiry'
)}`;

export const HERO_ARTWORK_URL = '/src/assets/images/hero_arctic_ice_1794809990824.jpg';
export const ABOUT_ARTWORK_URL = '/src/assets/images/about_arctic_studio_1794809995950.jpg';

export const NAV_ITEMS: NavItem[] = [
  {label: 'Work', href: '#work'},
  {label: 'Process', href: '#process'},
  {label: 'About', href: '#about'},
  {label: 'Contact', href: '#contact'},
];

export const MARQUEE_ITEMS: string[] = [
  'ARCITIC',
  'DESIGN',
  'DEVELOPMENT',
  'AI SOLUTIONS',
  'DIGITAL EXPERIENCES',
];

export const SERVICES: ServiceItem[] = [
  {
    number: '01',
    title: 'AI-Powered Websites',
    description:
      'We build intelligent, modern websites that combine exceptional design with AI-powered functionality to create better digital experiences.',
    features: [
      'AI-integrated websites',
      'Intelligent chatbots',
      'Smart user experiences',
      'Custom AI integrations',
    ],
    filterCategory: 'AI Development',
  },
  {
    number: '02',
    title: 'Business Websites',
    description:
      'We create modern, conversion-focused websites that establish credibility, communicate value, and help businesses grow online.',
    features: [
      'Business websites',
      'Landing pages',
      'Website redesign',
      'Responsive development',
    ],
    filterCategory: 'Web Design & Development',
  },
  {
    number: '03',
    title: 'Personal Portfolios',
    description:
      'We transform individual expertise into a strong digital presence through premium, personalized portfolio websites.',
    features: [
      'Personal branding',
      'Professional portfolios',
      'Developer portfolios',
      'Resume and career websites',
    ],
    filterCategory: 'Personal Branding',
  },
];

export const PROJECT_FILTERS: ProjectCategory[] = [
  'All',
  'AI Development',
  'Web Design & Development',
  'Personal Branding',
  'AI & Web Development',
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'ai-assistant',
    number: '01',
    title: 'AI Assistant',
    category: 'AI Development',
    description:
      'An intelligent conversational experience designed to simplify information discovery and improve user interaction.',
    overview:
      'A studio-built demonstration exploring how natural language interfaces can live seamlessly inside an editorial dark-mode product without visual clutter.',
    deliverables: [
      'Conversational UX architecture',
      'Contextual prompt routing',
      'Responsive dark-mode UI system',
    ],
    techStack: ['React', 'TypeScript', 'Node.js', 'Gemini API', 'Tailwind CSS', 'Streaming SSE'],
    deliveryTimeline: '3–4 Weeks',
    imageUrl: '/src/assets/images/project_ai_assistant_1794809994857.jpg',
    imageAlt: 'Concept interface mockup of the ARCITIC AI Assistant conversational web application',
    isDemoConcept: true,
  },
  {
    id: 'business-website',
    number: '02',
    title: 'Business Website',
    category: 'Web Design & Development',
    description:
      'A modern business website focused on brand credibility, clear communication, and conversion-driven design.',
    overview:
      'A conceptual corporate flagship built around Swiss typographic hierarchy, structured storytelling, and frictionless inquiry pathways.',
    deliverables: [
      'Editorial grid & layout system',
      'Conversion-focused page flow',
      'High-performance front-end build',
    ],
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Motion', 'Headless CMS', 'SEO Schema'],
    deliveryTimeline: '2–3 Weeks',
    imageUrl: '/src/assets/images/project_business_web_1794809994699.jpg',
    imageAlt: 'Concept showcase of a modern editorial business website displayed on a dark studio tablet',
    isDemoConcept: true,
  },
  {
    id: 'personal-portfolio',
    number: '03',
    title: 'Personal Portfolio',
    category: 'Personal Branding',
    description:
      'A premium personal portfolio that transforms professional experience into a memorable digital identity.',
    overview:
      'An independent creative director concept pairing restrained typography, asymmetrical image framing, and focused case-study presentation.',
    deliverables: [
      'Personal brand positioning',
      'Asymmetrical editorial layout',
      'Interactive case study framing',
    ],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Motion', 'Vite'],
    deliveryTimeline: '1–2 Weeks',
    imageUrl: '/src/assets/images/project_personal_portfolio_1794809995273.jpg',
    imageAlt: 'Concept mockup of a minimalist personal portfolio website on a frameless glass display',
    isDemoConcept: true,
  },
  {
    id: 'digital-platform',
    number: '04',
    title: 'Digital Platform',
    category: 'AI & Web Development',
    description:
      'A modern digital platform combining intelligent functionality with an intuitive user experience.',
    overview:
      'A concept digital workspace engineered for clarity across complex workflows, balancing calm dark surfaces with sharp coral focus states.',
    deliverables: [
      'Modular component architecture',
      'AI-assisted workflow states',
      'Accessible keyboard-first navigation',
    ],
    techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Node.js', 'Gemini API', 'Tailwind CSS'],
    deliveryTimeline: '4–6 Weeks',
    imageUrl: '/src/assets/images/project_digital_platform_1794809995344.jpg',
    imageAlt: 'Concept showcase of a dark-mode intelligent digital platform interface on a studio monitor',
    isDemoConcept: true,
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Discover',
    description:
      'We understand your goals, audience, business, and requirements before defining the direction.',
  },
  {
    number: '02',
    title: 'Design',
    description:
      'We create a thoughtful visual experience that reflects your brand and communicates your value.',
  },
  {
    number: '03',
    title: 'Develop',
    description:
      'We transform the design into a responsive, high-performance digital experience using modern technologies.',
  },
  {
    number: '04',
    title: 'Launch',
    description:
      'We test, refine, deploy, and deliver your website, ready for the world.',
  },
];

export const WHY_ITEMS: WhyItem[] = [
  {
    number: '01',
    title: 'Design That Matters',
    description: 'Every element has a purpose. No unnecessary visual noise.',
  },
  {
    number: '02',
    title: 'AI-First Thinking',
    description: 'We use modern AI capabilities to create smarter digital experiences.',
  },
  {
    number: '03',
    title: 'Built for Performance',
    description: 'Responsive, optimized, and developed with modern technologies.',
  },
  {
    number: '04',
    title: 'Made Around You',
    description: 'Every project is shaped around your specific goals and identity.',
  },
];

export const TESTIMONIAL_SLOTS: TestimonialSlot[] = [
  {
    id: 'slot-01',
    slotLabel: 'Sample Placeholder 01',
    quote:
      'Verified client testimonial slot reserved for partner feedback on AI-powered website delivery and editorial execution.',
    clientName: 'Client Name Placeholder',
    roleOrCompany: 'Role & Company Placeholder',
    isPlaceholder: true,
  },
  {
    id: 'slot-02',
    slotLabel: 'Sample Placeholder 02',
    quote:
      'Verified client testimonial slot reserved for partner feedback on business website architecture and launch collaboration.',
    clientName: 'Client Name Placeholder',
    roleOrCompany: 'Role & Company Placeholder',
    isPlaceholder: true,
  },
  {
    id: 'slot-03',
    slotLabel: 'Sample Placeholder 03',
    quote:
      'Verified client testimonial slot reserved for partner feedback on personal portfolio design and brand positioning.',
    clientName: 'Client Name Placeholder',
    roleOrCompany: 'Role & Company Placeholder',
    isPlaceholder: true,
  },
];

export const FOOTER_NAV_LINKS: NavItem[] = [
  {label: 'Work', href: '#work'},
  {label: 'About', href: '#about'},
  {label: 'Contact', href: '#contact'},
];

export const FOOTER_SOCIAL_LINKS: Array<{label: string; href: string; external: boolean}> = [
  {label: 'Email', href: `mailto:${AGENCY_EMAIL}`, external: false},
  {label: 'LinkedIn', href: 'https://www.linkedin.com/company/arcitic', external: true},
];
