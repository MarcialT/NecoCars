import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import type { SectionBackground } from '@/components/layout/Section';
import { Heading } from '@/components/ui/Heading';
import { Photo } from '@/components/ui/Photo';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SECTION_IDS } from '@/constants/sections';
import { worksContent } from '@/content/works.content';

import styles from './Works.module.css';

const HEADING_ID = 'works-title';

type WorksProps = {
  /** Lo asigna App.tsx para alternar fondos entre secciones consecutivas. */
  background?: SectionBackground;
};

export function Works({ background = 'default' }: WorksProps) {
  return (
    <Section id={SECTION_IDS.works} background={background} aria-labelledby={HEADING_ID}>
      <Container>
        <SectionHeading id={HEADING_ID} title={worksContent.title} description={worksContent.description} />

        <ul className={styles.cards} role="list">
          {worksContent.beforeAfter.map((item, index) => (
            <li key={item.id}>
              <Reveal delay={(index % 2) * 150}>
                <article className={styles.card}>
                  {/* Las dos fotos van pegadas y una línea naranja las separa. */}
                  <div className={styles.pair}>
                    <figure className={styles.figure}>
                      <Photo photo={item.before} ratio="1-1" className={styles.photo} />
                      <figcaption className={`${styles.tag} ${styles.tagBefore}`}>
                        {worksContent.beforeLabel}
                      </figcaption>
                    </figure>
                    <figure className={styles.figure}>
                      <Photo photo={item.after} ratio="1-1" className={styles.photo} />
                      <figcaption className={`${styles.tag} ${styles.tagAfter}`}>{worksContent.afterLabel}</figcaption>
                    </figure>
                  </div>
                  <div className={styles.body}>
                    <span className={styles.bar} aria-hidden="true" />
                    <Heading level={3} size="2xl">
                      {item.title}
                    </Heading>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
