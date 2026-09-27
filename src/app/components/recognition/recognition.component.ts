import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { awards, certificationCount, certifications } from '../../data/recognition';
import { IconComponent } from '../../shared/icon.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { SectionHeaderComponent } from '../../shared/section-header.component';
import { WindowComponent } from '../../shared/window.component';

@Component({
  selector: 'app-recognition',
  imports: [DatePipe, IconComponent, RevealDirective, SectionHeaderComponent, WindowComponent],
  templateUrl: './recognition.component.html',
  styleUrl: './recognition.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-component': 'RecognitionComponent', 'data-selector': 'app-recognition' },
})
export class RecognitionComponent {
  protected readonly certifications = certifications;
  protected readonly total = certificationCount;
  protected readonly notShown = certificationCount - certifications.length;
  protected readonly awards = awards;
}
