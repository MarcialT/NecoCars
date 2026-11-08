import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

/** Fracciones de visibilidad que se reportan: permiten decidir cuál es la tarjeta "más visible". */
const THRESHOLDS = [0, 0.25, 0.5, 0.75, 1];

/**
 * Índice del elemento hijo que más se ve dentro de un contenedor con scroll horizontal (carrusel).
 * Sirve para marcar el punto activo del indicador. Si no hay IntersectionObserver devuelve siempre 0.
 */
export function useScrollSnapIndex<T extends HTMLElement>(ref: RefObject<T | null>, itemSelector = 'li'): number {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = ref.current;
    if (!container || typeof IntersectionObserver === 'undefined') return;

    const items = [...container.querySelectorAll(itemSelector)];
    const ratios = new Map<Element, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target && entry.intersectionRatio !== undefined) ratios.set(entry.target, entry.intersectionRatio);
        }

        let bestIndex = 0;
        let bestRatio = -1;

        items.forEach((item, index) => {
          const ratio = ratios.get(item) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestIndex = index;
          }
        });

        setActiveIndex(bestIndex);
      },
      { root: container, threshold: THRESHOLDS },
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [ref, itemSelector]);

  return activeIndex;
}
