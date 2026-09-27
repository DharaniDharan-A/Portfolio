import { ChangeDetectionStrategy, Component } from '@angular/core';
import { projects } from '../../data/projects';
import { IconComponent } from '../../shared/icon.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { SectionHeaderComponent } from '../../shared/section-header.component';
import { ArchitectureComponent } from './architecture/architecture.component';
import { DataPipelineComponent } from './data-pipeline/data-pipeline.component';
import { AgentLoopDemoComponent } from './demos/agent-loop-demo/agent-loop-demo.component';
import { ProbeDemoComponent } from './demos/probe-demo/probe-demo.component';
import { RetrievalDemoComponent } from './demos/retrieval-demo/retrieval-demo.component';

@Component({
  selector: 'app-projects',
  imports: [
    AgentLoopDemoComponent,
    ArchitectureComponent,
    DataPipelineComponent,
    IconComponent,
    ProbeDemoComponent,
    RetrievalDemoComponent,
    RevealDirective,
    SectionHeaderComponent,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-component': 'ProjectsComponent', 'data-selector': 'app-projects' },
})
export class ProjectsComponent {
  protected readonly featured = projects.filter((project) => project.featured);
  protected readonly personal = projects.filter((project) => !project.featured);
}
