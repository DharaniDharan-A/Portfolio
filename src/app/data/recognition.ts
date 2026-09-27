import { Award, Certification } from '../models/portfolio.models';

/** A selection; the full count is shown separately via `certificationCount`. */
export const certifications: Certification[] = [
  { name: 'AI-Augmented Engineer – Professional', issuer: 'Orion Innovation', date: '2026-06' },
  { name: 'Building with the Claude API', issuer: 'Anthropic', date: '2026-05' },
  { name: 'Agentic AI Proficient Developer', issuer: 'Microsoft GCPS' },
  { name: 'Machine Learning with Python', issuer: 'Anaconda' },
  { name: 'Processing Text with Python' },
];

export const certificationCount = 19;

export const awards: Award[] = [
  { name: 'Star of the Month', issuer: 'Orion Innovation', date: '2026-01' },
  { name: 'Rookie Rockstar', issuer: 'Ducen IT', date: '2024-04' },
];
