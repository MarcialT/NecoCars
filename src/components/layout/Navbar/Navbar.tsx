import { useEffect, useId, useRef, useState } from 'react';

import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { navigationContent } from '@/content/navigation.content';
import { uiContent } from '@/content/ui.content';
import { cn } from '@/lib/cn';

import styles from './Navbar.module.css';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      setIsOpen(false);
      toggleRef.current?.focus();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <nav className={styles.navbar} aria-label={navigationContent.ariaLabel}>
      <button
        ref={toggleRef}
        type="button"
        className={styles.toggle}
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className={styles.toggleBars} aria-hidden="true" />
        <VisuallyHidden>{uiContent.menu}</VisuallyHidden>
      </button>

      <div id={menuId} className={cn(styles.menu, isOpen && styles.menuOpen)}>
        <ul className={styles.list} role="list">
          {navigationContent.links.map((link) => (
            <li key={link.id}>
              <a className={styles.link} href={link.href} onClick={closeMenu}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <WhatsAppButton size="sm">{navigationContent.ctaLabel}</WhatsAppButton>
      </div>
    </nav>
  );
}
