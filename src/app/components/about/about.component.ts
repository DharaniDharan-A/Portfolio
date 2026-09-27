import { ChangeDetectionStrategy, Component } from '@angular/core';
import { experience } from '../../data/experience';
import { profile } from '../../data/profile';
import { certificationCount } from '../../data/recognition';
import { RevealDirective } from '../../shared/reveal.directive';
import { ScrollProgressDirective } from '../../shared/scroll-progress.directive';
import { SectionHeaderComponent } from '../../shared/section-header.component';
import { WindowComponent } from '../../shared/window.component';

interface Word {
  text: string;
  accent: boolean;
}

const ducen = experience[0];
const teamSize = ducen.responsibilities
  .map((item) => item.detail.match(/team of ([\d–-]+ engineers)/)?.[1])
  .find(Boolean);

@Component({
  selector: 'app-about',
  imports: [RevealDirective, ScrollProgressDirective, SectionHeaderComponent, WindowComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-component': 'AboutComponent', 'data-selector': 'app-about' },
})
export class AboutComponent {
  protected readonly paragraphs = profile.about;
  protected readonly statement = profile.statement.replaceAll('*', '');
  protected readonly words = splitStatement(profile.statement);

  /** Rendered as a YAML file; every value comes from the data files. */
  protected readonly facts: { key: string; value: string }[] = [
    { key: 'based_in', value: profile.location },
    { key: 'employer', value: ducen.organisation },
    { key: 'since', value: ducen.start },
    { key: 'progression', value: `${ducen.roles.length} roles, one product` },
    ...(teamSize ? [{ key: 'team', value: teamSize }] : []),
    { key: 'certifications', value: String(certificationCount) },
  ];
}

/** Splits the statement into words; words inside *asterisks* are accented. */
function splitStatement(statement: string): Word[] {
  let accent = false;
  return statement.split(' ').map((raw) => {
    const opens = raw.startsWith('*');
    const closes = raw.endsWith('*') || raw.endsWith('*.') || raw.endsWith('*,');
    if (opens) accent = true;
    const word = { text: raw.replaceAll('*', ''), accent };
    if (closes) accent = false;
    return word;
  });
}
