import { Heading } from '@/components/ui/Heading';
import { Photo } from '@/components/ui/Photo';
import type { ServiceItem } from '@/types/content.types';

import styles from './ServiceCard.module.css';

type ServiceCardProps = {
  service: ServiceItem;
};

/** Tarjeta tipo póster: la foto ocupa toda la tarjeta y el texto va encima, abajo. */
export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className={styles.card}>
      <Photo photo={service.photo} fill className={styles.photo} />
      {/* La capa oscura solo se necesita cuando hay una foto real debajo del texto. */}
      {service.photo.src ? <div className={styles.overlay} aria-hidden="true" /> : null}
      <div className={styles.body}>
        <span className={styles.bar} aria-hidden="true" />
        <Heading level={3} size="2xl">
          {service.name}
        </Heading>
        <p className={styles.description}>{service.description}</p>
      </div>
    </article>
  );
}
