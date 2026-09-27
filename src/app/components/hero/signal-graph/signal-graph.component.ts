import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { graphEdges, graphNodes, graphOutput } from '../../../data/signal-graph';
import { injectShouldAnimate } from '../../../shared/in-view';
import { layoutGraph } from './signal-graph.layout';

const SVG_NS = 'http://www.w3.org/2000/svg';
const MAX_PULSES = 32;
/** Pulse speed in SVG units per millisecond. */
const SPEED = 0.2;

interface Pulse {
  to: string;
  path: SVGPathElement;
  length: number;
  el: SVGGElement;
  /** 0 → 1 along the wire; starts negative to delay departure. */
  t: number;
  duration: number;
}

/**
 * A live picture of Angular's reactivity model: signals fire, pulses travel
 * the dependency wires, computed values recompute, and the effect re-renders.
 * Hovering any node fires it and lights its downstream path.
 *
 * Decorative: hidden from assistive technology (the same information is in
 * the Skills section). Pulses are driven by a requestAnimationFrame loop that
 * writes to the SVG directly, outside change detection, and only runs while
 * the graph is on screen and animations are playing.
 */
@Component({
  selector: 'app-signal-graph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-component': 'SignalGraphComponent', 'data-selector': 'app-signal-graph' },
  templateUrl: './signal-graph.component.html',
  styleUrl: './signal-graph.component.scss',
})
export class SignalGraphComponent {
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly svg = viewChild.required<ElementRef<SVGSVGElement>>('svg');
  private readonly pulseLayer = viewChild.required<ElementRef<SVGGElement>>('pulseLayer');
  private readonly outputText = viewChild.required<ElementRef<SVGTextElement>>('outputText');

  protected readonly narrow = signal(window.innerWidth < 768);
  protected readonly layout = computed(() => layoutGraph(this.narrow()));
  protected readonly outputLines = graphOutput;
  protected readonly litEdges = signal<ReadonlySet<string>>(new Set());
  protected readonly litNodes = signal<ReadonlySet<string>>(new Set());

  private readonly shouldAnimate = injectShouldAnimate();
  private readonly signalIds = graphNodes.filter((n) => n.kind === 'signal').map((n) => n.id);

  private pulses: Pulse[] = [];
  private frame = 0;
  private lastTime = 0;
  private nextAutoFire = 0;
  private lastFired: string | null = null;
  private litTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      // Lay out by the space actually available, not the viewport width.
      const resize = new ResizeObserver(([entry]) =>
        this.narrow.set(entry.contentRect.width < 440),
      );
      resize.observe(this.host);

      destroyRef.onDestroy(() => {
        resize.disconnect();
        this.stop();
        clearTimeout(this.litTimer);
      });
    });

    // (Re)start the loop whenever it should run; a new layout invalidates
    // in-flight pulses, so it restarts too.
    effect(() => {
      const shouldRun = this.shouldAnimate();
      this.layout();
      untracked(() => (shouldRun ? this.start() : this.stop()));
    });
  }

  /** Hover: fire the node and light everything downstream of it. */
  protected trigger(nodeId: string): void {
    const { edges, nodes } = downstreamOf(nodeId);
    this.litEdges.set(edges);
    this.litNodes.set(nodes);
    clearTimeout(this.litTimer);
    this.litTimer = setTimeout(() => {
      this.litEdges.set(new Set());
      this.litNodes.set(new Set());
    }, 1600);

    if (this.frame) this.fire(nodeId);
  }

  private start(): void {
    this.stop();
    this.lastTime = performance.now();
    this.nextAutoFire = this.lastTime + 700;
    this.frame = requestAnimationFrame(this.tick);
  }

  private stop(): void {
    cancelAnimationFrame(this.frame);
    this.frame = 0;
    for (const pulse of this.pulses) pulse.el.remove();
    this.pulses = [];
  }

  private readonly tick = (now: number) => {
    const dt = Math.min(now - this.lastTime, 50);
    this.lastTime = now;

    if (now >= this.nextAutoFire) {
      const id = this.pickNextSignal();
      this.lastFired = id;
      this.fire(id);
      this.nextAutoFire = now + 850 + Math.random() * 1100;
    }

    for (let i = this.pulses.length - 1; i >= 0; i--) {
      const pulse = this.pulses[i];
      pulse.t += dt / pulse.duration;
      if (pulse.t < 0) continue;
      if (pulse.t >= 1) {
        pulse.el.remove();
        this.pulses.splice(i, 1);
        this.arrive(pulse.to);
        continue;
      }
      const point = pulse.path.getPointAtLength(easeInOut(pulse.t) * pulse.length);
      pulse.el.setAttribute('transform', `translate(${point.x} ${point.y})`);
      pulse.el.style.opacity = String(Math.min(1, pulse.t * 8, (1 - pulse.t) * 8));
    }

    this.frame = requestAnimationFrame(this.tick);
  };

  /**
   * While nobody is hovering, the graph fires a signal by itself every second
   * or two. This decides which one — and so what story the idle graph tells.
   *
   * Available: `this.signalIds` (in graph order: angular, typescript, rxjs,
   * ngrx, csharp, dotnet, sql, llm, rag), `this.lastFired` (null at first),
   * and `graphEdges` to find which computed value a signal feeds.
   */
  private pickNextSignal(): string {
    // TODO(human): Choose the idle firing strategy. The line below is a
    // placeholder (uniform random) so the graph runs until this is decided.
    return this.signalIds[Math.floor(Math.random() * this.signalIds.length)];
  }

  /** A node changes: flash it and send a pulse down each outgoing wire. */
  private fire(nodeId: string, delay = 0): void {
    this.flash(nodeId);
    for (const [from, to] of graphEdges) {
      if (from === nodeId) this.spawn(from, to, delay);
    }
  }

  /** A pulse lands: the node recomputes (a short delay), then propagates. */
  private arrive(nodeId: string): void {
    const kind = graphNodes.find((n) => n.id === nodeId)?.kind;
    if (kind === 'effect') {
      this.flash(nodeId);
      this.outputText().nativeElement.animate([{ opacity: 0.35 }, { opacity: 1 }], {
        duration: 650,
        easing: 'ease-out',
      });
      return;
    }
    this.fire(nodeId, 140);
  }

  private spawn(from: string, to: string, delay: number): void {
    if (this.pulses.length >= MAX_PULSES) return;
    const path = this.svg().nativeElement.querySelector<SVGPathElement>(
      `[data-edge="${from}->${to}"]`,
    );
    if (!path) return;

    const length = path.getTotalLength();
    const duration = length / SPEED;
    const el = document.createElementNS(SVG_NS, 'g');
    el.style.opacity = '0';
    el.appendChild(circle(7, 'var(--color-accent-glow)', true));
    el.appendChild(circle(2.6, 'var(--color-accent)'));
    this.pulseLayer().nativeElement.appendChild(el);

    this.pulses.push({ to, path, length, el, t: -delay / duration, duration });
  }

  private flash(nodeId: string): void {
    this.svg()
      .nativeElement.querySelector(`[data-node="${nodeId}"] .graph__flash`)
      ?.animate(
        [
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0, transform: 'scale(1.18)' },
        ],
        { duration: 750, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      );
  }
}

/** Every edge and node reachable from `nodeId`, including itself. */
function downstreamOf(nodeId: string): { edges: Set<string>; nodes: Set<string> } {
  const edges = new Set<string>();
  const nodes = new Set<string>([nodeId]);
  const queue = [nodeId];
  while (queue.length) {
    const current = queue.shift()!;
    for (const [from, to] of graphEdges) {
      if (from !== current) continue;
      edges.add(`${from}->${to}`);
      if (!nodes.has(to)) {
        nodes.add(to);
        queue.push(to);
      }
    }
  }
  return { edges, nodes };
}

function circle(radius: number, fill: string, glow = false): SVGCircleElement {
  const el = document.createElementNS(SVG_NS, 'circle');
  el.setAttribute('r', String(radius));
  el.style.fill = fill;
  if (glow) el.setAttribute('filter', 'url(#graph-glow)');
  return el;
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}
