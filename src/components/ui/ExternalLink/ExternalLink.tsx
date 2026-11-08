import type { ComponentPropsWithoutRef } from 'react';

import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { uiContent } from '@/content/ui.content';

type ExternalLinkProps = ComponentPropsWithoutRef<'a'> & {
  href: string;
};

/** Enlace a un sitio externo: abre en pestaña nueva de forma segura y avisa a los lectores de pantalla. */
export function ExternalLink({ children, ...rest }: ExternalLinkProps) {
  return (
    <a target="_blank" rel="noopener noreferrer" {...rest}>
      {children} <VisuallyHidden>{uiContent.externalLink}</VisuallyHidden>
    </a>
  );
}
