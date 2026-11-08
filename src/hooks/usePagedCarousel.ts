import { useEffect } from 'react';
import type { RefObject } from 'react';

type UsePagedCarouselOptions = {
  /** Selector de las tarjetas dentro del contenedor con scroll. */
  itemSelector?: string;
  /** Distancia mínima (px) arrastrada para pasar a la tarjeta contigua. */
  distance?: number;
  /** Velocidad mínima (px/ms) para pasar de tarjeta con un empujón rápido aunque la distancia sea corta. */
  velocity?: number;
};

/** Movimiento mínimo (px) antes de decidir si el gesto es horizontal. */
const DETECTION_THRESHOLD = 10;
/** Si el navegador no avisa del fin del scroll (`scrollend`), se da por terminado pasado este tiempo. */
const SETTLE_FALLBACK_MS = 600;
/** Deslizamiento horizontal acumulado del trackpad (px) para pasar a la tarjeta contigua. */
const WHEEL_STEP_DISTANCE = 30;
/** Pausa (ms) sin eventos de rueda que da por terminado un gesto de trackpad (incluida su inercia). */
const WHEEL_IDLE_MS = 150;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function prefersReducedMotion(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Carrusel que avanza **una tarjeta por gesto**, por fuerte que sea el empujón.
 *
 * El impulso nativo del scroll (iOS, y también la inercia del trackpad) puede pasar de largo varias tarjetas aunque
 * exista `scroll-snap-stop`. Aquí el dedo (o el ratón) arrastra el contenido y, al soltar, se decide a qué tarjeta ir:
 * siempre la actual, la anterior o la siguiente, nunca más lejos. Un deslizamiento horizontal del trackpad avanza una
 * sola tarjeta aunque el sistema siga enviando inercia. También gestiona las flechas ← → del teclado.
 *
 * Requisitos del contenedor: `overflow-x: auto`, `position: relative`, `touch-action: pan-y` (para que el navegador
 * no se quede con el gesto horizontal) y `scroll-snap-type: none` mientras tenga `data-paging="true"`.
 * Solo actúa si el contenedor realmente tiene scroll horizontal (en tableta y escritorio es una rejilla).
 */
export function usePagedCarousel<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { itemSelector = 'li', distance = 40, velocity = 0.3 }: UsePagedCarouselOptions = {},
): void {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let settleTimer = 0;
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let startScroll = 0;
    let startIndex = 0;
    let deltaX = 0;
    let isTracking = false;
    let isDragging = false;
    let wheelTotal = 0;
    let wheelTimer = 0;
    let isWheelLocked = false;

    const isScrollable = () => node.scrollWidth > node.clientWidth + 1;

    function getPositions(): number[] {
      if (!node) return [];

      const paddingLeft = Number.parseFloat(getComputedStyle(node).paddingLeft) || 0;
      const maxScroll = node.scrollWidth - node.clientWidth;

      return [...node.querySelectorAll<HTMLElement>(itemSelector)].map((item) =>
        clamp(item.offsetLeft - paddingLeft, 0, maxScroll),
      );
    }

    function getNearestIndex(): number {
      if (!node) return 0;

      let bestIndex = 0;
      let bestDistance = Number.POSITIVE_INFINITY;

      getPositions().forEach((position, index) => {
        const currentDistance = Math.abs(position - node.scrollLeft);
        if (currentDistance < bestDistance) {
          bestDistance = currentDistance;
          bestIndex = index;
        }
      });

      return bestIndex;
    }

    function goTo(index: number) {
      if (!node) return;

      const positions = getPositions();
      const target = positions[clamp(index, 0, positions.length - 1)];
      if (target === undefined) return;

      node.dataset['paging'] = 'true';
      window.clearTimeout(settleTimer);

      function settle() {
        window.clearTimeout(settleTimer);
        node?.removeEventListener('scrollend', settle);
        if (node) delete node.dataset['paging'];
      }

      node.addEventListener('scrollend', settle, { once: true });
      settleTimer = window.setTimeout(settle, SETTLE_FALLBACK_MS);
      node.scrollTo({ left: target, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }

    function handlePointerDown(event: PointerEvent) {
      if ((event.pointerType === 'mouse' && event.button !== 0) || !isScrollable()) return;

      isTracking = true;
      isDragging = false;
      startX = event.clientX;
      startY = event.clientY;
      startTime = event.timeStamp;
      startScroll = node?.scrollLeft ?? 0;
      startIndex = getNearestIndex();
      deltaX = 0;
    }

    function handlePointerMove(event: PointerEvent) {
      if (!isTracking || !node) return;

      deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;

      if (!isDragging) {
        const isHorizontal = Math.abs(deltaX) > DETECTION_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY);
        if (!isHorizontal) return;

        isDragging = true;
        window.clearTimeout(settleTimer);
        node.dataset['paging'] = 'true';
        node.setPointerCapture?.(event.pointerId);
      }

      node.scrollLeft = startScroll - deltaX;
    }

    function handlePointerEnd(event: PointerEvent) {
      if (!isTracking) return;
      isTracking = false;
      if (!isDragging) return;
      isDragging = false;

      const elapsed = Math.max(1, event.timeStamp - startTime);
      const isDecisive = Math.abs(deltaX) > distance || Math.abs(deltaX) / elapsed > velocity;
      const step = event.type === 'pointerup' && isDecisive ? (deltaX < 0 ? 1 : -1) : 0;

      goTo(startIndex + step);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      if (!isScrollable()) return;

      event.preventDefault();
      goTo(getNearestIndex() + (event.key === 'ArrowRight' ? 1 : -1));
    }

    function handleWheel(event: WheelEvent) {
      if (!isScrollable() || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;

      // Sin esto el navegador desplazaría la lista con su inercia y se saltaría tarjetas.
      event.preventDefault();
      window.clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(() => {
        wheelTotal = 0;
        isWheelLocked = false;
      }, WHEEL_IDLE_MS);

      if (isWheelLocked) return;

      wheelTotal += event.deltaX;
      if (Math.abs(wheelTotal) < WHEEL_STEP_DISTANCE) return;

      isWheelLocked = true;
      goTo(getNearestIndex() + (wheelTotal > 0 ? 1 : -1));
      wheelTotal = 0;
    }

    // Sin esto, arrastrar con el ratón sobre una imagen la "agarra" (arrastrar y soltar) y corta el gesto.
    function handleDragStart(event: DragEvent) {
      event.preventDefault();
    }

    node.addEventListener('pointerdown', handlePointerDown);
    node.addEventListener('pointermove', handlePointerMove);
    node.addEventListener('pointerup', handlePointerEnd);
    node.addEventListener('pointercancel', handlePointerEnd);
    node.addEventListener('keydown', handleKeyDown);
    node.addEventListener('wheel', handleWheel, { passive: false });
    node.addEventListener('dragstart', handleDragStart);

    return () => {
      window.clearTimeout(wheelTimer);
      node.removeEventListener('wheel', handleWheel);
      node.removeEventListener('dragstart', handleDragStart);
      window.clearTimeout(settleTimer);
      node.removeEventListener('pointerdown', handlePointerDown);
      node.removeEventListener('pointermove', handlePointerMove);
      node.removeEventListener('pointerup', handlePointerEnd);
      node.removeEventListener('pointercancel', handlePointerEnd);
      node.removeEventListener('keydown', handleKeyDown);
      delete node.dataset['paging'];
    };
  }, [ref, itemSelector, distance, velocity]);
}
