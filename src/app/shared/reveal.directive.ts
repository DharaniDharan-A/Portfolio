import {
  afterNextRender,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';

// One observer shared by every revealed element on the page.
let observer: IntersectionObserver | undefined;
const onEnter = new WeakMap<Element, () => void>();

function sharedObserver(): IntersectionObserver {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        onEnter.get(entry.target)?.();
        onEnter.delete(entry.target);
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
  );
  return observer;
}

/**
 * Fades and lifts an element in the first time it scrolls into view.
 * The hidden starting state is defined in CSS (_motion.scss) and only applies
 * when the user hasn't requested reduced motion.
 *
 *   <div appReveal [appRevealDelay]="120">…</div>
 */
@Directive({
  selector: '[appReveal]',
  host: {
    class: 'reveal',
    '[class.is-revealed]': 'revealed()',
    '[style.--reveal-delay]': 'appRevealDelay() + "ms"',
  },
})
export class RevealDirective {
  readonly appRevealDelay = input(0);
  protected readonly revealed = signal(false);

  constructor() {
    const element: HTMLElement = inject(ElementRef).nativeElement;

    afterNextRender(() => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion || !('IntersectionObserver' in window)) {
        this.revealed.set(true);
        return;
      }
      onEnter.set(element, () => this.revealed.set(true));
      sharedObserver().observe(element);
    });

    inject(DestroyRef).onDestroy(() => {
      onEnter.delete(element);
      observer?.unobserve(element);
    });
  }
}
