import { ChangeDetectionStrategy, Component } from '@angular/core';
import { education, experience } from '../../data/experience';
import { PeriodComponent } from '../../shared/period.component';
import { SpotlightDirective } from '../../shared/pointer-effects.directive';
import { RevealDirective } from '../../shared/reveal.directive';
import { ScrollProgressDirective } from '../../shared/scroll-progress.directive';
import { SectionHeaderComponent } from '../../shared/section-header.component';
import { TenurePipe } from '../../shared/tenure.pipe';

@Component({
  selector: 'app-experience',
  imports: [
    PeriodComponent,
    RevealDirective,
    ScrollProgressDirective,
    SectionHeaderComponent,
    SpotlightDirective,
    TenurePipe,
  ],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-component': 'ExperienceComponent', 'data-selector': 'app-experience' },
})
export class ExperienceComponent {
  /** The current employer gets the full release history. */
  protected readonly primary = experience[0];
  protected readonly earlier = experience.slice(1);
  protected readonly education = education;

  /** Most recent first, as in the data — the order of the git log. */
  protected readonly roles = this.primary.roles;
  /** Earliest first — the order the releases play in as you scroll. */
  protected readonly releases = [...this.primary.roles].reverse();

  /** Without motion the sequence doesn't play; HEAD simply sits on the current role. */
  protected readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
