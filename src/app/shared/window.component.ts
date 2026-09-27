import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Application-window chrome: a title bar with a file-style title and an
 * optional tag, and a body for projected content. Controls can be projected
 * into the title bar with the `windowActions` attribute.
 *
 * The title bar is decoration; give the window an `ariaLabel` when the
 * content needs a name.
 */
@Component({
  selector: 'app-window',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'window' },
  template: `
    <div class="window__bar">
      <span class="window__dots" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="window__title" aria-hidden="true">{{ title() }}</span>
      @if (tag()) {
        <span class="window__tag">{{ tag() }}</span>
      }
      <span class="window__actions"><ng-content select="[windowActions]" /></span>
    </div>
    <div class="window__body">
      <ng-content />
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-width: 0;
      overflow: hidden;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      background: var(--color-surface);
      box-shadow: var(--shadow-window);
    }

    .window__bar {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      min-height: 2.5rem;
      padding: 0 var(--space-3) 0 var(--space-4);
      border-bottom: 1px solid var(--color-border);
      background: var(--color-surface-2);
      font-family: var(--font-mono);
      font-size: var(--text-2xs);
      color: var(--color-text-muted);
    }

    .window__dots {
      display: inline-flex;
      gap: 6px;

      i {
        width: 10px;
        height: 10px;
        border: 1px solid var(--color-border-strong);
        border-radius: 50%;
      }
    }

    .window__title {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .window__tag {
      padding: 0 0.45rem;
      border: 1px dashed var(--color-border-strong);
      border-radius: 999px;
      line-height: 1.6;
      white-space: nowrap;
    }

    .window__actions:empty {
      display: none;
    }

    .window__actions {
      display: inline-flex;
      gap: var(--space-1);
    }

    .window__body {
      flex: 1;
      min-height: 0;
    }

    @media print {
      :host {
        box-shadow: none;
      }
    }
  `,
})
export class WindowComponent {
  readonly title = input.required<string>();
  readonly tag = input<string>();
}
