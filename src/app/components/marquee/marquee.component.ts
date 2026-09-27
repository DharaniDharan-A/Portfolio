import { ChangeDetectionStrategy, Component } from '@angular/core';
import { featuredStack } from '../../data/skills';

/**
 * A slow, endless band of the core stack. Purely decorative (the full skill
 * list lives in Skills), so it's hidden from assistive technology. It pauses on
 * hover and with the site's animation toggle, and sits still under reduced motion.
 */
@Component({
  selector: 'app-marquee',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-component': 'MarqueeComponent', 'data-selector': 'app-marquee' },
  template: `
    <div class="marquee" aria-hidden="true">
      <div class="marquee__track loop">
        @for (copy of copies; track copy) {
          <ul class="marquee__group">
            @for (item of items; track item; let odd = $odd) {
              <li class="marquee__item" [class.marquee__item--outline]="odd">{{ item }}</li>
              <li class="marquee__sep">/</li>
            }
          </ul>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      margin-block: var(--space-6) 0;
      // The band is tilted and slightly scaled; clip its corners at the page
      // edge without clipping the tilt vertically.
      overflow-x: clip;
    }

    .marquee {
      overflow: hidden;
      padding-block: var(--space-5);
      border-block: 1px solid var(--color-border);
      background: color-mix(in srgb, var(--color-surface) 50%, transparent);
      transform: rotate(-1.5deg) scale(1.04);
      mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
    }

    .marquee__track {
      display: flex;
      width: max-content;
    }

    .marquee__group {
      display: flex;
      align-items: center;
      gap: clamp(1.25rem, 3vw, 2.5rem);
      padding-right: clamp(1.25rem, 3vw, 2.5rem);
      list-style: none;
    }

    .marquee__item {
      font-size: clamp(1.75rem, 1rem + 3.5vw, 4rem);
      font-weight: 700;
      letter-spacing: -0.04em;
      line-height: 1;
      white-space: nowrap;
    }

    .marquee__item--outline {
      color: transparent;
      -webkit-text-stroke: 1px var(--color-text-muted);
    }

    .marquee__sep {
      font-family: var(--font-mono);
      font-size: clamp(1.25rem, 0.8rem + 2vw, 2.5rem);
      color: var(--color-accent);
    }

    @media (prefers-reduced-motion: no-preference) {
      .marquee__track {
        animation: marquee 70s linear infinite;
      }

      .marquee:hover .marquee__track {
        animation-play-state: paused;
      }

      @keyframes marquee {
        to {
          transform: translateX(-50%);
        }
      }
    }
  `,
})
export class MarqueeComponent {
  protected readonly items = featuredStack;
  /** Two identical copies, so shifting by half the track loops seamlessly. */
  protected readonly copies = [0, 1];
}
