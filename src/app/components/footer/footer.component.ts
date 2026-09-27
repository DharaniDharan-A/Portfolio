import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { profile } from '../../data/profile';
import { InspectorService } from '../../services/inspector.service';
import { MotionService } from '../../services/motion.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-footer',
  imports: [IconComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-component': 'FooterComponent', 'data-selector': 'app-footer' },
})
export class FooterComponent {
  protected readonly motion = inject(MotionService);
  protected readonly inspector = inject(InspectorService);
  protected readonly name = profile.name;
  protected readonly year = new Date().getFullYear();
}
