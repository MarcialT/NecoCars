import { useEffect, useRef } from 'react';
import type { MouseEvent, SyntheticEvent } from 'react';

import { ExternalLink } from '@/components/ui/ExternalLink';
import { Icon } from '@/components/ui/Icon';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { siteConfig } from '@/config/site.config';
import { brandContent } from '@/content/brand.content';
import { navigationContent } from '@/content/navigation.content';
import { uiContent } from '@/content/ui.content';
import { whatsappContent } from '@/content/whatsapp.content';
import { useSwipeToDismiss } from '@/hooks/useSwipeToDismiss';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

import styles from './MobileDrawer.module.css';

/** Duración de la salida. Debe coincidir con la transición de `data-state='closing'` en MobileDrawer.module.css. */
const CLOSE_MS = 220;

type MobileDrawerProps = {
  id: string;
  isOpen: boolean;
  onClose: () => void;
};

/**
 * Menú lateral del teléfono. Usa el <dialog> nativo en modo modal: el navegador bloquea el fondo, atrapa el foco,
 * cierra con Escape y devuelve el foco al botón que lo abrió.
 *
 * Se cierra con: botón de cerrar, tocar fuera del panel, Escape, elegir un enlace o deslizar el panel hacia la derecha.
 * El estado (`isOpen`) lo manda quien lo usa; aquí solo se anima la entrada y la salida.
 */
export function MobileDrawer({ id, isOpen, onClose }: MobileDrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { ref: panelRef, reset } = useSwipeToDismiss<HTMLDivElement>({ onDismiss: onClose });
  const { logo } = brandContent;
  const whatsappUrl = buildWhatsAppUrl(siteConfig.whatsapp.phoneNumber, whatsappContent.defaultMessage);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      reset();
      dialog.dataset['state'] = 'open';
      if (!dialog.open) dialog.showModal();
      document.documentElement.dataset['drawer'] = 'open';
      return;
    }

    if (!dialog.open) return;

    dialog.dataset['state'] = 'closing';
    const timer = window.setTimeout(() => {
      dialog.close();
      delete dialog.dataset['state'];
      delete document.documentElement.dataset['drawer'];
    }, CLOSE_MS);

    return () => window.clearTimeout(timer);
  }, [isOpen, reset]);

  useEffect(() => {
    const dialog = dialogRef.current;

    return () => {
      if (dialog?.open) dialog.close();
      delete document.documentElement.dataset['drawer'];
    };
  }, []);

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    // Escape: se cierra con nuestra animación en lugar del cierre inmediato del navegador.
    event.preventDefault();
    onClose();
  }

  function handleDialogClick(event: MouseEvent<HTMLDialogElement>) {
    // El diálogo ocupa toda la pantalla: un clic que llega a él (y no al panel) es un clic en el fondo.
    if (event.target === event.currentTarget) onClose();
  }

  return (
    // El clic en el fondo es una comodidad para el ratón y el táctil; con teclado se cierra con Escape o con el botón.
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={dialogRef}
      id={id}
      className={styles.dialog}
      aria-label={uiContent.menu}
      data-lenis-prevent
      onCancel={handleCancel}
      onClick={handleDialogClick}
    >
      <div ref={panelRef} className={styles.panel}>
        <div className={styles.header}>
          <img className={styles.logo} src={logo.src} alt="" width={44} height={44} decoding="async" />
          <button type="button" className={styles.close} onClick={onClose}>
            <Icon name="close" size={1.5} />
            <VisuallyHidden>{uiContent.closeMenu}</VisuallyHidden>
          </button>
        </div>

        <nav aria-label={navigationContent.ariaLabel}>
          <ul className={styles.list} role="list">
            {navigationContent.links.map((link) => (
              <li key={link.id}>
                <a className={styles.link} href={link.href} onClick={onClose}>
                  {link.label}
                </a>
              </li>
            ))}
            {/* Un elemento más de la lista, con el mismo aspecto que las secciones. */}
            <li>
              <ExternalLink className={styles.link} href={whatsappUrl}>
                {navigationContent.ctaLabel}
              </ExternalLink>
            </li>
          </ul>
        </nav>
      </div>
    </dialog>
  );
}
