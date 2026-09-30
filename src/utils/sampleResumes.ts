import { DiagnosticsData } from '../components/AtsDiagnosticsCard';

export interface SampleResume {
  id: string;
  name: string;
  email: string;
  targetRole: string;
  fileName: string;
  jobDescription: string;
  content: string;
  diagnostics: DiagnosticsData;
}

export const SAMPLE_RESUMES: SampleResume[] = [
  {
    id: 'fullstack',
    name: 'Maya Chen',
    email: 'maya.chen.dev@gmail.com',
    targetRole: 'Senior Full-Stack Engineer',
    fileName: 'Maya_Chen_Senior_FullStack_Resume.txt',
    jobDescription: 'Looking for a Senior Full-Stack Engineer with strong TypeScript, React 19, Node.js, GraphQL, PostgreSQL, and AWS/Cloud Run experience to lead web architecture and developer tooling.',
    content: `MAYA CHEN
San Francisco, CA · maya.chen.dev@gmail.com · +1 (415) 555-0192 · linkedin.com/in/mayachen-dev · github.com/mayachen

EXECUTIVE SUMMARY
Senior Full-Stack Engineer with 7+ years of experience designing, architecting, and scaling high-throughput distributed web applications and modern cloud microservices. Proven track record leading core platform infrastructure, reducing latency by 42%, and mentoring team members.

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, Python, SQL, Go, HTML5, CSS3
Frameworks & Libraries: React, Next.js, Node.js, Express, Tailwind CSS, Vite, GraphQL, Prisma
Databases & Cloud: PostgreSQL, Redis, Google Cloud Platform, AWS, Docker, Kubernetes, CI/CD
Testing & Tooling: Jest, Vitest, Playwright, Git, REST APIs, WebSockets, n8n Automation

PROFESSIONAL EXPERIENCE

Staff Software Engineer | Veloce Systems | 2022 - Present
- Architected mission-critical real-time dashboard serving 150,000+ daily active enterprise users with 99.98% uptime.
- Spearheaded migration from legacy monolithic Node.js backend to modular microservices, cutting p95 response time from 380ms to 92ms.
- Built automated continuous integration pipelines with GitHub Actions and Docker, reducing build failure rates by 35%.
- Implemented robust role-based access control (RBAC) and OAuth2 security protocols across 14 enterprise integrations.

Senior Frontend Engineer | Meridian Cloud | 2019 - 2022
- Led frontend design system and component architecture using React and TypeScript adopted by 6 product teams.
- Optimized bundle sizes and lazy-loaded assets, improving Google Lighthouse performance score from 64 to 98.
- Partnered closely with Product and UX teams to deliver accessible, WCAG-compliant design patterns.

Software Engineer | AppForge Labs | 2017 - 2019
- Developed customer-facing analytics dashboards using React, Redux, and D3.js.
- Integrated automated webhooks and asynchronous background workers processing over 2M events daily.

EDUCATION
Bachelor of Science in Computer Science | University of California, Berkeley (2013 - 2017)
Dean's Honors List, Magna Cum Laude

CERTIFICATIONS
- AWS Certified Solutions Architect - Associate
- Google Cloud Certified Professional Cloud Developer`,
    diagnostics: {
      score: 88,
      tierKicker: 'Top 12% Candidate Tier',
      matchTitle: 'Strong Match for Senior Engineering Roles',
      matchDescription: 'High technical depth and quantifiable metrics. A few targeted ATS keyword enhancements will push this past competitive screen filters.',
      metrics: {
        impact: { value: 92, label: 'Quantified' },
        atsFit: { value: 84, label: 'Keywords' },
        structure: { value: 95, label: 'Hierarchy' },
        brevity: { value: 81, label: 'Active Voice' },
      },
      bulletRewrites: [
        {
          category: 'WORK EXPERIENCE · CLOUDNOVA SOLUTIONS',
          impactBoost: 'Impact Score: +38% boost',
          beforeLabel: 'Before (Passive)',
          beforeText: '"Worked on backend APIs in Node.js and helped improve system performance for our user base."',
          afterLabel: 'After (n8n AI Optimization)',
          afterText: '"Architected high-throughput microservices in Node.js/TypeScript handling 8.5M+ requests daily, slashing P99 latency by 42%."',
        },
        {
          category: 'FRONTEND OPTIMIZATION · APEX SYSTEMS',
          impactBoost: 'Impact Score: +45% boost',
          beforeLabel: 'Before (Vague)',
          beforeText: '"Updated our React code to Vite and made web pages load faster for users."',
          afterLabel: 'After (n8n AI Optimization)',
          afterText: '"Spearheaded enterprise migration from legacy Webpack to modular Vite architecture, trimming bundle size by 38% and accelerating First Contentful Paint by 1.4s."',
        },
      ],
      keywords: [
        {
          name: 'Kubernetes Orchestration',
          status: 'missing',
          importance: 'High',
          contextTip: 'Crucial for infrastructure & platform engineering filters. Mention cluster scaling or Helm deployments.',
        },
        {
          name: 'Distributed Systems Architecture',
          status: 'missing',
          importance: 'High',
          contextTip: 'Mention idempotency, event-driven pipelines, or asynchronous message brokers.',
        },
        {
          name: 'TypeScript & React 19',
          status: 'found',
          importance: 'High',
          contextTip: 'Appears prominently in tech stack and project highlights.',
        },
        {
          name: 'CI/CD & Automated Testing',
          status: 'found',
          importance: 'Medium',
          contextTip: 'GitHub Actions, Docker, and Vitest detected with strong context.',
        },
      ],
      formattingChecks: [
        {
          title: 'Standardized Font & Heading Hierarchy',
          description: 'Single consistent font family without decorative icons, watermarks, or un-parseable table blocks.',
          passed: true,
        },
        {
          title: 'Linear Single-Column Text Flow',
          description: 'Document reads seamlessly top-to-bottom without multi-column parsing collisions in ATS engines.',
          passed: true,
        },
        {
          title: 'Contact Information Placement',
          description: 'Email, phone, and LinkedIn URLs detected in standard top header region.',
          passed: true,
        },
        {
          title: 'Chronological Experience Formatting',
          description: 'All work history entries include standardized company, title, and year ranges.',
          passed: true,
        },
      ],
      recruiterSummary: {
        overview: 'Exceptional senior engineering candidate with 7+ years of verifiable production impact across distributed systems and modern web architecture. Strong leadership signals and quantifiable accomplishments.',
        strengths: [
          'Slashing P99 latency by 42% across microservices handling 8.5M+ daily queries',
          'Spearheaded enterprise migration to Vite, cutting bundle size by 38%',
          'Proven mentorship and cross-functional leadership across 6 product teams',
        ],
        interviewPrompts: [
          'Walk through how you identified the bottlenecks that led to cutting P99 latency by 42%.',
          'How do you handle API deprecation and schema migrations in high-throughput microservices?',
          'What strategies did you use to drive design system adoption across 6 separate engineering squads?',
        ],
      },
    },
  },
  {
    id: 'product',
    name: 'Alex Rivera',
    email: 'alex.rivera.pm@gmail.com',
    targetRole: 'Lead Product Manager',
    fileName: 'Alex_Rivera_Product_Lead_Resume.txt',
    jobDescription: 'Seeking an experienced Lead Product Manager to spearhead AI-assisted SaaS workflow products, drive user acquisition, and align engineering with business metrics.',
    content: `ALEX RIVERA
New York, NY · alex.rivera.pm@gmail.com · +1 (212) 555-0841 · linkedin.com/in/alexrivera-pm

PROFESSIONAL SUMMARY
Results-driven Lead Product Manager with 8+ years scaling enterprise SaaS and developer tooling from seed stage to series B. Experienced in product strategy, user discovery, data analytics, and cross-functional leadership across engineering, design, and go-to-market teams.

CORE COMPETENCIES
- Product Strategy & Roadmapping
- User Research & Quantitative Analysis (Mixpanel, Amplitude, SQL)
- Agile / Scrum Product Lifecycle Management
- Workflow Automation & Integration Ecosystems (n8n, Zapier, Webhooks)
- A/B Testing & Conversion Rate Optimization
- Go-to-Market (GTM) Strategy & Customer Advisory Boards

WORK EXPERIENCE

Lead Product Manager | SynthIQ Automation | 2021 - Present
- Defined product roadmap and vision for AI workflow orchestrator, driving $3.2M ARR growth within 18 months.
- Increased monthly active user engagement by 48% through streamlined onboarding UX and self-serve templates.
- Collaborated with 16 engineering team members to ship 24 sprint releases on schedule.

Senior Product Manager | Workflow Labs | 2018 - 2021
- Managed core integration platform connecting third-party CRMs and databases with over 500k monthly webhook runs.
- Conducted 80+ customer discovery interviews to identify friction points and prioritize high-value feature requests.
- Boosted net retention rate (NRR) from 104% to 121% through targeted enterprise security compliance features.

EDUCATION
Bachelor of Science in Industrial Engineering & Operations Research | Columbia University (2014 - 2018)`,
    diagnostics: {
      score: 91,
      tierKicker: 'Top 8% Product Leadership Tier',
      matchTitle: 'Strong Match for Staff & Lead Product Roles',
      matchDescription: 'Outstanding commercial rigor with $3.2M ARR attribution and cross-functional metrics. Strong GTM and analytics balance.',
      metrics: {
        impact: { value: 96, label: 'Quantified' },
        atsFit: { value: 89, label: 'Keywords' },
        structure: { value: 94, label: 'Hierarchy' },
        brevity: { value: 87, label: 'Active Voice' },
      },
      bulletRewrites: [
        {
          category: 'CORE PRODUCT ROADMAPPING · SYNTHIQ',
          impactBoost: 'Impact Score: +42% boost',
          beforeLabel: 'Before (Passive)',
          beforeText: '"Managed product features and worked with engineers to launch new tools for our users."',
          afterLabel: 'After (n8n AI Optimization)',
          afterText: '"Formulated end-to-end product roadmap for AI workflow orchestrator, expanding ARR by $3.2M within 18 months across 4,200 paying teams."',
        },
        {
          category: 'RETENTION & GTM · WORKFLOW LABS',
          impactBoost: 'Impact Score: +36% boost',
          beforeLabel: 'Before (Vague)',
          beforeText: '"Talked to customers and made improvements that helped keep users subscribed longer."',
          afterLabel: 'After (n8n AI Optimization)',
          afterText: '"Conducted 80+ customer discovery audits, shipping key compliance features that elevated Net Revenue Retention from 104% to 121%."',
        },
      ],
      keywords: [
        {
          name: 'PLG (Product-Led Growth)',
          status: 'missing',
          importance: 'High',
          contextTip: 'Crucial acronym for modern B2B SaaS leadership filters.',
        },
        {
          name: 'Cohort Retention Analysis',
          status: 'missing',
          importance: 'Medium',
          contextTip: 'Highlight lifetime value (LTV) and CAC payback models.',
        },
        {
          name: 'Workflow Automation & n8n',
          status: 'found',
          importance: 'High',
          contextTip: 'Direct keyword match found in core competencies.',
        },
        {
          name: 'Cross-functional Leadership',
          status: 'found',
          importance: 'High',
          contextTip: 'Clearly documented across 16-engineer sprint cadence.',
        },
      ],
      formattingChecks: [
        {
          title: 'Metric Attributability',
          description: 'Quantifiable business outcomes ($ARR, NRR%, sprint cadence) clearly highlighted.',
          passed: true,
        },
        {
          title: 'ATS Scanner Legibility',
          description: 'No tables or graphical bars obstructing text parser reading order.',
          passed: true,
        },
        {
          title: 'Core Competency Clustering',
          description: 'Clean skill groupings enabling keyword parser extraction without noise.',
          passed: true,
        },
        {
          title: 'Contact Verification',
          description: 'Verified email and LinkedIn links readily indexed.',
          passed: true,
        },
      ],
      recruiterSummary: {
        overview: 'Top-tier product leader with proven track record scaling B2B automation tools. Outstanding commercial outcomes ($3.2M ARR growth) paired with rigorous qualitative user research.',
        strengths: [
          'Drove $3.2M ARR acceleration in 18 months',
          'Elevated NRR from 104% to 121% through customer-validated security features',
          'Shipped 24 consecutive sprint releases on time with 16-person engineering pod',
        ],
        interviewPrompts: [
          'How do you prioritize between technical debt and customer feature requests when driving ARR growth?',
          'Walk through a time you killed a roadmap feature based on discovery data.',
        ],
      },
    },
  },
  {
    id: 'datascience',
    name: 'Priya Patel',
    email: 'priya.patel.ai@gmail.com',
    targetRole: 'Senior Data Scientist / ML Engineer',
    fileName: 'Priya_Patel_Data_Scientist_Resume.txt',
    jobDescription: 'Seeking a Senior Data Scientist to build NLP pipelines, transformer models, LLM evaluations, and automated document analysis pipelines.',
    content: `PRIYA PATEL
Seattle, WA · priya.patel.ai@gmail.com · +1 (206) 555-0377 · linkedin.com/in/priyapatel-ml · github.com/priyapatel

PROFESSIONAL SUMMARY
Senior Data Scientist and Machine Learning Engineer specializing in Natural Language Processing (NLP), Large Language Model orchestration, document parsing, and production model deployment.

TECHNICAL SKILLS
- Machine Learning & Deep Learning: PyTorch, TensorFlow, Scikit-Learn, Hugging Face Transformers
- NLP & LLM: LangChain, LlamaIndex, Vector Databases (Pinecone, ChromaDB), Prompt Engineering, Fine-Tuning
- Cloud & Data Engineering: AWS SageMaker, GCP Vertex AI, Python, FastAPI, Docker, Apache Spark, PostgreSQL

WORK EXPERIENCE

Senior ML Engineer | Cortex Cognitive | 2021 - Present
- Designed and deployed an automated document classification and entity extraction pipeline processing 80,000+ PDFs daily with 97.4% precision.
- Built semantic resume matching and skill parsing engine that reduced recruiter review time by 60%.
- Deployed real-time inference endpoints on Kubernetes with auto-scaling to manage high traffic peaks.

Machine Learning Engineer | Apex Data Systems | 2019 - 2021
- Trained transformer-based models for automated text summarization and semantic sentiment analysis.
- Authored production data pipelines integrating with client webhooks and streaming Kafka topics.

EDUCATION
Master of Science in Machine Learning & AI | Carnegie Mellon University (2017 - 2019)
Bachelor of Technology in Computer Science | IIT Bombay (2013 - 2017)`,
    diagnostics: {
      score: 94,
      tierKicker: 'Top 5% AI / Machine Learning Tier',
      matchTitle: 'Exceptional Fit for Applied AI & LLM Systems',
      matchDescription: 'Production-scale ML deployments (80k docs/day), 97.4% precision benchmarks, and deep transformer fine-tuning expertise.',
      metrics: {
        impact: { value: 95, label: 'Quantified' },
        atsFit: { value: 92, label: 'Keywords' },
        structure: { value: 96, label: 'Hierarchy' },
        brevity: { value: 91, label: 'Active Voice' },
      },
      bulletRewrites: [
        {
          category: 'NLP PIPELINE ARCHITECTURE · CORTEX COGNITIVE',
          impactBoost: 'Impact Score: +48% boost',
          beforeLabel: 'Before (Passive)',
          beforeText: '"Built machine learning models to read documents and extract information automatically."',
          afterLabel: 'After (n8n AI Optimization)',
          afterText: '"Engineered and deployed transformer-based entity extraction pipeline processing 80,000+ PDFs daily with 97.4% precision on auto-scaled Kubernetes pods."',
        },
        {
          category: 'SEMANTIC MATCHING ENGINE · APEX DATA',
          impactBoost: 'Impact Score: +39% boost',
          beforeLabel: 'Before (Vague)',
          beforeText: '"Trained text summarization models and connected them with backend data pipelines."',
          afterLabel: 'After (n8n AI Optimization)',
          afterText: '"Fine-tuned domain-adapted BERT models for semantic candidate summarization, compressing recruiter screening latency by 60%."',
        },
      ],
      keywords: [
        {
          name: 'MLOps & Model Monitoring',
          status: 'missing',
          importance: 'High',
          contextTip: 'Include drift detection, Evidently AI, or MLflow tracking.',
        },
        {
          name: 'Quantization & TensorRT',
          status: 'missing',
          importance: 'Medium',
          contextTip: 'Useful for demonstrating latency optimization on GPU instances.',
        },
        {
          name: 'LLM & Transformer Architecture',
          status: 'found',
          importance: 'High',
          contextTip: 'Direct match across Hugging Face, PyTorch, and LangChain.',
        },
        {
          name: 'Cloud Deployment (Kubernetes/SageMaker)',
          status: 'found',
          importance: 'High',
          contextTip: 'Clear production deployment experience on GCP Vertex AI and AWS.',
        },
      ],
      formattingChecks: [
        {
          title: 'Mathematical & Technical Term Parsing',
          description: 'Specialized symbols and ML libraries parse cleanly into standard plain text tokens.',
          passed: true,
        },
        {
          title: 'Single-Column Clean Layout',
          description: 'No text box floating layers or non-standard glyph bullet points.',
          passed: true,
        },
        {
          title: 'Publication & Education Verification',
          description: 'Master of Science from CMU with clear degree classification.',
          passed: true,
        },
        {
          title: 'Repository & GitHub Affiliation',
          description: 'Code portfolio links verified in contact header.',
          passed: true,
        },
      ],
      recruiterSummary: {
        overview: 'Elite AI/ML Engineer with Carnegie Mellon Master’s pedigree and proven track record operating high-throughput document extraction pipelines (80k PDFs/day) at 97.4% precision.',
        strengths: [
          'Production scale: 80,000+ daily documents processed with sub-second latency',
          'Deep expertise in modern LLM fine-tuning, embeddings, and vector databases',
          'Carnegie Mellon Master of Science in ML & AI',
        ],
        interviewPrompts: [
          'How do you measure and mitigate hallucinations and precision degradation in document extraction pipelines?',
          'What trade-offs do you consider between fine-tuning vs. RAG for resume entity extraction?',
        ],
      },
    },
  },
];

export function createSampleFile(sample: SampleResume): File {
  const blob = new Blob([sample.content], { type: 'text/plain;charset=utf-8' });
  return new File([blob], sample.fileName, { type: 'text/plain' });
}
