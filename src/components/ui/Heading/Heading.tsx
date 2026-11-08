import { cn } from '@/lib/cn';

import type { HeadingLevel, HeadingProps, HeadingSize } from './Heading.types';

import styles from './Heading.module.css';

const DEFAULT_SIZE_BY_LEVEL: Record<HeadingLevel, HeadingSize> = {
  1: '4xl',
  2: '3xl',
  3: '2xl',
  4: 'xl',
  5: 'lg',
  6: 'md',
};

export function Heading({ level, size, className, children, ...rest }: HeadingProps) {
  const Tag = `h${level}` as const;
  const resolvedSize = size ?? DEFAULT_SIZE_BY_LEVEL[level];

  return (
    <Tag className={cn(styles.heading, styles[`size-${resolvedSize}`], className)} {...rest}>
      {children}
    </Tag>
  );
}
