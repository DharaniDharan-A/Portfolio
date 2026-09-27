import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

/** Must match the key used by the inline script in index.html. */
const STORAGE_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly root = this.document.documentElement;

  /** The active theme. index.html resolves it before first paint; we adopt that. */
  readonly theme = signal<Theme>(this.initialTheme());

  constructor() {
    effect(() => this.apply(this.theme()));
    this.watchSystemPreference();
  }

  /**
   * Switches theme. Given an origin (the toggle button's centre), the new theme
   * is revealed as a circle growing from that point, where the browser supports
   * View Transitions and motion is allowed.
   */
  toggle(origin?: { x: number; y: number }): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    const commit = () => {
      this.theme.set(next);
      // Applied synchronously: the view transition snapshots the DOM right after this callback.
      this.apply(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Storage can be unavailable (private mode, blocked cookies). The toggle
        // still works for this visit; it just won't be remembered.
      }
    };

    const reduceMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      this.root.getAttribute('data-motion') === 'paused';

    if (!origin || reduceMotion || !('startViewTransition' in this.document)) {
      commit();
      return;
    }

    const { x, y } = origin;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    this.document.startViewTransition(commit).ready.then(() => {
      this.root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        {
          duration: 700,
          easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      );
    });
  }

  /**
   * Reacts when the OS switches between light and dark while the page is open
   * (e.g. an automatic sunset schedule). Root service, so the listener lives
   * for the whole session and needs no cleanup.
   */
  private watchSystemPreference(): void {
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)');
    prefersLight.addEventListener('change', (event) => {
      // Follow the OS only until the visitor makes an explicit choice with the
      // toggle — the same precedence the inline script applies at page load.
      if (this.hasSavedChoice()) return;
      this.theme.set(event.matches ? 'light' : 'dark');
    });
  }

  private hasSavedChoice(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEY) !== null;
    } catch {
      return false;
    }
  }

  private initialTheme(): Theme {
    const fromScript = this.root.getAttribute('data-theme');
    if (fromScript === 'light' || fromScript === 'dark') return fromScript;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  private apply(theme: Theme): void {
    this.root.setAttribute('data-theme', theme);
    // Keep the browser UI colour (mobile address bar) in step with the page background.
    const background = getComputedStyle(this.root).getPropertyValue('--color-bg').trim();
    this.document.querySelector('meta[name="theme-color"]')?.setAttribute('content', background);
  }
}
