import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { profile } from '../../data/profile';
import { ToastService } from '../../services/toast.service';
import { IconComponent } from '../../shared/icon.component';
import { MagneticDirective } from '../../shared/pointer-effects.directive';
import { RevealDirective } from '../../shared/reveal.directive';
import { SectionHeaderComponent } from '../../shared/section-header.component';
import { WindowComponent } from '../../shared/window.component';

@Component({
  selector: 'app-contact',
  imports: [
    IconComponent,
    MagneticDirective,
    RevealDirective,
    SectionHeaderComponent,
    WindowComponent,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-component': 'ContactComponent', 'data-selector': 'app-contact' },
})
export class ContactComponent {
  private readonly toast = inject(ToastService);

  protected readonly location = profile.location;
  protected readonly methods = profile.contact;
  protected readonly email = profile.contact.find((method) => method.kind === 'email')!;

  private readonly timeFormat = new Intl.DateTimeFormat('en-IN', {
    timeZone: profile.timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZoneName: 'short',
  });
  protected readonly localTime = signal(this.timeFormat.format(new Date()));

  constructor() {
    const timer = setInterval(() => this.localTime.set(this.timeFormat.format(new Date())), 30_000);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }

  protected async copyEmail(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.email.value);
      this.toast.show('Email address copied');
    } catch {
      this.toast.show('Couldn’t copy — the address is selectable instead');
    }
  }
}
