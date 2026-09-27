import { experience } from '../../data/experience';
import { projects } from '../../data/projects';
import { Skill } from '../../models/portfolio.models';

/** A place on the page where skills can be mentioned. */
interface ReferenceSource {
  label: string;
  href: string;
  /** Lines of text belonging to the source, tagged with where they come from. */
  lines: { kind: string; text: string }[];
}

export interface Snippet {
  kind: string;
  before: string;
  match: string;
  after: string;
}

export interface Reference {
  label: string;
  href: string;
  snippets: Snippet[];
}

const SNIPPET_BEFORE = 36;
const SNIPPET_AFTER = 64;
const SNIPPETS_PER_SOURCE = 2;

/** Everything on the page that describes real work, in page order. */
const sources: ReferenceSource[] = [
  ...experience.map((job) => ({
    label: job.organisation,
    href: '#experience',
    lines: job.responsibilities.map((item) => ({
      kind: item.area?.toLowerCase() ?? 'experience',
      text: item.detail,
    })),
  })),
  ...projects.map((project) => ({
    label: project.title,
    href: `#${project.id}`,
    lines: [
      ...project.highlights.map((text) => ({ kind: project.highlightsLabel.toLowerCase(), text })),
      { kind: 'stack', text: project.stack.flatMap((layer) => layer.items).join(' · ') },
      { kind: 'summary', text: project.summary },
    ],
  })),
];

/**
 * Whole-term search for a skill's name and aliases across the sources, like an
 * editor's "Find All References".
 *
 * Case-sensitive on purpose: skill names are proper nouns and acronyms, and
 * ignoring case finds "REST" in "encrypted at rest". Terms can contain symbols
 * (C#, .NET, CI/CD), so boundaries are "not a word character or dot" rather
 * than \b — which also stops ".NET" matching inside "ASP.NET".
 */
export function findReferences(skill: Skill): Reference[] {
  const terms = [skill.name, ...(skill.aliases ?? [])];
  const pattern = new RegExp(`(?<![\\w.])(${terms.map(escapeRegExp).join('|')})(?![\\w])`);

  return sources
    .map((source) => {
      const snippets: Snippet[] = [];
      for (const line of source.lines) {
        const match = pattern.exec(line.text);
        if (!match) continue;
        snippets.push(toSnippet(line.kind, line.text, match.index, match[0].length));
        if (snippets.length === SNIPPETS_PER_SOURCE) break;
      }
      return { label: source.label, href: source.href, snippets };
    })
    .filter((reference) => reference.snippets.length > 0);
}

function toSnippet(kind: string, text: string, index: number, length: number): Snippet {
  const start = Math.max(0, index - SNIPPET_BEFORE);
  const end = Math.min(text.length, index + length + SNIPPET_AFTER);
  return {
    kind,
    before: (start > 0 ? '…' : '') + text.slice(start, index),
    match: text.slice(index, index + length),
    after: text.slice(index + length, end) + (end < text.length ? '…' : ''),
  };
}

function escapeRegExp(term: string): string {
  return term.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
}
