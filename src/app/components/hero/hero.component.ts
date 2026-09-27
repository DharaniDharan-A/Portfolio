import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { experience } from '../../data/experience';
import { profile } from '../../data/profile';
import { MotionService } from '../../services/motion.service';
import { highlight } from '../../shared/highlight';
import { IconComponent } from '../../shared/icon.component';
import { MagneticDirective } from '../../shared/pointer-effects.directive';
import { ScrollProgressDirective } from '../../shared/scroll-progress.directive';
import { formatTenure } from '../../shared/tenure.pipe';
import { WindowComponent } from '../../shared/window.component';
import { CodeEditorComponent, CodeLine } from './code-editor/code-editor.component';
import { SignalGraphComponent } from './signal-graph/signal-graph.component';

interface NameLine {
  words: { letters: { char: string; index: number }[] }[];
}

/** Letter weight at rest, and at the pointer. The loaded Geist range is 300–800. */
const WEIGHT_REST = 640;
const WEIGHT_NEAR = 300;
/** How far (px) the pointer's influence reaches. */
const REACH = 260;

const ducen = experience[0];
const currentRole = ducen.roles[0];

@Component({
  selector: 'app-hero',
  imports: [
    CodeEditorComponent,
    IconComponent,
    MagneticDirective,
    ScrollProgressDirective,
    SignalGraphComponent,
    WindowComponent,
  ],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-component': 'HeroComponent', 'data-selector': 'app-hero' },
})
export class HeroComponent {
  protected readonly profile = profile;
  protected readonly status = `${currentRole.title} at ${ducen.organisation}`;
  protected readonly nameLines = splitIntoLetters([
    profile.shortName,
    profile.name.slice(profile.shortName.length).trim(),
  ]);

  protected readonly code = buildCode();
  protected readonly caretLine = this.code.findIndex((line) => line.hint?.startsWith('→'));
  protected readonly codeLabel =
    `Code editor showing an Angular component that describes ${profile.name}: ` +
    `core skills Angular and .NET, differentiator AI engineering, and roles at ` +
    `${ducen.organisation} from ${ducen.roles.at(-1)?.title} to ${currentRole.title}.`;

  private readonly section = viewChild.required<ElementRef<HTMLElement>>('section');

  constructor() {
    const motion = inject(MotionService);
    const destroyRef = inject(DestroyRef);

    // The name's letters thin out around the pointer, like a lens passing over
    // them. Native listeners keep pointermove out of change detection.
    afterNextRender(() => {
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

      const section = this.section().nativeElement;
      const letters = Array.from(section.querySelectorAll<HTMLElement>('.name-letter'));
      let centres: { x: number; y: number }[] = [];
      let stale = true;
      let frame = 0;
      let px = 0;
      let py = 0;

      const measure = () => {
        centres = letters.map((letter) => {
          const rect = letter.getBoundingClientRect();
          return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        });
        stale = false;
      };

      const render = () => {
        frame = 0;
        if (stale) measure();
        letters.forEach((letter, i) => {
          const distance = Math.hypot(centres[i].x - px, centres[i].y - py);
          const influence = Math.max(0, 1 - distance / REACH) ** 2;
          const weight = WEIGHT_REST - (WEIGHT_REST - WEIGHT_NEAR) * influence;
          letter.style.setProperty('--wght', weight.toFixed(0));
        });
      };

      const move = (event: PointerEvent) => {
        if (!motion.playing()) return;
        px = event.clientX;
        py = event.clientY;
        frame ||= requestAnimationFrame(render);
      };
      const reset = () => letters.forEach((letter) => letter.style.removeProperty('--wght'));
      const invalidate = () => (stale = true);

      section.addEventListener('pointermove', move, { passive: true });
      section.addEventListener('pointerleave', reset);
      window.addEventListener('scroll', invalidate, { passive: true });
      window.addEventListener('resize', invalidate);

      destroyRef.onDestroy(() => {
        section.removeEventListener('pointermove', move);
        section.removeEventListener('pointerleave', reset);
        window.removeEventListener('scroll', invalidate);
        window.removeEventListener('resize', invalidate);
        cancelAnimationFrame(frame);
      });
    });
  }
}

function splitIntoLetters(lines: string[]): NameLine[] {
  let index = 0;
  return lines.map((line) => ({
    words: line.split(' ').map((word) => ({
      letters: [...word].map((char) => ({ char, index: index++ })),
    })),
  }));
}

/** The hero's code sample, generated from the same data as the rest of the page. */
function buildCode(): CodeLine[] {
  const source = [
    `import { Component, computed, signal } from '@angular/core';`,
    ``,
    `@Component({`,
    `  selector: 'app-developer',`,
    `  template: '<h1>{{ name }}</h1>',`,
    `})`,
    `export class DeveloperComponent {`,
    `  name = '${profile.name}';`,
    `  location = '${profile.location}';`,
    `  core = signal(['Angular', '.NET']);`,
    `  differentiator = signal('AI engineering');`,
    ``,
    `  employer = '${ducen.organisation}';`,
    `  since = '${ducen.start}';`,
    `  roles = signal([`,
    ...[...ducen.roles].reverse().map((role) => `    '${role.title}',`),
    `  ]);`,
    `  current = computed(() => this.roles().at(-1));`,
    `}`,
  ].join('\n');

  const hints: Record<string, string> = {
    '  since': formatTenure(ducen.start, ducen.end),
    '  current': `→ '${currentRole.title}'`,
  };

  return highlight(source).map((tokens) => {
    const text = tokens.map((token) => token.text).join('');
    const key = Object.keys(hints).find((prefix) => text.startsWith(prefix));
    return { tokens, hint: key ? hints[key] : undefined };
  });
}
