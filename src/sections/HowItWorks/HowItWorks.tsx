import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import type { SectionBackground } from '@/components/layout/Section';
import { Heading } from '@/components/ui/Heading';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SECTION_IDS } from '@/constants/sections';
import { howItWorksContent } from '@/content/how-it-works.content';

import styles from './HowItWorks.module.css';

const HEADING_ID = 'how-it-works-title';

type HowItWorksProps = {
  /** Lo asigna App.tsx para alternar fondos entre secciones consecutivas. */
  background?: SectionBackground;
};

export function HowItWorks({ background = 'default' }: HowItWorksProps) {
  return (
    <Section id={SECTION_IDS.howItWorks} background={background} aria-labelledby={HEADING_ID}>
      <Container>
        <SectionHeading id={HEADING_ID} title={howItWorksContent.title} />
        <ol className={styles.steps} role="list">
          {howItWorksContent.steps.map((step, index) => (
            <li key={step.id} className={styles.step}>
              <Reveal delay={index * 120} className={styles.stepContent}>
                <span className={styles.number} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <Heading level={3} className={styles.title}>
                  {step.title}
                </Heading>
                <p className={styles.description}>{step.description}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
