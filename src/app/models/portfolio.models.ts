/** Year and month in ISO 8601 form, e.g. `'2025-11'`. Rendered as "Nov 2025". */
export type YearMonth = `${number}-${number}`;

export interface ContactMethod {
  kind: 'email' | 'phone' | 'linkedin' | 'github';
  label: string;
  /** Visible link text. */
  value: string;
  href: string;
  /** The pretend shell command shown before this entry in the Contact terminal. */
  command: string;
}

export interface Profile {
  name: string;
  /** Shorter form for the navigation bar. */
  shortName: string;
  headline: string;
  location: string;
  /** IANA time zone, used for the local-time readout in Contact. */
  timeZone: string;
  summary: string;
  credentials: string[];
  /** Large statement in About. Wrap words in *asterisks* to accent them. */
  statement: string;
  about: string[];
  /** Relative to the deployed site root; the file lives in /public. */
  resumeUrl: string;
  contact: ContactMethod[];
}

export interface Role {
  title: string;
  start: YearMonth;
  /** Omit for a current role. */
  end?: YearMonth;
}

export interface Responsibility {
  /** Short label shown alongside the detail. Optional for single-line entries. */
  area?: string;
  detail: string;
}

export interface Experience {
  organisation: string;
  location: string;
  arrangement: string;
  start: YearMonth;
  end?: YearMonth;
  /** Most recent first. */
  roles: Role[];
  summary?: string;
  responsibilities: Responsibility[];
}

export interface Education {
  qualification: string;
  institution: string;
  location: string;
  startYear: number;
  endYear: number;
}

export interface StackLayer {
  /** Layer name, e.g. "Front end". Omit for a flat, ungrouped stack. */
  layer?: string;
  items: string[];
  /** Short facts about this layer, shown in the architecture schematic. */
  notes?: string[];
  /** Label for the connection from the layer above, e.g. "REST APIs". */
  link?: string;
  /** Changes how the schematic draws the layer. */
  kind?: 'storage' | 'delivery';
}

export interface Project {
  /** Unique, URL-safe; used as the element id (so `#analance` links to it). */
  id: string;
  title: string;
  tagline?: string;
  /** Where the work happened, e.g. the employer. Shown above featured titles. */
  context?: string;
  period?: string;
  summary: string;
  /** A short statement of what makes the project hard or interesting. */
  note?: string;
  highlightsLabel: string;
  highlights: string[];
  stack: StackLayer[];
  /** Featured projects get the full case-study treatment. */
  featured?: boolean;
  /** Which illustrative demo to show beside the project. */
  demo?: 'retrieval' | 'probes' | 'agents';
  /** Leave undefined until the repository is public; the link renders only when set. */
  repositoryUrl?: string;
}

export interface Skill {
  name: string;
  /** Other spellings to look for when finding references, e.g. "RAG". */
  aliases?: string[];
}

export interface SkillGroup {
  name: string;
  skills: Skill[];
}

export interface Certification {
  name: string;
  issuer?: string;
  date?: YearMonth;
}

export interface Award {
  name: string;
  issuer: string;
  date: YearMonth;
}
