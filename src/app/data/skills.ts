import { SkillGroup } from '../models/portfolio.models';

export const skillGroups: SkillGroup[] = [
  {
    name: 'Frontend',
    skills: [
      { name: 'Angular' },
      { name: 'TypeScript' },
      { name: 'RxJS' },
      { name: 'NgRx' },
      { name: 'PrimeNG' },
      { name: 'JavaScript' },
      { name: 'HTML/CSS' },
      { name: 'WCAG accessibility', aliases: ['WCAG'] },
    ],
  },
  {
    name: 'Backend',
    skills: [
      { name: 'C#' },
      { name: '.NET / .NET Core', aliases: ['.NET'] },
      { name: 'ASP.NET MVC' },
      { name: 'REST APIs', aliases: ['REST'] },
      { name: 'Entity Framework Core' },
      { name: 'Microservices' },
      { name: 'Python' },
      { name: 'FastAPI' },
    ],
  },
  {
    name: 'Data',
    skills: [{ name: 'SQL Server' }, { name: 'PostgreSQL' }, { name: 'MongoDB' }],
  },
  {
    name: 'Cloud & DevOps',
    skills: [
      { name: 'Azure' },
      { name: 'Azure Functions' },
      { name: 'Azure App Service' },
      { name: 'Azure Document Intelligence' },
      { name: 'Azure OpenAI' },
      { name: 'Azure DevOps' },
      { name: 'CI/CD' },
      { name: 'Git' },
      { name: 'Jenkins' },
      { name: 'Docker' },
    ],
  },
  {
    name: 'AI Engineering',
    skills: [
      { name: 'LLM integration', aliases: ['LLM'] },
      { name: 'Claude API' },
      { name: 'Model Context Protocol (MCP)', aliases: ['MCP'] },
      { name: 'Retrieval-Augmented Generation', aliases: ['RAG'] },
      { name: 'Agentic workflows', aliases: ['agents'] },
      { name: 'Prompt engineering' },
    ],
  },
];

/** The scrolling band under the hero. Decorative; the full list is in Skills. */
export const featuredStack = [
  'Angular',
  'TypeScript',
  'RxJS',
  'NgRx',
  'PrimeNG',
  '.NET',
  'C#',
  'SQL Server',
  'PostgreSQL',
  'Azure DevOps',
  'LLM integration',
  'RAG',
  'MCP',
  'Agentic workflows',
];
