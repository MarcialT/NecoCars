import { SECTION_IDS } from '@/constants/sections';
import type { NavigationContent } from '@/types/content.types';

export const navigationContent = {
  ariaLabel: 'Principal',
  links: [
    { id: 'services', label: 'Servicios', href: `#${SECTION_IDS.services}` },
    { id: 'why-us', label: 'Por qué elegirnos', href: `#${SECTION_IDS.whyUs}` },
    { id: 'works', label: 'Trabajos', href: `#${SECTION_IDS.works}` },
  ],
  ctaLabel: 'Cotiza por WhatsApp',
} satisfies NavigationContent;
