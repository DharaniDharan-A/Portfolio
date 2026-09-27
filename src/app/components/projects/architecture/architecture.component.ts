import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { StackLayer } from '../../../models/portfolio.models';

/**
 * A layered architecture schematic built from a project's `stack` data:
 * clients at the top, then each tier, joined by connectors with request
 * (down) and response (up) packets, and the delivery pipeline underneath.
 * Plain HTML, so it reflows on small screens and reads as content.
 */
@Component({
  selector: 'app-architecture',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-component': 'ArchitectureComponent', 'data-selector': 'app-architecture' },
  templateUrl: './architecture.component.html',
  styleUrl: './architecture.component.scss',
})
export class ArchitectureComponent {
  readonly layers = input.required<StackLayer[]>();
  readonly clients = input('Clients');

  protected readonly tiers = computed(() => this.layers().filter((l) => l.kind !== 'delivery'));
  protected readonly delivery = computed(() => this.layers().find((l) => l.kind === 'delivery'));
}
