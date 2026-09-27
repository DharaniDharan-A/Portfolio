// Illustrative inputs for the Developer Knowledge Base demo. None of this is
// real data from the project; it only shows how each mechanism behaves.

export type Volatile = 'guid' | 'path' | 'timestamp';

export interface ErrorPart {
  text: string;
  /** Parts that vary between occurrences of the same fault. */
  volatile?: Volatile;
}

export const placeholders: Record<Volatile, string> = {
  guid: '<guid>',
  path: '<path>\\',
  timestamp: '<timestamp>',
};

export const errorSamples: ErrorPart[][] = [
  [
    { text: 'SqlException: Timeout expired · job ' },
    { text: '7c9e6679-7425-40de-944b-e07fc1f90ae7', volatile: 'guid' },
    { text: ' at ' },
    { text: 'D:\\agents\\_work\\14\\s\\Export\\', volatile: 'path' },
    { text: 'ReportExporter.cs:212 · ' },
    { text: '2026-02-11T08:14:52Z', volatile: 'timestamp' },
  ],
  [
    { text: 'SqlException: Timeout expired · job ' },
    { text: '1b4e28ba-2fa1-11d2-883f-0016d3cca427', volatile: 'guid' },
    { text: ' at ' },
    { text: 'E:\\build\\w3\\Export\\', volatile: 'path' },
    { text: 'ReportExporter.cs:212 · ' },
    { text: '2026-03-02T17:40:09Z', volatile: 'timestamp' },
  ],
];

/** The shared signature both samples normalise to. */
export const signature = errorSamples[0]
  .map((part) => (part.volatile ? placeholders[part.volatile] : part.text))
  .join('');

export interface Ranking {
  name: string;
  /** Document ids, best first. */
  docs: string[];
}

export const rankings: Ranking[] = [
  { name: 'keyword', docs: ['A', 'C', 'B', 'E'] },
  { name: 'semantic', docs: ['C', 'A', 'F', 'D'] },
  { name: 'exact error', docs: ['C', 'E', 'A'] },
];

/** The constant from the original RRF paper; a common default. */
export const RRF_K = 60;

export interface Fused {
  doc: string;
  score: number;
}

/** Reciprocal Rank Fusion: score(d) = Σ 1 / (k + rank). Ranks are 1-based. */
export function fuse(lists: Ranking[], k = RRF_K): Fused[] {
  const scores = new Map<string, number>();
  for (const list of lists) {
    list.docs.forEach((doc, index) => {
      scores.set(doc, (scores.get(doc) ?? 0) + 1 / (k + index + 1));
    });
  }
  return [...scores]
    .map(([doc, score]) => ({ doc, score }))
    .sort((a, b) => b.score - a.score || a.doc.localeCompare(b.doc));
}

export const refusal = {
  query: 'How do I rotate the signing certificate?',
  /** Best match relevance and the threshold, both 0–1. */
  bestMatch: 0.34,
  threshold: 0.6,
  nearMisses: ['Certificate expiry alerts in staging', 'Rotating API keys for the export job'],
};
