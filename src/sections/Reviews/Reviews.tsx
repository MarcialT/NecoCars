import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import type { SectionBackground } from '@/components/layout/Section';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { SECTION_IDS } from '@/constants/sections';
import { reviewsContent } from '@/content/reviews.content';

import styles from './Reviews.module.css';

const HEADING_ID = 'reviews-title';
const MAX_RATING = 5;

/** Reseñas reales de Google. Si todavía no hay ninguna, la sección no se muestra. */
type ReviewsProps = {
  /** Lo asigna App.tsx para alternar fondos entre secciones consecutivas. */
  background?: SectionBackground;
};

export function Reviews({ background = 'default' }: ReviewsProps) {
  if (reviewsContent.reviews.length === 0) return null;

  return (
    <Section id={SECTION_IDS.reviews} background={background} aria-labelledby={HEADING_ID}>
      <Container>
        <SectionHeading id={HEADING_ID} title={reviewsContent.title} description={reviewsContent.description} />
        <ul className={styles.list} role="list">
          {reviewsContent.reviews.map((review, reviewIndex) => (
            <li key={review.id}>
              <Reveal delay={(reviewIndex % 3) * 120}>
                <Card className={styles.card}>
                  <p className={styles.stars}>
                    {Array.from({ length: MAX_RATING }, (_, index) => (
                      <Icon
                        key={index}
                        name="star"
                        size={1.25}
                        className={index < review.rating ? styles.starOn : styles.starOff}
                      />
                    ))}
                    <VisuallyHidden>
                      {review.rating} {reviewsContent.ratingLabel}
                    </VisuallyHidden>
                  </p>
                  <blockquote className={styles.text}>{review.text}</blockquote>
                  <p className={styles.author}>{review.author}</p>
                </Card>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
