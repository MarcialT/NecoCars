import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import type { SectionBackground } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SECTION_IDS } from '@/constants/sections';
import { servicesContent } from '@/content/services.content';

import { ServiceCard } from './components/ServiceCard';

import styles from './Services.module.css';

const HEADING_ID = 'services-title';

type ServicesProps = {
  /** Lo asigna App.tsx para alternar fondos entre secciones consecutivas. */
  background?: SectionBackground;
};

export function Services({ background = 'default' }: ServicesProps) {
  return (
    <Section id={SECTION_IDS.services} background={background} aria-labelledby={HEADING_ID}>
      <Container>
        <SectionHeading id={HEADING_ID} title={servicesContent.title} description={servicesContent.description} />
        <ul className={styles.grid} role="list">
          {servicesContent.items.map((service, index) => (
            <li key={service.id}>
              <Reveal delay={(index % 3) * 120}>
                <ServiceCard service={service} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
