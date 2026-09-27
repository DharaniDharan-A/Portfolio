import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { sections } from '../../data/navigation';
import { profile } from '../../data/profile';
import { projects } from '../../data/projects';
import { CommandPaletteService } from '../../services/command-palette.service';
import { InspectorService } from '../../services/inspector.service';
import { MotionService } from '../../services/motion.service';
import { ThemeService } from '../../services/theme.service';
import { ToastService } from '../../services/toast.service';
import { IconComponent } from '../../shared/icon.component';
import { Command, filterCommands } from './commands';

/**
 * ⌘K / Ctrl+K command palette. A native modal <dialog> provides the inert
 * background, focus containment and Escape-to-close; the list follows the
 * ARIA combobox + listbox pattern (focus stays in the input, the active
 * option is conveyed with aria-activedescendant).
 */
@Component({
  selector: 'app-command-palette',
  imports: [IconComponent],
  templateUrl: './command-palette.component.html',
  styleUrl: './command-palette.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-component': 'CommandPaletteComponent',
    'data-selector': 'app-command-palette',
    '(document:keydown)': 'onGlobalKeydown($event)',
  },
})
export class CommandPaletteComponent {
  protected readonly palette = inject(CommandPaletteService);
  private readonly theme = inject(ThemeService);
  private readonly motion = inject(MotionService);
  private readonly inspector = inject(InspectorService);
  private readonly toast = inject(ToastService);

  // Not `.required`: the open/close effect may first run before the view exists.
  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');
  private readonly input = viewChild<ElementRef<HTMLInputElement>>('input');

  protected readonly query = signal('');
  protected readonly activeIndex = signal(0);
  protected readonly results = computed(() => filterCommands(this.commands(), this.query()));
  protected readonly activeId = computed(() => {
    const command = this.results()[this.activeIndex()];
    return command ? `command-${command.id}` : null;
  });

  private returnFocusTo: HTMLElement | null = null;
  /** Set by commands that move focus themselves, so closing doesn't undo it. */
  private keepFocus = false;

  /** Labels depend on current state (theme, motion, inspector), so this is computed. */
  private readonly commands = computed<Command[]>(() => [
    ...sections.map((section) => ({
      id: `go-${section.id}`,
      label: section.label,
      group: 'Go to' as const,
      icon: 'arrow-right' as const,
      keywords: 'section jump navigate',
      run: () => this.goTo(section.id),
    })),
    ...projects.map((project) => ({
      id: `go-${project.id}`,
      label: project.title,
      group: 'Go to' as const,
      icon: 'file' as const,
      keywords: 'project',
      run: () => this.goTo(project.id),
    })),
    {
      id: 'copy-email',
      label: 'Copy email address',
      group: 'Contact',
      icon: 'copy',
      keywords: 'mail clipboard',
      run: () => this.copyEmail(),
    },
    ...profile.contact.map((method) => ({
      id: `contact-${method.kind}`,
      label: method.kind === 'email' ? 'Send an email' : method.kind === 'phone' ? 'Call' : `Open ${method.label}`,
      group: 'Contact' as const,
      icon: method.kind,
      keywords: method.value,
      run: () => (location.href = method.href),
    })),
    {
      id: 'resume',
      label: 'Download résumé',
      group: 'Action',
      icon: 'download',
      keywords: 'cv resume pdf',
      run: () => this.download(profile.resumeUrl),
    },
    {
      id: 'theme',
      label: this.theme.theme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
      group: 'Action',
      icon: this.theme.theme() === 'dark' ? 'sun' : 'moon',
      keywords: 'theme dark light mode colour color',
      run: () => this.theme.toggle(),
    },
    {
      id: 'motion',
      label: this.motion.playing() ? 'Pause animations' : 'Play animations',
      group: 'Action',
      icon: this.motion.playing() ? 'pause' : 'play',
      keywords: 'motion animation reduce stop',
      run: () => this.motion.toggle(),
    },
    {
      id: 'inspect',
      label: this.inspector.enabled() ? 'Hide component inspector' : 'Show component inspector',
      group: 'Action',
      icon: 'inspect',
      keywords: 'devtools angular components tree debug',
      run: () => this.inspector.toggle(),
    },
    {
      id: 'print',
      label: 'Print this page',
      group: 'Action',
      icon: 'file',
      keywords: 'pdf paper',
      run: () => setTimeout(() => window.print(), 50),
    },
  ]);

  constructor() {
    effect(() => {
      const open = this.palette.isOpen();
      const dialog = this.dialog()?.nativeElement;
      if (!dialog) return;
      if (open && !dialog.open) {
        this.returnFocusTo = document.activeElement as HTMLElement | null;
        this.query.set('');
        this.activeIndex.set(0);
        this.keepFocus = false;
        dialog.showModal();
        this.input()?.nativeElement.focus();
      } else if (!open && dialog.open) {
        dialog.close();
      }
    });
  }

  protected onGlobalKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.palette.toggle();
    }
  }

  protected onInput(value: string): void {
    this.query.set(value);
    this.activeIndex.set(0);
  }

  protected onInputKeydown(event: KeyboardEvent): void {
    const count = this.results().length;
    if (!count) return;
    const moves: Record<string, () => number> = {
      ArrowDown: () => (this.activeIndex() + 1) % count,
      ArrowUp: () => (this.activeIndex() - 1 + count) % count,
      Home: () => 0,
      End: () => count - 1,
    };
    if (event.key in moves) {
      event.preventDefault();
      this.activeIndex.set(moves[event.key]());
      this.scrollActiveIntoView();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.run(this.results()[this.activeIndex()]);
    }
  }

  protected run(command: Command | undefined): void {
    if (!command) return;
    this.palette.close();
    command.run();
  }

  /** Native close (Escape, backdrop, or our own close()) — sync state and restore focus. */
  protected onClose(): void {
    this.palette.close();
    if (!this.keepFocus) this.returnFocusTo?.focus();
  }

  /** Clicks on the backdrop land on the <dialog> itself. */
  protected onDialogClick(event: MouseEvent): void {
    if (event.target === this.dialog()?.nativeElement) this.palette.close();
  }

  private goTo(id: string): void {
    this.keepFocus = true;
    const target = document.getElementById(id);
    if (!target) return;
    history.replaceState(null, '', `#${id}`);
    target.scrollIntoView({ behavior: this.motion.playing() ? 'smooth' : 'auto', block: 'start' });
    // Move focus to the destination too, for keyboard and screen reader users.
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }

  private async copyEmail(): Promise<void> {
    const email = profile.contact.find((method) => method.kind === 'email')!.value;
    try {
      await navigator.clipboard.writeText(email);
      this.toast.show('Email address copied');
    } catch {
      this.toast.show('Couldn’t copy the address');
    }
  }

  private download(url: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Dharani-Dharan-Arunkumar-Resume.pdf';
    link.click();
  }

  private scrollActiveIntoView(): void {
    queueMicrotask(() => {
      const id = this.activeId();
      if (id) document.getElementById(id)?.scrollIntoView({ block: 'nearest' });
    });
  }
}
