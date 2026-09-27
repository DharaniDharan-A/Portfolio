import { DOCUMENT } from '@angular/common';
import { computed, effect, inject, Injectable, signal } from '@angular/core';

export type MotionState = 'playing' | 'paused';

/** Must match the key used by the inline script in index.html. */
const STORAGE_KEY = 'motion';

/**
 * The site-wide pause for self-running animation (WCAG 2.2.2 Pause, Stop,
 * Hide). CSS pauses anything marked `.loop` via `[data-motion='paused']`;
 * scripted animations read `playing()` and stop their frame loops.
 */
@Injectable({ providedIn: 'root' })
export class MotionService {
  private readonly root = inject(DOCUMENT).documentElement;

  readonly state = signal<MotionState>(this.initialState());
  readonly playing = computed(() => this.state() === 'playing');

  constructor() {
    effect(() => this.root.setAttribute('data-motion', this.state()));
  }

  toggle(): void {
    const next: MotionState = this.playing() ? 'paused' : 'playing';
    this.state.set(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Not remembered across visits, but still applies now.
    }
  }

  private initialState(): MotionState {
    const fromScript = this.root.getAttribute('data-motion');
    if (fromScript === 'playing' || fromScript === 'paused') return fromScript;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'paused' : 'playing';
  }
}
