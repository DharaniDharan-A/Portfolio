import { Injectable, signal } from '@angular/core';

/** Short confirmations ("Email address copied"), announced via role="status". */
@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly message = signal<string | null>(null);
  private hideTimer?: ReturnType<typeof setTimeout>;

  show(message: string): void {
    clearTimeout(this.hideTimer);
    // Clear first so repeating the same message is announced again.
    this.message.set(null);
    setTimeout(() => this.message.set(message), 40);
    this.hideTimer = setTimeout(() => this.message.set(null), 2800);
  }
}
