import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommandPaletteService } from '../../services/command-palette.service';
import { InspectorService } from '../../services/inspector.service';
import { MotionService } from '../../services/motion.service';
import { ScrollSpyService } from '../../services/scroll-spy.service';
import { IconComponent } from '../../shared/icon.component';

/**
 * An editor-style status bar pinned to the bottom of wide screens. The path
 * follows the section in view — it's the real folder of the component
 * rendering it. Also home to the site-wide controls.
 */
@Component({
  selector: 'app-status-bar',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-component': 'StatusBarComponent', 'data-selector': 'app-status-bar' },
  template: `
    <aside class="status" aria-label="Status bar">
      <div class="status__group">
        <span class="status__item status__item--branch">
          <app-icon name="branch" />
          main
        </span>
        <span class="status__item status__path" aria-live="off">
          src/app/components/<strong>{{ folder() }}</strong>/
        </span>
      </div>

      <div class="status__group">
        <span class="status__item status__item--muted">Angular 21 · zoneless · OnPush</span>
        <button
          type="button"
          class="status__item status__button"
          [attr.aria-pressed]="inspector.enabled()"
          (click)="inspector.toggle()"
        >
          <app-icon name="inspect" />
          Inspect components
        </button>
        <button type="button" class="status__item status__button" (click)="motion.toggle()">
          <app-icon [name]="motion.playing() ? 'pause' : 'play'" />
          {{ motion.playing() ? 'Pause animations' : 'Play animations' }}
        </button>
        <button type="button" class="status__item status__button" (click)="palette.open()">
          <app-icon name="command" />
          <span aria-hidden="true">{{ palette.shortcut }}</span>
          <span class="visually-hidden">Open the command palette</span>
        </button>
      </div>
    </aside>
  `,
  styles: `
    @use 'breakpoints' as bp;

    :host {
      display: none;

      @include bp.up(md) {
        position: fixed;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 60;
        display: block;
      }
    }

    .status {
      display: flex;
      justify-content: space-between;
      gap: var(--space-4);
      height: var(--status-height);
      padding-inline: var(--space-2);
      border-top: 1px solid var(--color-border);
      background: var(--color-surface);
      font-family: var(--font-mono);
      font-size: var(--text-2xs);
      color: var(--color-text-muted);
    }

    .status__group {
      display: flex;
      align-items: stretch;
      min-width: 0;
    }

    .status__item {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding-inline: var(--space-2);
      white-space: nowrap;
    }

    .status__item--branch {
      background: var(--color-accent);
      color: var(--color-on-accent);
      font-weight: 600;
    }

    .status__path {
      overflow: hidden;
      text-overflow: ellipsis;

      strong {
        font-weight: 500;
        color: var(--color-text);
      }
    }

    .status__item--muted {
      @include bp.down(lg) {
        display: none;
      }
    }

    .status__button {
      border: 0;
      background: transparent;
      font: inherit;
      color: inherit;

      &:hover,
      &[aria-pressed='true'] {
        background: var(--color-surface-2);
        color: var(--color-text);
      }

      &[aria-pressed='true'] app-icon {
        color: var(--color-accent);
      }

      &:focus-visible {
        outline-offset: -2px;
      }
    }
  `,
})
export class StatusBarComponent {
  protected readonly inspector = inject(InspectorService);
  protected readonly motion = inject(MotionService);
  protected readonly palette = inject(CommandPaletteService);
  private readonly active = inject(ScrollSpyService).active;

  protected readonly folder = computed(() => this.active() ?? 'hero');
}
