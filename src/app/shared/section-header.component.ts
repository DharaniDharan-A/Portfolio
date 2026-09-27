import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RevealDirective } from './reveal.directive';

/**
 * Shared section heading: an index, a rule that draws in, the component's own
 * selector (this page really is built from those components), and a large
 * title that rises out of a mask. Extra intro content can be projected.
 */
@Component({
  selector: 'app-section-header',
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="section-header" appReveal>
      <p class="section-header__meta" aria-hidden="true">
        <span class="section-header__index">{{ index() }}</span>
        <span class="section-header__rule"></span>
        <span class="section-header__selector">&lt;{{ selector() }} /&gt;</span>
      </p>
      <div class="section-header__row">
        <h2 class="section-header__title" [id]="titleId()">
          <span class="section-header__mask">
            <span class="section-header__text">{{ title() }}</span>
          </span>
        </h2>
        <ng-content />
      </div>
    </header>
  `,
  styles: `
    @use 'breakpoints' as bp;

    :host {
      display: block;
    }

    .section-header {
      display: grid;
      gap: var(--space-5);
      margin-bottom: clamp(3rem, 2rem + 4vw, 6rem);
    }

    .section-header__meta {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      color: var(--color-text-muted);
    }

    .section-header__index {
      color: var(--color-accent);
    }

    .section-header__rule {
      flex: 1;
      height: 1px;
      background: linear-gradient(to right, var(--color-border-strong), var(--color-border));
      transform-origin: left;
    }

    .section-header__row {
      display: grid;
      gap: var(--space-5);
      align-items: end;

      @include bp.up(lg) {
        grid-template-columns: minmax(0, 1fr) auto;
      }
    }

    .section-header__title {
      font-size: var(--text-4xl);
      font-weight: 600;
      letter-spacing: -0.055em;
      line-height: 0.92;
    }

    .section-header__mask {
      display: block;
      overflow: hidden;
      padding-bottom: 0.1em;
      margin-bottom: -0.1em;
    }

    .section-header__text {
      display: inline-block;
    }

    @media (prefers-reduced-motion: no-preference) {
      .section-header.reveal {
        opacity: 1;
        transform: none;
      }

      .section-header__rule {
        transition: transform 1.4s var(--ease-out);
      }

      .section-header:not(.is-revealed) .section-header__rule {
        transform: scaleX(0);
      }

      .section-header__text {
        transition: transform 1.1s var(--ease-out) 0.1s;
      }

      .section-header:not(.is-revealed) .section-header__text {
        transform: translateY(110%);
      }
    }

    @media print {
      .section-header {
        margin-bottom: var(--space-3);
      }

      .section-header__meta {
        display: none;
      }
    }
  `,
})
export class SectionHeaderComponent {
  readonly index = input.required<string>();
  readonly title = input.required<string>();
  readonly titleId = input.required<string>();
  /** The selector of the component that renders this section. */
  readonly selector = input.required<string>();
}
