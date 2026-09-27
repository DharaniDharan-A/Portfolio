import {
  afterNextRender,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  Signal,
  signal,
} from '@angular/core';
import { MotionService } from '../services/motion.service';

/**
 * True while the calling component's host is on screen, the tab is visible,
 * and animations are playing — i.e. while a self-running demo should run.
 * Call from an injection context (a constructor or field initialiser).
 */
export function injectShouldAnimate(): Signal<boolean> {
  const host: HTMLElement = inject(ElementRef).nativeElement;
  const motion = inject(MotionService);
  const destroyRef = inject(DestroyRef);
  const onScreen = signal(false);
  const pageVisible = signal(document.visibilityState === 'visible');

  afterNextRender(() => {
    const observer = new IntersectionObserver(([entry]) => onScreen.set(entry.isIntersecting));
    observer.observe(host);
    const visibility = () => pageVisible.set(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', visibility);
    destroyRef.onDestroy(() => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
    });
  });

  return computed(() => onScreen() && pageVisible() && motion.playing());
}
