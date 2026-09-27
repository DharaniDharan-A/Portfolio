/**
 * The hero's signal graph: skills (signals) feed disciplines (computed values),
 * which feed the developer (an effect) — Angular's reactive primitives used as
 * a picture of how the pieces fit together.
 */
export interface GraphNodeDef {
  id: string;
  label: string;
  kind: 'signal' | 'computed' | 'effect';
}

export const graphNodes: GraphNodeDef[] = [
  { id: 'angular', label: 'angular', kind: 'signal' },
  { id: 'typescript', label: 'typescript', kind: 'signal' },
  { id: 'rxjs', label: 'rxjs', kind: 'signal' },
  { id: 'ngrx', label: 'ngrx', kind: 'signal' },
  { id: 'csharp', label: 'csharp', kind: 'signal' },
  { id: 'dotnet', label: 'dotnet', kind: 'signal' },
  { id: 'sql', label: 'sql', kind: 'signal' },
  { id: 'llm', label: 'llm', kind: 'signal' },
  { id: 'rag', label: 'rag', kind: 'signal' },
  { id: 'frontend', label: 'frontend', kind: 'computed' },
  { id: 'backend', label: 'backend', kind: 'computed' },
  { id: 'ai', label: 'aiEngineering', kind: 'computed' },
  { id: 'developer', label: 'developer', kind: 'effect' },
];

/** [from, to] */
export const graphEdges: [string, string][] = [
  ['angular', 'frontend'],
  ['typescript', 'frontend'],
  ['rxjs', 'frontend'],
  ['ngrx', 'frontend'],
  ['csharp', 'backend'],
  ['dotnet', 'backend'],
  ['sql', 'backend'],
  ['llm', 'ai'],
  ['rag', 'ai'],
  ['frontend', 'developer'],
  ['backend', 'developer'],
  ['ai', 'developer'],
];

/** What the effect "renders", shown under the effect node. */
export const graphOutput = ['AI-Augmented', 'Full Stack Developer'];
