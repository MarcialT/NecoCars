import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

type UseInViewOptions = {
  /** Fracción del elemento que debe verse para considerarlo "dentro". */
  threshold?: number;
  /** Margen del área de observación. El valor por defecto dispara un poco después de entrar en pantalla. */
  rootMargin?: string;
};

type UseInViewResult<T extends Element> = {
  ref: RefObject<T | null>;
  isInView: boolean;
};

/**
 * Indica si un elemento ya entró en pantalla (solo una vez: después no vuelve a ocultarse).
 * Si el navegador no soporta IntersectionObserver, o la persona pidió reducir el movimiento,
 * devuelve `true` desde el principio para que el contenido nunca quede oculto.
 */
export function useInView<T extends Element>({
  threshold = 0.05,
  rootMargin = '0px 0px -4% 0px',
}: UseInViewOptions = {}): UseInViewResult<T> {
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(() => !canAnimateOnScroll());

  useEffect(() => {
    const node = ref.current;
    if (isInView || !node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setIsInView(true);
        observer.disconnect();
      },
      { threshold, rootMargin },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [isInView, threshold, rootMargin]);

  return { ref, isInView };
}

function canAnimateOnScroll(): boolean {
  if (typeof IntersectionObserver === 'undefined') return false;
  if (typeof window.matchMedia !== 'function') return true;

  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
