import { Injectable, signal } from '@angular/core';

/** Toggles the Angular-DevTools-style component inspector overlay. */
@Injectable({ providedIn: 'root' })
export class InspectorService {
  readonly enabled = signal(false);

  toggle(): void {
    this.enabled.update((enabled) => !enabled);
  }
}
