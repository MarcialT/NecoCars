import { useCallback, useEffect, useRef } from 'react';
import type { RefObject } from 'react';

type UseSwipeToDismissOptions = {
  /** Se llama cuando el gesto termina siendo suficiente para cerrar. */
  onDismiss: () => void;
  /** Distancia mínima (px) hacia la derecha para cerrar al soltar. */
  distance?: number;
  /** Velocidad mínima (px/ms) para cerrar con un empujón rápido aunque la distancia sea corta. */
  velocity?: number;
};

type UseSwipeToDismissResult<T extends HTMLElement> = {
  ref: RefObject<T | null>;
  /** Devuelve el elemento a su sitio (se llama al abrirlo de nuevo). */
  reset: () => void;
};

/** Movimiento mínimo (px) antes de decidir si el gesto es horizontal. */
const DETECTION_THRESHOLD = 10;
/** Deslizamiento horizontal acumulado del trackpad (px) para cerrar. */
const WHEEL_DISMISS_DISTANCE = 60;
/** Pausa (ms) sin eventos de rueda que da por terminado un gesto de trackpad (incluida su inercia). */
const WHEEL_IDLE_MS = 150;

/**
 * Cierre por gesto: arrastrar el elemento hacia la derecha.
 *
 * Funciona con el dedo (táctil), el lápiz y también con el **ratón** (botón izquierdo), para poder probarlo en una
 * ventana estrecha de escritorio, y con un deslizamiento horizontal del **trackpad** (dos dedos, en cualquier sentido
 * porque depende del ajuste de "desplazamiento natural" del sistema).
 *
 * Mientras se arrastra publica `--swipe-x` (px) y `data-swiping="true"` en el elemento, para que el CSS lo siga al
 * dedo sin transición. Al soltar, si pasó la distancia (o iba rápido) llama a `onDismiss` conservando la posición,
 * y si no, lo devuelve a su sitio. El gesto de trackpad cierra una sola vez aunque el sistema siga enviando inercia.
 * El elemento debe tener `touch-action: pan-y` para que el navegador no se quede con el gesto horizontal táctil.
 */
export function useSwipeToDismiss<T extends HTMLElement>({
  onDismiss,
  distance = 80,
  velocity = 0.5,
}: UseSwipeToDismissOptions): UseSwipeToDismissResult<T> {
  const ref = useRef<T | null>(null);
  const dismissRef = useRef(onDismiss);

  useEffect(() => {
    dismissRef.current = onDismiss;
  }, [onDismiss]);

  const reset = useCallback(() => {
    const node = ref.current;
    if (!node) return;

    node.style.removeProperty('--swipe-x');
    delete node.dataset['swiping'];
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let deltaX = 0;
    let isTracking = false;
    let isDragging = false;
    let wheelTotal = 0;
    let wheelTimer = 0;
    let isWheelLocked = false;

    function handlePointerDown(event: PointerEvent) {
      if (event.pointerType === 'mouse' && event.button !== 0) return;

      isTracking = true;
      isDragging = false;
      startX = event.clientX;
      startY = event.clientY;
      startTime = event.timeStamp;
      deltaX = 0;
    }

    function handlePointerMove(event: PointerEvent) {
      if (!isTracking || !node) return;

      deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;

      if (!isDragging) {
        const isHorizontal = Math.abs(deltaX) > DETECTION_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY);
        if (!isHorizontal || deltaX <= 0) return;

        isDragging = true;
        node.dataset['swiping'] = 'true';
        node.setPointerCapture?.(event.pointerId);
      }

      node.style.setProperty('--swipe-x', `${Math.max(0, deltaX)}px`);
    }

    function handlePointerEnd(event: PointerEvent) {
      if (!isTracking || !node) return;
      isTracking = false;
      if (!isDragging) return;
      isDragging = false;

      delete node.dataset['swiping'];

      const elapsed = Math.max(1, event.timeStamp - startTime);
      const shouldDismiss = event.type === 'pointerup' && (deltaX > distance || deltaX / elapsed > velocity);

      if (shouldDismiss) {
        dismissRef.current();
        return;
      }

      node.style.removeProperty('--swipe-x');
    }

    function handleWheel(event: WheelEvent) {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;

      // También evita el gesto de "volver atrás" del navegador con el trackpad.
      event.preventDefault();
      window.clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(() => {
        wheelTotal = 0;
        isWheelLocked = false;
      }, WHEEL_IDLE_MS);

      if (isWheelLocked) return;

      wheelTotal += Math.abs(event.deltaX);
      if (wheelTotal <= WHEEL_DISMISS_DISTANCE) return;

      isWheelLocked = true;
      dismissRef.current();
    }

    node.addEventListener('pointerdown', handlePointerDown);
    node.addEventListener('pointermove', handlePointerMove);
    node.addEventListener('pointerup', handlePointerEnd);
    node.addEventListener('pointercancel', handlePointerEnd);
    node.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.clearTimeout(wheelTimer);
      node.removeEventListener('wheel', handleWheel);
      node.removeEventListener('pointerdown', handlePointerDown);
      node.removeEventListener('pointermove', handlePointerMove);
      node.removeEventListener('pointerup', handlePointerEnd);
      node.removeEventListener('pointercancel', handlePointerEnd);
    };
  }, [distance, velocity]);

  return { ref, reset };
}
