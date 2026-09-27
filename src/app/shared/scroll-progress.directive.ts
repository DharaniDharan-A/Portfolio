import {
  afterNextRender,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';

/**
 * How progress is measured, from 0 to 1:
 *  - `pin`:   a tall container with a sticky child. 0 when its top reaches the
 *             top of the viewport, 1 when its bottom reaches the bottom.
 *  - `pass`:  an element read while scrolling past. 0 when its top is 85% down
 *             the viewport, 1 when its bottom is 45% down.
 *  - `enter`: an element coming into view. 0 when its top touches the bottom of
 *             the viewport, 1 when its top is 40% of the way down.
 */
export type ScrollProgressMode = 'pin' | 'pass' | 'enter';

/**
 * Writes scroll progress to a `--progress` custom property on the host, for
 * CSS to use directly, without going through Angular change detection. When
 * `steps` is set, also exposes the current step as a signal, which only changes
 * when a boundary is crossed.
 *
 * Listens to scroll only while the host is on screen.
 *
 *   <div appScrollProgress="pin" [steps]="4" #journey="scrollProgress">
 *     {{ journey.step() }}
 */
@Directive({ selector: '[appScrollProgress]', exportAs: 'scrollProgress' })
export class ScrollProgressDirective {
  readonly mode = input<ScrollProgressMode>('pass', { alias: 'appScrollProgress' });
  readonly steps = input(0);

  private readonly currentStep = signal(0);
  readonly step = this.currentStep.asReadonly();

  constructor() {
    const host: HTMLElement = inject(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      let frame = 0;

      const measure = () => {
        frame = 0;
        const rect = host.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = clamp(
          this.mode() === 'pin'
            ? -rect.top / Math.max(1, rect.height - vh)
            : this.mode() === 'enter'
              ? (vh - rect.top) / (vh * 0.6)
              : (vh * 0.85 - rect.top) / (vh * 0.4 + rect.height),
        );
        host.style.setProperty('--progress', progress.toFixed(4));

        const steps = this.steps();
        if (steps > 0) {
          const step = Math.min(steps - 1, Math.floor(progress * steps));
          if (step !== this.currentStep()) this.currentStep.set(step);
        }
      };

      const schedule = () => {
        frame ||= requestAnimationFrame(measure);
      };

      const listen = (on: boolean) => {
        const method = on ? 'addEventListener' : 'removeEventListener';
        window[method]('scroll', schedule, { passive: true });
        window[method]('resize', schedule);
      };

      const observer = new IntersectionObserver(([entry]) => {
        listen(entry.isIntersecting);
        // One last measurement on the way out, so fast scrolling still lands on 0 or 1.
        measure();
      });
      observer.observe(host);
      measure();

      destroyRef.onDestroy(() => {
        observer.disconnect();
        listen(false);
        cancelAnimationFrame(frame);
      });
    });
  }
}

function clamp(value: number): number {
  return Math.min(1, Math.max(0, value));
}
