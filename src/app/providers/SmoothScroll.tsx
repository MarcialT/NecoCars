import Lenis from 'lenis';
import { useEffect } from 'react';

/** Suavidad del desplazamiento con la rueda del ratón: más bajo = más inercia. */
const SCROLL_LERP = 0.09;

function isPlainLeftClick(event: MouseEvent): boolean {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

/**
 * Scroll suave con inercia (Lenis). No renderiza nada.
 *
 * - Respeta "reducir movimiento": Lenis desactiva la suavidad por sí solo (`respectReducedMotion`).
 * - En pantallas táctiles se mantiene el scroll nativo (Lenis no lo toca por defecto).
 * - Los enlaces `#ancla` se gestionan aquí para actualizar la URL y mover el foco al destino cuando es enfocable
 *   (el enlace "Saltar al contenido" depende de esto). El espacio del header fijo lo descuenta Lenis solo, leyendo el
 *   `scroll-padding-top` del CSS: NO añadir un `offset` a mano o el header se resta dos veces.
 */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, lerp: SCROLL_LERP });

    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || !isPlainLeftClick(event)) return;
      if (!(event.target instanceof Element)) return;

      const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = link?.getAttribute('href');
      if (!hash || hash.length < 2) return;

      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;

      event.preventDefault();
      history.pushState(null, '', hash);
      lenis.scrollTo(target, {
        onComplete: () => {
          if (target.hasAttribute('tabindex')) target.focus({ preventScroll: true });
        },
      });
    }

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
      lenis.destroy();
    };
  }, []);

  return null;
}
