import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { IconComponent } from '../../shared/icon.component';

/** The live region is always in the DOM, so screen readers announce changes to it. */
@Component({
  selector: 'app-toast',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toast" role="status" [class.is-visible]="toast.message()">
      @if (toast.message(); as message) {
        <app-icon name="check" />
        {{ message }}
      }
    </div>
  `,
  styles: `
    .toast {
      position: fixed;
      bottom: calc(var(--status-height) + var(--space-5));
      left: 50%;
      z-index: 120;
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      padding: 0.6rem 1rem;
      border: 1px solid var(--color-border-strong);
      border-radius: 999px;
      background: var(--color-surface-2);
      box-shadow: var(--shadow-window);
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      white-space: nowrap;
      transform: translate(-50%, 1rem);
      opacity: 0;
      pointer-events: none;
      transition:
        opacity 0.25s ease,
        transform 0.35s var(--ease-out);

      app-icon {
        color: var(--color-success);
      }

      &.is-visible {
        opacity: 1;
        transform: translate(-50%, 0);
      }
    }
  `,
})
export class ToastComponent {
  protected readonly toast = inject(ToastService);
}
