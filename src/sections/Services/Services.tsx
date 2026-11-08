import { useRef } from 'react';

import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import type { SectionBackground } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SECTION_IDS } from '@/constants/sections';
import { servicesContent } from '@/content/services.content';
import { useScrollSnapIndex } from '@/hooks/useScrollSnapIndex';
import { cn } from '@/lib/cn';

import { ServiceCard } from './components/ServiceCard';

import styles from './Services.module.css';

const HEADING_ID = 'services-title';

type ServicesProps = {
  /** Lo asigna App.tsx para alternar fondos entre secciones consecutivas. */
  background?: SectionBackground;
};

export function Services({ background = 'default' }: ServicesProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const activeIndex = useScrollSnapIndex(listRef);

  return (
    <Section id={SECTION_IDS.services} background={background} aria-labelledby={HEADING_ID}>
      <Container>
        <SectionHeading id={HEADING_ID} title={servicesContent.title} description={servicesContent.description} />
        {/*
          En el teléfono la lista es un carrusel con scroll horizontal. Un contenedor con scroll tiene que poder
          enfocarse con el teclado (WCAG 2.1.1) y llevar nombre, por eso el tabIndex y el aria-label.
        */}
        {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
        <ul ref={listRef} className={styles.list} role="list" tabIndex={0} aria-label={servicesContent.carouselLabel}>
          {servicesContent.items.map((service, index) => (
            <li key={service.id} className={styles.item}>
              <Reveal delay={(index % 3) * 120} className={styles.reveal}>
                <ServiceCard service={service} />
              </Reveal>
            </li>
          ))}
        </ul>
        <div className={styles.dots} aria-hidden="true">
          {servicesContent.items.map((service, index) => (
            <span key={service.id} className={cn(styles.dot, index === activeIndex && styles.dotActive)} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
