import { Profile } from '../models/portfolio.models';

export const profile: Profile = {
  name: 'Dharani Dharan Arunkumar',
  shortName: 'Dharani Dharan',
  headline: 'AI-Augmented Full Stack Developer — Angular & .NET',
  location: 'Chennai, Tamil Nadu, India',
  timeZone: 'Asia/Kolkata',
  summary:
    'Full stack developer with 4+ years at Ducen — an Orion Innovation Company. Angular and .NET are my core engineering skills, with AI engineering as my differentiator.',
  credentials: [
    'Orion-certified AI-Augmented Engineer',
    'Anthropic-certified on the Claude API',
    'Agentic AI Proficient Developer via Microsoft GCPS',
  ],
  statement:
    'I own product features *end to end* — requirements with client stakeholders through design, build, code review and *release*.',
  about: [
    "I've spent 4+ years at Ducen — an Orion Innovation Company, progressing from intern to Software Engineer on the same product. The stack is Angular — TypeScript, RxJS, NgRx, PrimeNG — over .NET / C# REST APIs on SQL Server and PostgreSQL, with telecom datasets in the millions of records, where rendering and query performance have to hold up at production volumes. Accessibility testing is part of the definition of done.",
    "AI engineering is my differentiator. At work, that means LLM-assisted code review, test generation and documentation inside the delivery workflow. In my own projects, it means retrieval you can trust, an assistant that refuses when the evidence isn't there, and agents that work from one operating contract rather than ad-hoc prompts.",
  ],
  // Place the file at public/resume.pdf — see README.
  resumeUrl: './resume.pdf',
  contact: [
    {
      kind: 'email',
      label: 'Email',
      value: 'dharanidharan.arunkumar@gmail.com',
      href: 'mailto:dharanidharan.arunkumar@gmail.com',
      command: 'contact --email',
    },
    {
      kind: 'phone',
      label: 'Phone',
      value: '+91 63695 59949',
      href: 'tel:+916369559949',
      command: 'contact --phone',
    },
    {
      kind: 'linkedin',
      label: 'LinkedIn',
      value: 'linkedin.com/in/dharani-dharan-arunkumar-6b0464276',
      href: 'https://www.linkedin.com/in/dharani-dharan-arunkumar-6b0464276',
      command: 'open linkedin',
    },
    {
      kind: 'github',
      label: 'GitHub',
      value: 'github.com/DharaniDharan-A',
      href: 'https://github.com/DharaniDharan-A',
      command: 'open github',
    },
  ],
};
