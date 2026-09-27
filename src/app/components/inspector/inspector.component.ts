import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { InspectorService } from '../../services/inspector.service';
import { IconComponent } from '../../shared/icon.component';

interface InspectedComponent {
  name: string;
  selector: string;
  depth: number;
  element: HTMLElement;
  /** Document coordinates, for the outline overlay. */
  box: { top: number; left: number; width: number; height: number } | null;
}

/**
 * An Angular-DevTools-style inspector for this page. Components opt in with
 * `data-component` / `data-selector` host attributes; the inspector draws an
 * outline over each one and lists the live component tree, read from the DOM.
 * Overlays are absolutely positioned, so they never shift the page's layout.
 */
@Component({
  selector: 'app-inspector',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './inspector.component.html',
  styleUrl: './inspector.component.scss',
})
export class InspectorComponent {
  protected readonly inspector = inject(InspectorService);
  protected readonly components = signal<InspectedComponent[]>([]);
  protected readonly highlighted = signal<HTMLElement | null>(null);

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      let frame = 0;
      const scan = () => {
        frame = 0;
        const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-component]'));
        this.components.set(
          elements.map((element) => ({
            name: element.dataset['component'] ?? '',
            selector: element.dataset['selector'] ?? '',
            depth: depthOf(element),
            element,
            box: boxOf(element),
          })),
        );
      };
      const schedule = () => (frame ||= requestAnimationFrame(scan));

      scan();
      const resize = new ResizeObserver(schedule);
      resize.observe(document.body);
      destroyRef.onDestroy(() => {
        resize.disconnect();
        cancelAnimationFrame(frame);
      });
    });
  }

  protected reveal(item: InspectedComponent): void {
    item.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.highlighted.set(item.element);
    setTimeout(() => this.highlighted.set(null), 1600);
  }
}

function depthOf(element: HTMLElement): number {
  let depth = 0;
  for (let parent = element.parentElement; parent; parent = parent.parentElement) {
    if (parent.hasAttribute('data-component')) depth++;
  }
  return depth;
}

/** Fixed and sticky chrome (navbar, status bar) moves with the viewport; skip outlining it. */
function boxOf(element: HTMLElement): InspectedComponent['box'] {
  const position = getComputedStyle(element).position;
  if (position === 'fixed' || position === 'sticky') return null;
  const rect = element.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width,
    height: rect.height,
  };
}
