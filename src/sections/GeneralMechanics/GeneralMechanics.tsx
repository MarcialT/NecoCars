import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { ExternalLink } from '@/components/ui/ExternalLink';
import { Heading } from '@/components/ui/Heading';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { siteConfig } from '@/config/site.config';
import { SECTION_IDS } from '@/constants/sections';
import { generalMechanicsContent } from '@/content/general-mechanics.content';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

import styles from './GeneralMechanics.module.css';

const HEADING_ID = 'general-mechanics-title';

/** Banda naranja de marca a todo el ancho (sin cinta). */
export function GeneralMechanics() {
  return (
    <Section id={SECTION_IDS.generalMechanics} background="brand" className={styles.band} aria-labelledby={HEADING_ID}>
      <Container className={styles.inner}>
        <Reveal className={styles.copy}>
          <Heading id={HEADING_ID} level={2} size="3xl">
            {generalMechanicsContent.title}
          </Heading>
          <p className={styles.description}>{generalMechanicsContent.description}</p>
        </Reveal>
        <Reveal delay={150} className={styles.action}>
          <p className={styles.detail}>{generalMechanicsContent.detail}</p>
          <ExternalLink
            className={styles.button}
            href={buildWhatsAppUrl(siteConfig.whatsapp.phoneNumber, generalMechanicsContent.ctaMessage)}
          >
            <Icon name="whatsapp" size={1.5} className={styles.buttonIcon} />
            {generalMechanicsContent.note}
          </ExternalLink>
        </Reveal>
      </Container>
    </Section>
  );
}
