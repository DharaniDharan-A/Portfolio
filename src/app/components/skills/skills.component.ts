import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { skillGroups } from '../../data/skills';
import { Skill } from '../../models/portfolio.models';
import { IconComponent } from '../../shared/icon.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { SectionHeaderComponent } from '../../shared/section-header.component';
import { WindowComponent } from '../../shared/window.component';
import { findReferences, Reference } from './references';

@Component({
  selector: 'app-skills',
  imports: [IconComponent, RevealDirective, SectionHeaderComponent, WindowComponent],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-component': 'SkillsComponent', 'data-selector': 'app-skills' },
})
export class SkillsComponent {
  protected readonly groups = skillGroups;

  /** References for every skill, found once up front (the data is static). */
  private readonly referenceMap = new Map<string, Reference[]>(
    skillGroups.flatMap((group) => group.skills).map((skill) => [skill.name, findReferences(skill)]),
  );

  protected readonly selected = signal<Skill>(skillGroups[0].skills[0]);
  protected readonly references = computed(() => this.referencesFor(this.selected()));
  protected readonly snippetCount = computed(() =>
    this.references().reduce((sum, reference) => sum + reference.snippets.length, 0),
  );

  protected referencesFor(skill: Skill): Reference[] {
    return this.referenceMap.get(skill.name) ?? [];
  }

  protected countFor(skill: Skill): number {
    return this.referencesFor(skill).reduce((sum, r) => sum + r.snippets.length, 0);
  }
}
