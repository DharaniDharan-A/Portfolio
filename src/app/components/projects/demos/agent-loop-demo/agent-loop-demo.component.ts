import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { injectShouldAnimate } from '../../../../shared/in-view';
import { WindowComponent } from '../../../../shared/window.component';

interface Stage {
  name: string;
  /** Node centre in the 320×320 viewBox. */
  x: number;
  y: number;
}

/** The lifecycle from the project summary, clockwise from the top. */
const STAGES: Stage[] = [
  { name: 'Design', x: 160, y: 46 },
  { name: 'Develop', x: 274, y: 160 },
  { name: 'Test', x: 160, y: 274 },
  { name: 'Maintain', x: 46, y: 160 },
];

const CONTRACT = ['AGENTS.md', 'CLAUDE.md', 'skills/'];
const STEP_MS = 2200;

/**
 * Agents working through the lifecycle, every one of them reading the same
 * operating contract checked into the repo. Illustrative only.
 */
@Component({
  selector: 'app-agent-loop-demo',
  imports: [WindowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-component': 'AgentLoopDemoComponent', 'data-selector': 'app-agent-loop-demo' },
  templateUrl: './agent-loop-demo.component.html',
  styleUrl: './agent-loop-demo.component.scss',
})
export class AgentLoopDemoComponent {
  protected readonly stages = STAGES;
  protected readonly contract = CONTRACT;
  protected readonly running = injectShouldAnimate();

  /** Ever-increasing, so the token keeps travelling clockwise. */
  protected readonly step = signal(0);
  protected readonly active = computed(() => this.step() % STAGES.length);
  protected readonly angle = computed(() => this.step() * (360 / STAGES.length));
  protected readonly logLine = computed(
    () => `agent:${STAGES[this.active()].name.toLowerCase()} ← ${CONTRACT.join(' · ')}`,
  );

  constructor() {
    effect((onCleanup) => {
      if (!this.running()) return;
      const timer = setInterval(() => this.step.update((s) => s + 1), STEP_MS);
      onCleanup(() => clearInterval(timer));
    });
  }
}
