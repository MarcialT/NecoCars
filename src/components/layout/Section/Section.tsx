import { cn } from '@/lib/cn';

import type { SectionProps } from './Section.types';

import styles from './Section.module.css';

export function Section({ background = 'default', className, children, ...rest }: SectionProps) {
  return (
    <section className={cn(styles.section, styles[background], className)} {...rest}>
      {children}
    </section>
  );
}
