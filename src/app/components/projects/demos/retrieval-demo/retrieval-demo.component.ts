import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { IconComponent } from '../../../../shared/icon.component';
import { injectShouldAnimate } from '../../../../shared/in-view';
import { WindowComponent } from '../../../../shared/window.component';
import {
  errorSamples,
  fuse,
  placeholders,
  rankings,
  refusal,
  RRF_K,
  signature,
} from './retrieval-demo.data';

const TABS = [
  { id: 'signature', label: 'Signature' },
  { id: 'fusion', label: 'Fusion' },
  { id: 'refusal', label: 'Refusal' },
] as const;

/** How long each tab stays up while auto-playing. */
const DWELL_MS = 7000;

/**
 * Three stages of the knowledge base's retrieval, as an ARIA tab set. It
 * advances by itself while on screen, unless the visitor is hovering, has focus
 * inside, has picked a tab themselves, or animations are paused.
 */
@Component({
  selector: 'app-retrieval-demo',
  imports: [DecimalPipe, IconComponent, WindowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-component': 'RetrievalDemoComponent', 'data-selector': 'app-retrieval-demo' },
  templateUrl: './retrieval-demo.component.html',
  styleUrl: './retrieval-demo.component.scss',
})
export class RetrievalDemoComponent {
  protected readonly tabs = TABS;
  protected readonly active = signal(0);
  protected readonly normalised = signal(false);

  protected readonly samples = errorSamples;
  protected readonly placeholders = placeholders;
  protected readonly signature = signature;
  protected readonly rankings = rankings;
  protected readonly fused = fuse(rankings);
  protected readonly topScore = this.fused[0].score;
  protected readonly k = RRF_K;
  protected readonly refusal = refusal;
  protected readonly hoveredDoc = signal<string | null>(null);

  private readonly shouldAnimate = injectShouldAnimate();
  private readonly hovering = signal(false);
  private readonly focusInside = signal(false);
  private readonly userTookControl = signal(false);

  protected readonly autoplay = computed(
    () =>
      this.shouldAnimate() && !this.hovering() && !this.focusInside() && !this.userTookControl(),
  );
  /** Re-keys the progress bar so its animation restarts with each dwell. */
  protected readonly dwellKey = computed(() => `${this.active()}-${this.autoplay()}`);
  protected readonly dwell = DWELL_MS;

  constructor() {
    effect((onCleanup) => {
      if (!this.autoplay()) return;
      this.active();
      const timer = setTimeout(() => this.active.update((i) => (i + 1) % TABS.length), DWELL_MS);
      onCleanup(() => clearTimeout(timer));
    });

    // Opening the signature tab replays the normalisation while animating.
    effect((onCleanup) => {
      if (this.active() !== 0) return;
      if (!this.autoplay()) return;
      this.normalised.set(false);
      const timer = setTimeout(() => this.normalised.set(true), 1400);
      onCleanup(() => clearTimeout(timer));
    });
  }

  protected select(index: number): void {
    this.userTookControl.set(true);
    this.active.set(index);
  }

  protected onTabKeydown(event: KeyboardEvent, index: number): void {
    const last = TABS.length - 1;
    const target =
      event.key === 'ArrowRight'
        ? index === last ? 0 : index + 1
        : event.key === 'ArrowLeft'
          ? index === 0 ? last : index - 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null;
    if (target === null) return;
    event.preventDefault();
    this.select(target);
    const tablist = (event.currentTarget as HTMLElement).parentElement;
    tablist?.querySelectorAll<HTMLElement>('[role="tab"]')[target]?.focus();
  }

  protected setHovering(value: boolean): void {
    this.hovering.set(value);
  }

  protected onFocusOut(event: FocusEvent): void {
    const root = event.currentTarget as HTMLElement;
    this.focusInside.set(root.contains(event.relatedTarget as Node | null));
  }

  protected onFocusIn(): void {
    this.focusInside.set(true);
  }

  protected toggleNormalised(): void {
    this.userTookControl.set(true);
    this.normalised.update((value) => !value);
  }
}
