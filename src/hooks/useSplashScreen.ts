import { useEffect, useLayoutEffect, useState } from 'react';

export type SplashPhase = 'showing' | 'leaving' | 'done';

/** Tiempo mínimo que se ve la pantalla de carga, aunque todo cargue antes. */
const MIN_VISIBLE_MS = 1200;
/** Tope de espera a que carguen fuentes y página: pasado este tiempo se entra igual. */
const MAX_WAIT_MS = 3000;
/** Duración de la salida (la "cortina"). Debe coincidir con `splash-exit` en SplashScreen.module.css. */
const EXIT_MS = 700;

const SEEN_KEY = 'necocars:splash-seen';

function prefersReducedMotion(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function hasSeenSplash(): boolean {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    // Navegación privada o almacenamiento bloqueado: se trata como "ya vista" para no repetirla en cada carga.
    return true;
  }
}

function markSplashSeen(): void {
  try {
    window.sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Sin almacenamiento no se puede recordar: no pasa nada.
  }
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function pageLoaded(): Promise<void> {
  if (document.readyState === 'complete') return Promise.resolve();

  return new Promise((resolve) => window.addEventListener('load', () => resolve(), { once: true }));
}

/**
 * Controla las fases de la pantalla de carga: `showing` → `leaving` → `done`.
 * Solo aparece una vez por sesión del navegador y nunca si la persona pidió reducir el movimiento.
 * Mientras está activa marca `<html data-splash>` para que el resto de la página pueda esperar (hero, scroll).
 */
export function useSplashScreen(): SplashPhase {
  const [phase, setPhase] = useState<SplashPhase>(() =>
    prefersReducedMotion() || hasSeenSplash() ? 'done' : 'showing',
  );

  useLayoutEffect(() => {
    if (phase === 'done') return;

    document.documentElement.dataset['splash'] = 'active';

    return () => {
      delete document.documentElement.dataset['splash'];
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'showing') return;

    let isCancelled = false;
    markSplashSeen();

    const ready = Promise.race([Promise.all([document.fonts?.ready, pageLoaded()]), wait(MAX_WAIT_MS)]);

    void Promise.all([wait(MIN_VISIBLE_MS), ready]).then(() => {
      if (!isCancelled) setPhase('leaving');
    });

    return () => {
      isCancelled = true;
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'leaving') return;

    const timer = window.setTimeout(() => setPhase('done'), EXIT_MS);

    return () => window.clearTimeout(timer);
  }, [phase]);

  return phase;
}
