import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/cn';

import styles from './Card.module.css';

type CardProps = ComponentPropsWithoutRef<'div'>;

export function Card({ className, children, ...rest }: CardProps) {
  return (
    <div className={cn(styles.card, className)} {...rest}>
      {children}
    </div>
  );
}
