import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/cn';

type VisuallyHiddenProps = ComponentPropsWithoutRef<'span'> & {
  /** Elemento a renderizar. Usar `h2` para un encabezado de sección que no se ve pero sí se anuncia. */
  as?: 'span' | 'h2';
};

/** Oculta contenido visualmente pero lo mantiene accesible para lectores de pantalla. */
export function VisuallyHidden({ as: Tag = 'span', className, children, ...rest }: VisuallyHiddenProps) {
  return (
    <Tag className={cn('sr-only', className)} {...rest}>
      {children}
    </Tag>
  );
}
