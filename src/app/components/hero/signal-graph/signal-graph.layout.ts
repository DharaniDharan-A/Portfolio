import { graphEdges, graphNodes, GraphNodeDef } from '../../../data/signal-graph';

export interface PlacedNode extends GraphNodeDef {
  x: number;
  y: number;
  w: number;
  /** Position in the entrance stagger. */
  order: number;
}

export interface PlacedEdge {
  id: string;
  from: string;
  to: string;
  d: string;
  order: number;
}

export interface GraphLayout {
  width: number;
  height: number;
  fontSize: number;
  nodeHeight: number;
  nodes: PlacedNode[];
  edges: PlacedEdge[];
  headers: { label: string; x: number; y: number }[];
  output: { x: number; y: number };
}

/**
 * Positions the graph in SVG user units.
 *
 * Wide:   [signals] → [computed] → [effect], left to right.
 * Narrow: signals and computed side by side, the effect underneath; the
 *         computed → effect wires arc around the right edge so they never
 *         cross the nodes stacked below them.
 */
export function layoutGraph(narrow: boolean): GraphLayout {
  const fontSize = narrow ? 11 : 12;
  const nodeHeight = narrow ? 26 : 28;
  const width = narrow ? 360 : 560;
  const columns = narrow
    ? { signal: 60, computed: 200, effect: 200 }
    : { signal: 68, computed: 282, effect: 480 };
  const spacing = narrow ? 36 : 40;
  const groupGap = narrow ? 14 : 16;
  const top = 48;

  const widthOf = (node: GraphNodeDef) => Math.round(node.label.length * fontSize * 0.6 + 26);
  const targetOf = (id: string) => graphEdges.find(([from]) => from === id)?.[1];
  const signals = graphNodes.filter((node) => node.kind === 'signal');
  const computeds = graphNodes.filter((node) => node.kind === 'computed');
  const effect = graphNodes.find((node) => node.kind === 'effect')!;

  const placed = new Map<string, PlacedNode>();
  let order = 0;
  let y = top;

  // Signals are grouped under the computed value they feed, so wires stay short.
  for (const computed of computeds) {
    const group = signals.filter((signal) => targetOf(signal.id) === computed.id);
    for (const signal of group) {
      placed.set(signal.id, { ...signal, x: columns.signal, y, w: widthOf(signal), order: order++ });
      y += spacing;
    }
    const ys = group.map((signal) => placed.get(signal.id)!.y);
    placed.set(computed.id, {
      ...computed,
      x: columns.computed,
      y: average(ys),
      w: widthOf(computed),
      order: 0,
    });
    y += groupGap;
  }
  for (const computed of computeds) placed.get(computed.id)!.order = order++;

  const lastSignalY = y - spacing - groupGap;
  const effectY = narrow ? lastSignalY + 64 : average(computeds.map((c) => placed.get(c.id)!.y));
  placed.set(effect.id, {
    ...effect,
    x: columns.effect,
    y: effectY,
    w: widthOf(effect),
    order: order++,
  });

  const edges: PlacedEdge[] = graphEdges.map(([from, to]) => {
    const a = placed.get(from)!;
    const b = placed.get(to)!;
    const x1 = a.x + a.w / 2;
    let d: string;
    if (narrow && b.kind === 'effect') {
      const x2 = b.x + b.w / 2;
      const arc = width - 16;
      d = `M${x1} ${a.y} C${arc} ${a.y} ${arc} ${b.y} ${x2} ${b.y}`;
    } else {
      const x2 = b.x - b.w / 2;
      const mid = (x1 + x2) / 2;
      d = `M${x1} ${a.y} C${mid} ${a.y} ${mid} ${b.y} ${x2} ${b.y}`;
    }
    return { id: `${from}->${to}`, from, to, d, order: a.order };
  });

  const effectNode = placed.get(effect.id)!;
  const output = { x: effectNode.x, y: effectNode.y + nodeHeight / 2 + 20 };
  const headers = [
    { label: 'signal()', x: columns.signal, y: 20 },
    { label: 'computed()', x: columns.computed, y: 20 },
    narrow
      ? { label: 'effect()', x: columns.effect, y: effectNode.y - nodeHeight / 2 - 12 }
      : { label: 'effect()', x: columns.effect, y: 20 },
  ];

  return {
    width,
    height: Math.max(lastSignalY + 30, output.y + 30),
    fontSize,
    nodeHeight,
    nodes: [...placed.values()].sort((p, q) => p.order - q.order),
    edges,
    headers,
    output,
  };
}

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
