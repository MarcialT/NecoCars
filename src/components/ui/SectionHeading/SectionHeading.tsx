import { Heading } from '@/components/ui/Heading';
import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/cn';
import type { SectionHeadingContent } from '@/types/content.types';

import styles from './SectionHeading.module.css';

type SectionHeadingProps = SectionHeadingContent & {
  /** Id del encabezado, para enlazarlo con aria-labelledby de la sección. */
  id: string;
  className?: string;
};

export function SectionHeading({ id, title, description, className }: SectionHeadingProps) {
  return (
    <Reveal>
      <header className={cn(styles.heading, className)}>
        <Heading id={id} level={2}>
          {title}
        </Heading>
        {description ? <p className={styles.description}>{description}</p> : null}
      </header>
    </Reveal>
  );
}
