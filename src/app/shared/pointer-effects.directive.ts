import { afterNextRender, DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { MotionService } from '../services/motion.service';

const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/**
 * A soft light that follows the pointer inside the host (see `.spotlight` in
 * _components.scss). Native listeners keep pointermove out of change detection.
 */
@Directive({ selector: '[appSpotlight]', host: { class: 'spotlight' } })
export class SpotlightDirective {
  constructor() {
    const host: HTMLElement = inject(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (!finePointer()) return;
      let frame = 0;
      let x = 0;
      let y = 0;

      const move = (event: PointerEvent) => {
        x = event.clientX;
        y = event.clientY;
        frame ||= requestAnimationFrame(() => {
          frame = 0;
          const rect = host.getBoundingClientRect();
          host.style.setProperty('--spot-x', `${x - rect.left}px`);
          host.style.setProperty('--spot-y', `${y - rect.top}px`);
        });
      };

      host.addEventListener('pointermove', move, { passive: true });
      destroyRef.onDestroy(() => {
        host.removeEventListener('pointermove', move);
        cancelAnimationFrame(frame);
      });
    });
  }
}

/**
 * Pulls the host a few pixels toward the pointer while hovered. Skipped for
 * touch input, and while animations are paused.
 */
@Directive({ selector: '[appMagnetic]' })
export class MagneticDirective {
  constructor() {
    const host: HTMLElement = inject(ElementRef).nativeElement;
    const motion = inject(MotionService);
    const destroyRef = inject(DestroyRef);
    const pull = 0.3;
    const limit = 10;

    afterNextRender(() => {
      if (!finePointer()) return;
      host.style.transition = 'translate 0.4s var(--ease-out)';

      const move = (event: PointerEvent) => {
        if (!motion.playing()) return;
        const rect = host.getBoundingClientRect();
        const dx = clampTo((event.clientX - (rect.left + rect.width / 2)) * pull, limit);
        const dy = clampTo((event.clientY - (rect.top + rect.height / 2)) * pull, limit);
        host.style.translate = `${dx}px ${dy}px`;
      };
      const leave = () => (host.style.translate = '');

      host.addEventListener('pointermove', move, { passive: true });
      host.addEventListener('pointerleave', leave);
      destroyRef.onDestroy(() => {
        host.removeEventListener('pointermove', move);
        host.removeEventListener('pointerleave', leave);
      });
    });
  }
}

function clampTo(value: number, limit: number): number {
  return Math.max(-limit, Math.min(limit, value));
}
