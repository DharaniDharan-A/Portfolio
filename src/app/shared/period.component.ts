import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { YearMonth } from '../models/portfolio.models';

/**
 * "Aug 2022 – Present" with machine-readable <time> elements. The dash is
 * hidden from screen readers and replaced with the word "to".
 */
@Component({
  selector: 'app-period',
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <time [attr.datetime]="start()">{{ start() | date: 'MMM y' }}</time>
    @if (end() !== start()) {
      <span aria-hidden="true"> – </span><span class="visually-hidden"> to </span>
      @if (end(); as endMonth) {
        <time [attr.datetime]="endMonth">{{ endMonth | date: 'MMM y' }}</time>
      } @else {
        Present
      }
    }
  `,
})
export class PeriodComponent {
  readonly start = input.required<YearMonth>();
  readonly end = input<YearMonth>();
}
