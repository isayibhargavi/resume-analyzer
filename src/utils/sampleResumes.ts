export interface SampleResume {
  id: string;
  name: string;
  email: string;
  targetRole: string;
  fileName: string;
  jobDescription: string;
  content: string;
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
- Google Cloud Certified Professional Cloud Developer`
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
Bachelor of Science in Industrial Engineering & Operations Research | Columbia University (2014 - 2018)`
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
Bachelor of Technology in Computer Science | IIT Bombay (2013 - 2017)`
  }
];

export function createSampleFile(sample: SampleResume): File {
  const blob = new Blob([sample.content], { type: 'text/plain;charset=utf-8' });
  return new File([blob], sample.fileName, { type: 'text/plain' });
}
