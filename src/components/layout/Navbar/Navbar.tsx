import { useEffect, useId, useState } from 'react';

import { MobileDrawer } from '@/components/layout/MobileDrawer';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { navigationContent } from '@/content/navigation.content';
import { uiContent } from '@/content/ui.content';

import styles from './Navbar.module.css';

/** Desde este ancho (px) el menú va en la barra y no en el menú lateral. Debe coincidir con el CSS (1024px). */
const DESKTOP_MIN_WIDTH = 1024;

export function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerId = useId();

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;

    // Si se ensancha la ventana con el menú lateral abierto, se cierra: ya no hay botón para abrirlo.
    const query = window.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH}px)`);
    function handleChange(event: MediaQueryListEvent) {
      if (event.matches) setIsDrawerOpen(false);
    }

    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  return (
    <>
      <nav className={styles.navbar} aria-label={navigationContent.ariaLabel}>
        <button
          type="button"
          className={styles.toggle}
          aria-haspopup="dialog"
          aria-expanded={isDrawerOpen}
          aria-controls={drawerId}
          onClick={() => setIsDrawerOpen(true)}
        >
          <span className={styles.toggleBars} aria-hidden="true" />
          <VisuallyHidden>{uiContent.menu}</VisuallyHidden>
        </button>

        <div className={styles.menu}>
          <ul className={styles.list} role="list">
            {navigationContent.links.map((link) => (
              <li key={link.id}>
                <a className={styles.link} href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <WhatsAppButton size="sm">{navigationContent.ctaLabel}</WhatsAppButton>
        </div>
      </nav>

      <MobileDrawer id={drawerId} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
