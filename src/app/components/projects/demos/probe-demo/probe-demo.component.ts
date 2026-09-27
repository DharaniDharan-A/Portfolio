import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { IconComponent } from '../../../../shared/icon.component';
import { injectShouldAnimate } from '../../../../shared/in-view';
import { WindowComponent } from '../../../../shared/window.component';

type OutcomeKind = 'ok' | 'timeout' | 'dns' | 'reset' | 'status';

interface Outcome {
  kind: OutcomeKind;
  label: string;
  /** Relative likelihood in the simulation. */
  weight: number;
}

/** The failure modes the real monitor classifies, plus success. */
const OUTCOMES: Outcome[] = [
  { kind: 'ok', label: '200 OK', weight: 74 },
  { kind: 'timeout', label: 'timeout', weight: 7 },
  { kind: 'dns', label: 'DNS failure', weight: 5 },
  { kind: 'reset', label: 'connection reset', weight: 7 },
  { kind: 'status', label: 'unexpected status 503', weight: 7 },
];

/** Made-up endpoints, each with this simulation's own probe interval (ms). */
const ENDPOINTS = [
  { name: 'service-a /health', interval: 1900 },
  { name: 'service-b /health', interval: 2600 },
  { name: 'service-c /status', interval: 3300 },
  { name: 'service-d /ping', interval: 4100 },
];

interface LogEntry {
  id: number;
  time: string;
  endpoint: string;
  outcome: Outcome;
  /** 0–1, drawn as a bar for successful probes. */
  latency: number;
}

const LOG_SIZE = 6;

/**
 * A simulated probe log: made-up endpoints probed on their own intervals, each
 * result classified into the monitor's failure modes. Runs only while on
 * screen and animations are playing.
 */
@Component({
  selector: 'app-probe-demo',
  imports: [IconComponent, WindowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-component': 'ProbeDemoComponent', 'data-selector': 'app-probe-demo' },
  templateUrl: './probe-demo.component.html',
  styleUrl: './probe-demo.component.scss',
})
export class ProbeDemoComponent {
  protected readonly endpoints = ENDPOINTS;
  /** Latest outcome per endpoint, by index. */
  protected readonly latest = signal<(Outcome | null)[]>(ENDPOINTS.map(() => null));
  protected readonly log = signal<LogEntry[]>([]);
  protected readonly running = injectShouldAnimate();

  private nextId = 0;
  private readonly clock = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  constructor() {
    this.seed();

    const destroyRef = inject(DestroyRef);
    let timers: ReturnType<typeof setTimeout>[] = [];
    const stopAll = () => {
      timers.forEach(clearTimeout);
      timers = [];
    };

    // Depends only on `running`: probing state doesn't restart the timers.
    effect((onCleanup) => {
      if (!this.running()) return;
      ENDPOINTS.forEach((endpoint, index) => {
        const loop = () => {
          this.probe(index);
          timers[index] = setTimeout(loop, endpoint.interval);
        };
        timers[index] = setTimeout(loop, 400 + index * 350);
      });
      onCleanup(stopAll);
    });

    destroyRef.onDestroy(stopAll);
  }

  /**
   * One result of every kind, so the log already shows the classification
   * when animations are paused and nothing is probing.
   */
  private seed(): void {
    const plan: [endpoint: number, kind: OutcomeKind][] = [
      [1, 'status'],
      [0, 'reset'],
      [3, 'dns'],
      [1, 'ok'],
      [2, 'timeout'],
      [0, 'ok'],
    ];
    const now = Date.now();
    const entries = plan.map(([index, kind], i) => ({
      id: this.nextId++,
      time: this.clock.format(new Date(now - (plan.length - i) * 1500)),
      endpoint: ENDPOINTS[index].name,
      outcome: OUTCOMES.find((o) => o.kind === kind)!,
      latency: 0.3 + i * 0.08,
    }));
    // Newest first, like live results.
    this.log.set(entries.reverse());
    this.latest.set(
      ENDPOINTS.map(
        (endpoint) => this.log().find((entry) => entry.endpoint === endpoint.name)?.outcome ?? null,
      ),
    );
  }

  private probe(index: number): void {
    const outcome = pick(OUTCOMES);
    this.latest.update((list) => list.map((item, i) => (i === index ? outcome : item)));
    this.log.update((entries) =>
      [
        {
          id: this.nextId++,
          time: this.clock.format(new Date()),
          endpoint: ENDPOINTS[index].name,
          outcome,
          latency: 0.15 + Math.random() * 0.7,
        },
        ...entries,
      ].slice(0, LOG_SIZE),
    );
  }
}

function pick(outcomes: Outcome[]): Outcome {
  const total = outcomes.reduce((sum, o) => sum + o.weight, 0);
  let roll = Math.random() * total;
  for (const outcome of outcomes) {
    roll -= outcome.weight;
    if (roll <= 0) return outcome;
  }
  return outcomes[0];
}
