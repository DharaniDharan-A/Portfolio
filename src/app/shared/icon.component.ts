import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName =
  | 'arrow-right'
  | 'arrow-up'
  | 'arrow-up-right'
  | 'download'
  | 'email'
  | 'phone'
  | 'linkedin'
  | 'github'
  | 'pin'
  | 'sun'
  | 'moon'
  | 'menu'
  | 'close'
  | 'search'
  | 'command'
  | 'pause'
  | 'play'
  | 'copy'
  | 'check'
  | 'cross'
  | 'inspect'
  | 'branch'
  | 'terminal'
  | 'file'
  | 'folder'
  | 'chevron-right'
  | 'lock'
  | 'award'
  | 'clock'
  | 'replay';

/**
 * Inline SVG icons on a 24×24 grid, drawn with `currentColor` strokes.
 * Every icon on this site sits next to visible or visually-hidden text, so
 * icons are always decorative and hidden from assistive technology.
 */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      focusable="false"
    >
      @switch (name()) {
        @case ('arrow-right') {
          <path d="M5 12h14M13 6l6 6-6 6" />
        }
        @case ('arrow-up') {
          <path d="M12 19V5M6 11l6-6 6 6" />
        }
        @case ('arrow-up-right') {
          <path d="M7 17 17 7M8 7h9v9" />
        }
        @case ('download') {
          <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
        }
        @case ('email') {
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
        }
        @case ('phone') {
          <rect x="6.5" y="2.5" width="11" height="19" rx="2" />
          <path d="M11 18h2" />
        }
        @case ('linkedin') {
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M8 10.5V17M8 7.5v.01M12 17v-6.5M12 13.5a2.75 2.75 0 0 1 5.5 0V17" />
        }
        @case ('github') {
          <path
            d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"
          />
        }
        @case ('pin') {
          <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
          <circle cx="12" cy="10" r="2.25" />
        }
        @case ('sun') {
          <circle cx="12" cy="12" r="4" />
          <path
            d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"
          />
        }
        @case ('moon') {
          <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z" />
        }
        @case ('menu') {
          <path d="M4 8h16M4 16h16" />
        }
        @case ('close') {
          <path d="M6 6l12 12M18 6 6 18" />
        }
        @case ('search') {
          <circle cx="11" cy="11" r="6.5" />
          <path d="m20 20-4.2-4.2" />
        }
        @case ('command') {
          <path
            d="M9 6.5A2.5 2.5 0 1 0 6.5 9H17.5A2.5 2.5 0 1 0 15 6.5V17.5A2.5 2.5 0 1 0 17.5 15H6.5A2.5 2.5 0 1 0 9 17.5Z"
          />
        }
        @case ('pause') {
          <path d="M9 5v14M15 5v14" />
        }
        @case ('play') {
          <path d="M7 4.5v15l12-7.5Z" />
        }
        @case ('copy') {
          <rect x="8.5" y="8.5" width="12" height="12" rx="2" />
          <path d="M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3" />
        }
        @case ('check') {
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        }
        @case ('cross') {
          <path d="M7 7l10 10M17 7 7 17" />
        }
        @case ('inspect') {
          <path
            d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16"
          />
          <rect x="8.5" y="8.5" width="7" height="7" rx="1" />
        }
        @case ('branch') {
          <circle cx="6.5" cy="5.5" r="2" />
          <circle cx="6.5" cy="18.5" r="2" />
          <circle cx="17.5" cy="7.5" r="2" />
          <path d="M6.5 7.5v9M17.5 9.5c0 4.5-5.5 4-11 7" />
        }
        @case ('terminal') {
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="m7 9.5 3 2.5-3 2.5M12.5 15h4.5" />
        }
        @case ('file') {
          <path d="M13.5 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9Z" />
          <path d="M13.5 3.5V9H19" />
        }
        @case ('folder') {
          <path
            d="M3.5 7.5a2 2 0 0 1 2-2h4l2 2.5h7a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2Z"
          />
        }
        @case ('chevron-right') {
          <path d="m9.5 6 6 6-6 6" />
        }
        @case ('lock') {
          <rect x="5" y="10.5" width="14" height="10" rx="2" />
          <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
        }
        @case ('award') {
          <circle cx="12" cy="9" r="5.5" />
          <path d="m8.8 13.5-1.3 7 4.5-2.5 4.5 2.5-1.3-7" />
        }
        @case ('clock') {
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3 2" />
        }
        @case ('replay') {
          <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
          <path d="M4.5 4.5v4h4" />
        }
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      flex-shrink: 0;
      width: 1.125em;
      height: 1.125em;
    }

    svg {
      width: 100%;
      height: 100%;
    }
  `,
})
export class IconComponent {
  readonly name = input.required<IconName>();
}
