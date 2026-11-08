import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { SECTION_IDS } from '@/constants/sections';
import { brandContent } from '@/content/brand.content';
import { HERO_SECONDARY_CTA_HREF, heroContent } from '@/content/hero.content';

import styles from './Hero.module.css';

const HEADING_ID = 'hero-title';

export function Hero() {
  const { logo } = brandContent;

  return (
    <Section id={SECTION_IDS.hero} className={styles.hero} aria-labelledby={HEADING_ID}>
      <Container className={styles.inner}>
        <div className={styles.copy}>
          <Heading id={HEADING_ID} level={1} size="4xl" className={styles.title}>
            {heroContent.titleLead} <span className={styles.highlight}>{heroContent.titleHighlight}</span>
          </Heading>
          <p className={styles.description}>{heroContent.description}</p>
          <div className={styles.actions}>
            <WhatsAppButton size="lg">{heroContent.primaryCtaLabel}</WhatsAppButton>
            <Button href={HERO_SECONDARY_CTA_HREF} variant="secondary" size="lg">
              {heroContent.secondaryCtaLabel}
            </Button>
          </div>
        </div>
        <img
          className={styles.logo}
          src={logo.src}
          alt={logo.alt}
          width={logo.width}
          height={logo.height}
          fetchPriority="high"
          decoding="async"
        />
      </Container>
    </Section>
  );
}
