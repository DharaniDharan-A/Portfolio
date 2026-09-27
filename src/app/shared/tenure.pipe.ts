import { Pipe, PipeTransform } from '@angular/core';
import { YearMonth } from '../models/portfolio.models';

/**
 * Length of a period in whole months, counted inclusively (the convention
 * LinkedIn uses): Aug 2022 – Sep 2023 is "1 year 2 months".
 * An open-ended period runs to the current month.
 */
export function formatTenure(start: YearMonth, end?: YearMonth): string {
  const [startYear, startMonth] = start.split('-').map(Number);
  const [endYear, endMonth] = end
    ? end.split('-').map(Number)
    : [new Date().getFullYear(), new Date().getMonth() + 1];

  const total = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
  const years = Math.floor(total / 12);
  const months = total % 12;

  return [plural(years, 'year'), plural(months, 'month')].filter(Boolean).join(' ');
}

function plural(count: number, unit: string): string {
  return count === 0 ? '' : `${count} ${unit}${count === 1 ? '' : 's'}`;
}

/** {{ role.start | tenure: role.end }} */
@Pipe({ name: 'tenure' })
export class TenurePipe implements PipeTransform {
  transform(start: YearMonth, end?: YearMonth): string {
    return formatTenure(start, end);
  }
}
