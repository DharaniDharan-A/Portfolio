import { Project } from '../models/portfolio.models';

/** Rendered in this order. Featured projects appear first, full width. */
export const projects: Project[] = [
  {
    id: 'analance',
    title: 'Analance',
    tagline: 'Enterprise Self-Serve Analytics Platform',
    context: 'Ducen / Orion Innovation',
    period: '2022 – Present',
    summary:
      "Orion's unified product bringing business intelligence, data science and data management into one self-serve platform for enterprise clients.",
    highlightsLabel: 'Work',
    highlights: [
      'Customer-facing product modules in Angular over .NET / C# REST APIs',
      'Reporting and data-management modules — dashboard rendering, export workflows, query layer over SQL Server and PostgreSQL',
      'Telecom data workflows handling datasets in the millions of records',
      'Reusable component library with PrimeNG and RxJS-driven state',
      'Performance tuning at production data volumes',
      'WCAG compliance built in',
    ],
    stack: [
      {
        layer: 'Front end',
        items: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'PrimeNG'],
        notes: ['Customer-facing product modules', 'Reusable component library, RxJS-driven state'],
      },
      {
        layer: 'Back end',
        link: 'REST APIs',
        items: ['C#', '.NET Core', 'ASP.NET MVC'],
        notes: ['Reporting and data-management modules', 'Export workflows'],
      },
      {
        layer: 'Data',
        link: 'Query layer',
        kind: 'storage',
        items: ['SQL Server', 'PostgreSQL', 'MongoDB'],
        notes: ['Telecom datasets in the millions of records'],
      },
      { layer: 'Delivery', kind: 'delivery', items: ['Azure DevOps'], notes: ['CI/CD'] },
    ],
    featured: true,
  },
  {
    id: 'developer-knowledge-base',
    title: 'Developer Knowledge Base',
    summary:
      'An internal engineering knowledge platform: developers document a problem once, and everyone else finds it again — by keyword, by exact error message, by paraphrase, or by asking an assistant that answers only from what the team has actually written down.',
    note: "The hard part isn't CRUD; it's making retrieval trustworthy and making the assistant refuse when the corpus doesn't support an answer.",
    highlightsLabel: 'Features',
    highlights: [
      'Hybrid retrieval — keyword, semantic and exact-error search fused with Reciprocal Rank Fusion, across eight filter dimensions',
      'Error strings normalised into signatures (GUIDs, paths, timestamps stripped) so the same fault matches across differently worded messages',
      'Grounded RAG with per-claim provenance — every statement labelled as from the knowledge base, from inference, or not covered',
      'Refusal as a feature: below a relevance threshold it declines without calling the LLM, shows near-misses, offers to start an article',
      'Duplicate detection via embedding similarity plus error-signature matching at draft time',
    ],
    stack: [{ items: ['C# / .NET', 'Python', 'TypeScript', 'Docker'] }],
    demo: 'retrieval',
    // TODO: Add GitHub repository link when this project is public (set repositoryUrl).
  },
  {
    id: 'api-health-monitor',
    title: 'API Health Monitor',
    summary:
      'Monitoring for HTTP APIs — registers endpoints, probes on a schedule, records every result, detects incidents from the signal, and notifies.',
    note: 'Built production-shaped rather than production-sized: architecture, failure handling and security posture are the point.',
    highlightsLabel: 'Features',
    highlights: [
      'Background worker probes each endpoint on its own interval, classifying failure mode — timeout, DNS failure, connection reset, unexpected status',
      'Credentials encrypted at rest and never returned',
      'Dashboard: uptime, average response time, recent failures, charts for response time, failure rate, status-code distribution',
    ],
    stack: [{ items: ['C# / .NET'] }],
    demo: 'probes',
    // TODO: Add GitHub repository link when this project is public (set repositoryUrl).
  },
  {
    id: 'autoforge',
    title: 'AutoForge',
    summary:
      'A platform that orchestrates AI agents to design, develop, test and maintain software with minimal human intervention.',
    highlightsLabel: 'Features',
    highlights: [
      'Agent orchestration across the task lifecycle, from specification through implementation and test',
      'Agent-facing configuration checked into the repo (AGENTS.md, CLAUDE.md, skill definitions) so every agent works from one operating contract rather than ad-hoc prompts',
    ],
    stack: [{ items: ['Python', 'FastAPI', 'React Native', 'PostgreSQL', 'Docker'] }],
    demo: 'agents',
    // TODO: Add GitHub repository link when this project is public (set repositoryUrl).
  },
];
