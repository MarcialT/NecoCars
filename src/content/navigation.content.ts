import { SECTION_IDS } from '@/constants/sections';
import type { NavigationContent } from '@/types/content.types';

export const navigationContent = {
  ariaLabel: 'Principal',
  links: [
    { id: 'services', label: 'Servicios', href: `#${SECTION_IDS.services}` },
    { id: 'about-us', label: 'Nosotros', href: `#${SECTION_IDS.aboutUs}` },
    { id: 'works', label: 'Trabajos', href: `#${SECTION_IDS.works}` },
  ],
  /** Texto del botón del navbar y del menú lateral. Abre WhatsApp con el mensaje de cotización. */
  ctaLabel: 'Contáctanos',
} satisfies NavigationContent;
