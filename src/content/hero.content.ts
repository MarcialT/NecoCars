import { SECTION_IDS } from '@/constants/sections';
import type { HeroContent } from '@/types/content.types';

export const heroContent = {
  titleLead: 'Tripoides, cardanes y',
  titleHighlight: 'tren delantero',
  description:
    'Atención por WhatsApp las 24 horas. Si tu carro hace ruido al girar, escríbenos y lo revisamos.',
  primaryCtaLabel: 'Cotiza por WhatsApp',
  secondaryCtaLabel: 'Ver servicios',
} satisfies HeroContent;

export const HERO_SECONDARY_CTA_HREF = `#${SECTION_IDS.services}`;
