import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Token } from '../../../shared/highlight';

export interface CodeLine {
  tokens: Token[];
  /** IDE-style inlay hint shown after the line, e.g. a computed value. */
  hint?: string;
}

/**
 * A read-only, syntax-highlighted code view with a line gutter, inlay hints and
 * a caret. It is exposed to assistive technology as one image with a text
 * description, so screen readers don't spell out punctuation token by token.
 */
@Component({
  selector: 'app-code-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="code" role="img" [attr.aria-label]="label()">
      @for (line of lines(); track $index; let n = $index) {
        <div class="code__line" [style.--line]="n">
          <span class="code__gutter">{{ n + 1 }}</span>
          <span class="code__text"
            >@for (token of line.tokens; track $index) {<span [class]="'tok--' + token.kind">{{
              token.text
            }}</span>}@if (line.hint) {<span class="code__hint">{{ line.hint }}</span>}@if (
              n === caretLine()
            ) {<span class="code__caret loop"></span>}</span
          >
        </div>
      }
    </div>
  `,
  styles: `
    @use 'breakpoints' as bp;

    :host {
      display: block;
    }

    .code {
      padding-block: var(--space-4);
      font-family: var(--font-mono);
      font-size: 0.75rem;
      line-height: 1.75;
      counter-reset: line;

      @include bp.up(sm) {
        font-size: 0.8125rem;
      }
    }

    .code__line {
      display: grid;
      grid-template-columns: 2.75rem minmax(0, 1fr);
      padding-right: var(--space-4);
      transition: background-color 0.2s ease;

      &:hover {
        background: var(--color-accent-subtle);

        .code__gutter {
          color: var(--color-text);
        }
      }
    }

    .code__gutter {
      padding-right: var(--space-4);
      text-align: right;
      color: var(--syntax-comment);
      user-select: none;
    }

    .code__text {
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      color: var(--color-text);
    }

    .code__hint {
      margin-left: 1.25ch;
      padding: 0.05rem 0.45rem;
      border-radius: var(--radius-sm);
      background: var(--color-accent-subtle);
      color: var(--color-accent);
      font-size: 0.92em;
      font-style: italic;
      white-space: nowrap;
    }

    .code__caret {
      display: inline-block;
      width: 0.55ch;
      height: 1.15em;
      margin-left: 0.2ch;
      vertical-align: text-bottom;
      background: var(--color-accent);
      animation: caret-blink 1.1s steps(1) infinite;
    }

    @keyframes caret-blink {
      50% {
        opacity: 0;
      }
    }

    // The file "opens": lines settle in top to bottom. Not a typewriter — every
    // line is complete from the start.
    @media (prefers-reduced-motion: no-preference) {
      .code__line {
        animation: line-in 0.7s var(--ease-out) both;
        animation-delay: calc(900ms + var(--line) * 45ms);
      }

      @keyframes line-in {
        from {
          opacity: 0;
          transform: translateX(-0.75rem);
        }
      }
    }
  `,
})
export class CodeEditorComponent {
  readonly lines = input.required<CodeLine[]>();
  readonly label = input.required<string>();
  /** Zero-based line that shows the caret; -1 for none. */
  readonly caretLine = input(-1);
}
