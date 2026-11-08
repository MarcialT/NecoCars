import { Section } from '@/components/layout/Section';
import { Heading } from '@/components/ui/Heading';
import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { SECTION_IDS } from '@/constants/sections';
import { aboutUsContent } from '@/content/about-us.content';

import styles from './AboutUs.module.css';

const HEADING_ID = 'about-us-title';

/** Icono de cada razón, por id. Si se añade una razón nueva sin icono se usa `box`. */
const REASON_ICONS: Record<string, IconName> = {
  specialists: 'wrench',
  'whatsapp-24h': 'clock',
  quote: 'whatsapp',
  'one-place': 'box',
};

/**
 * Banda a todo el ancho, sin cinta. No muestra título: el encabezado va oculto (solo lectores de pantalla)
 * para mantener la estructura de la página. Es una banda: no recibe fondo de App.tsx.
 */
export function AboutUs() {
  return (
    <Section id={SECTION_IDS.aboutUs} className={styles.band} aria-labelledby={HEADING_ID}>
      <VisuallyHidden as="h2" id={HEADING_ID}>
        {aboutUsContent.title}
      </VisuallyHidden>
      <ul className={styles.board} role="list">
        {aboutUsContent.reasons.map((reason, index) => (
          <li key={reason.id} className={styles.block}>
            <Reveal delay={index * 90}>
              <Icon name={REASON_ICONS[reason.id] ?? 'box'} size={3} className={styles.icon} />
            </Reveal>
            <Reveal delay={index * 90 + 120} className={styles.text}>
              <Heading level={3} size="xl" className={styles.title}>
                {reason.title}
              </Heading>
              <p className={styles.description}>{reason.description}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
