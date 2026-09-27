import { afterNextRender, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { sections } from '../data/navigation';

/**
 * Scroll-spy without scroll listeners. Watches the page sections and reports
 * which one currently crosses a thin horizontal band 30% of the way down the
 * viewport, or `null` when none does (e.g. while in the hero).
 *
 * One instance serves the navbar, the status bar and anything else that asks.
 */
@Injectable({ providedIn: 'root' })
export class ScrollSpyService {
  private readonly current = signal<string | null>(null);
  readonly active = this.current.asReadonly();

  constructor() {
    const destroyRef = inject(DestroyRef);
    const ids = sections.map((section) => section.id);

    // Sections are rendered by sibling components, so wait until the whole
    // application has rendered before looking them up.
    afterNextRender(() => {
      if (!('IntersectionObserver' in window)) return;

      const inBand = new Set<string>();
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) inBand.add(entry.target.id);
            else inBand.delete(entry.target.id);
          }
          this.current.set(ids.find((id) => inBand.has(id)) ?? null);
        },
        // Shrinks the observed area to the band between 30% and 31% of the viewport.
        { rootMargin: '-30% 0px -69% 0px' },
      );

      for (const id of ids) {
        const section = document.getElementById(id);
        if (section) observer.observe(section);
      }

      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
