import type { ComponentPropsWithoutRef, CSSProperties } from 'react';

import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/cn';

import styles from './Reveal.module.css';

type RevealDirection = 'up' | 'left' | 'right' | 'none';

type RevealProps = ComponentPropsWithoutRef<'div'> & {
  /** Retraso en ms antes de empezar. Sirve para escalonar elementos hermanos. */
  delay?: number;
  /** Desde dónde aparece. `none` solo hace fundido. */
  direction?: RevealDirection;
};

/**
 * Hace que su contenido aparezca (fundido + deslizamiento) la primera vez que entra en pantalla.
 * Solo anima `opacity` y `transform`: no provoca saltos de diseño.
 */
export function Reveal({ delay = 0, direction = 'up', className, style, children, ...rest }: RevealProps) {
  const { ref, isInView } = useInView<HTMLDivElement>();
  const revealStyle = { ...style, '--reveal-delay': `${delay}ms` } as CSSProperties;

  return (
    <div
      ref={ref}
      className={cn(styles.reveal, styles[direction], isInView && styles.visible, className)}
      style={revealStyle}
      {...rest}
    >
      {children}
    </div>
  );
}
