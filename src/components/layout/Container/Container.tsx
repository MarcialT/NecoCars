import { cn } from '@/lib/cn';

import type { ContainerProps } from './Container.types';

import styles from './Container.module.css';

export function Container({ size = 'default', className, children, ...rest }: ContainerProps) {
  return (
    <div className={cn(styles.container, styles[size], className)} {...rest}>
      {children}
    </div>
  );
}
