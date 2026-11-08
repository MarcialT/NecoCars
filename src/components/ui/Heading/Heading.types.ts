import type { ComponentPropsWithoutRef } from 'react';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

export type HeadingProps = ComponentPropsWithoutRef<'h2'> & {
  /** Nivel semántico (h1–h6). Define la estructura del documento. */
  level: HeadingLevel;
  /** Tamaño visual. Permite desacoplar el aspecto del nivel semántico. */
  size?: HeadingSize;
};
