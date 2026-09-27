import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The telecom data workflow as three animated stages: raw rows stream in,
 * get normalised onto a grid, and come out as a rendered chart. Each stage's
 * name and the caption are content; the animations are decoration.
 */
@Component({
  selector: 'app-data-pipeline',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-component': 'DataPipelineComponent', 'data-selector': 'app-data-pipeline' },
  templateUrl: './data-pipeline.component.html',
  styleUrl: './data-pipeline.component.scss',
})
export class DataPipelineComponent {
  /** Uneven row widths (%) for the raw stream; repeated twice for a seamless loop. */
  protected readonly rawRows = [72, 45, 88, 30, 64, 91, 52, 38, 77, 58, 84, 41];
  protected readonly gridCells = Array.from({ length: 24 }, (_, i) => i);
  /** Bar heights (%) for the presentation chart. */
  protected readonly bars = [45, 70, 52, 88, 63, 95, 74];
}
