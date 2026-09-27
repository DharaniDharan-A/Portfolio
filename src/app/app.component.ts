import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { AboutComponent } from './components/about/about.component';
import { CommandPaletteComponent } from './components/command-palette/command-palette.component';
import { ContactComponent } from './components/contact/contact.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeroComponent } from './components/hero/hero.component';
import { InspectorComponent } from './components/inspector/inspector.component';
import { MarqueeComponent } from './components/marquee/marquee.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { RecognitionComponent } from './components/recognition/recognition.component';
import { SkillsComponent } from './components/skills/skills.component';
import { StatusBarComponent } from './components/status-bar/status-bar.component';
import { ToastComponent } from './components/toast/toast.component';
import { InspectorService } from './services/inspector.service';

@Component({
  selector: 'app-root',
  imports: [
    AboutComponent,
    CommandPaletteComponent,
    ContactComponent,
    ExperienceComponent,
    FooterComponent,
    HeroComponent,
    InspectorComponent,
    MarqueeComponent,
    NavbarComponent,
    ProjectsComponent,
    RecognitionComponent,
    SkillsComponent,
    StatusBarComponent,
    ToastComponent,
  ],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-component': 'AppComponent', 'data-selector': 'app-root' },
})
export class AppComponent {
  protected readonly inspector = inject(InspectorService);

  constructor() {
    const destroyRef = inject(DestroyRef);

    // Feeds the page-wide cursor glow (see _effects.scss). A native listener,
    // so pointer movement never triggers change detection.
    afterNextRender(() => {
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
      const root = document.documentElement;
      let frame = 0;
      let x = 0;
      let y = 0;
      const move = (event: PointerEvent) => {
        x = event.clientX;
        y = event.clientY;
        frame ||= requestAnimationFrame(() => {
          frame = 0;
          root.style.setProperty('--cursor-x', `${x}px`);
          root.style.setProperty('--cursor-y', `${y}px`);
        });
      };
      window.addEventListener('pointermove', move, { passive: true });
      destroyRef.onDestroy(() => {
        window.removeEventListener('pointermove', move);
        cancelAnimationFrame(frame);
      });
    });
  }
}
