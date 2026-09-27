import { Education, Experience } from '../models/portfolio.models';

/**
 * Most recent employer first. The first entry is rendered with the full role
 * timeline; later entries are rendered compactly underneath.
 */
export const experience: Experience[] = [
  {
    organisation: 'Ducen — an Orion Innovation Company',
    location: 'Chennai',
    arrangement: 'Hybrid',
    start: '2022-08',
    roles: [
      { title: 'Software Engineer', start: '2025-11' },
      { title: 'Associate Software Engineer', start: '2024-04', end: '2025-11' },
      { title: 'SDE Trainee', start: '2023-10', end: '2024-03' },
      { title: 'SDE Intern', start: '2022-08', end: '2023-09' },
    ],
    responsibilities: [
      {
        area: 'Ownership',
        detail:
          'Own product features end to end — requirements with client stakeholders through design, build, code review and release',
      },
      {
        area: 'Stack',
        detail:
          'Angular (TypeScript, RxJS, NgRx, PrimeNG) front end over .NET / C# REST APIs, on SQL Server and PostgreSQL',
      },
      {
        area: 'Internal tools',
        detail:
          'Internal dashboards and engineering tooling used by delivery teams across the account',
      },
      {
        area: 'Data',
        detail:
          'Telecom data workflows: ingestion, transformation and presentation of datasets in the millions of records',
      },
      {
        area: 'Performance',
        detail:
          'Front-end rendering and query performance tuning so dashboards stay responsive at production data volumes',
      },
      {
        area: 'AI-augmented',
        detail:
          'LLM-assisted code review, test generation and documentation inside the delivery workflow',
      },
      {
        area: 'Accessibility',
        detail: 'WCAG-compliant interfaces, with accessibility testing in the definition of done',
      },
      {
        area: 'Delivery',
        detail:
          'Peer code review, Azure DevOps CI/CD, Git-based branching, team of 6–10 engineers',
      },
    ],
  },
  {
    organisation: 'Forus Technologies',
    location: 'Coimbatore',
    arrangement: 'Remote',
    start: '2021-05',
    end: '2021-05',
    roles: [{ title: 'Summer Intern', start: '2021-05', end: '2021-05' }],
    summary: 'One month during undergraduate studies.',
    responsibilities: [{ detail: 'HTML/CSS/JavaScript fundamentals' }],
  },
];

export const education: Education[] = [
  {
    qualification: 'B.E. Electronics and Communication Engineering',
    institution: 'Sri Eshwar College of Engineering',
    location: 'Coimbatore',
    startYear: 2019,
    endYear: 2023,
  },
];
