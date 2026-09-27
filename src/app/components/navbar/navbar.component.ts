import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { sections } from '../../data/navigation';
import { profile } from '../../data/profile';
import { CommandPaletteService } from '../../services/command-palette.service';
import { MotionService } from '../../services/motion.service';
import { ScrollSpyService } from '../../services/scroll-spy.service';
import { ThemeService } from '../../services/theme.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-navbar',
  imports: [IconComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-component': 'NavbarComponent',
    'data-selector': 'app-navbar',
    '(document:keydown.escape)': 'onEscape()',
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class NavbarComponent {
  protected readonly theme = inject(ThemeService);
  protected readonly motion = inject(MotionService);
  protected readonly palette = inject(CommandPaletteService);
  protected readonly activeSection = inject(ScrollSpyService).active;
  protected readonly profile = profile;
  protected readonly items = sections;

  protected readonly menuOpen = signal(false);
  protected readonly scrolled = signal(false);
  protected readonly themeLabel = computed(() =>
    this.theme.theme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
  );

  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly menuButton = viewChild.required<ElementRef<HTMLButtonElement>>('menuButton');

  constructor() {
    const destroyRef = inject(DestroyRef);

    // Solid background once the page moves; transparent over the hero.
    afterNextRender(() => {
      const check = () => {
        const scrolled = window.scrollY > 8;
        if (scrolled !== this.scrolled()) this.scrolled.set(scrolled);
      };
      check();
      window.addEventListener('scroll', check, { passive: true });
      destroyRef.onDestroy(() => window.removeEventListener('scroll', check));
    });
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  /** The theme change grows out of the toggle button (keyboard clicks have no pointer position). */
  protected toggleTheme(event: MouseEvent): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.theme.toggle({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  }

  protected openPalette(): void {
    this.closeMenu();
    this.palette.open();
  }

  protected onEscape(): void {
    if (!this.menuOpen()) return;
    this.closeMenu();
    this.menuButton().nativeElement.focus();
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (this.menuOpen() && !this.host.contains(event.target as Node)) {
      this.closeMenu();
    }
  }

  /** Close the menu when keyboard focus moves somewhere outside the navigation. */
  protected onNavFocusOut(event: FocusEvent): void {
    const nav = event.currentTarget as HTMLElement;
    const next = event.relatedTarget as Node | null;
    if (this.menuOpen() && next && !nav.contains(next)) {
      this.closeMenu();
    }
  }
}
