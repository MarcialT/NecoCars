/** Ids de ancla de cada sección. Se usan en <section id>, en la navegación y en el skip link. */
export const SECTION_IDS = {
  main: 'main-content',
  hero: 'hero',
  services: 'services',
  generalMechanics: 'general-mechanics',
  howItWorks: 'how-it-works',
  whyUs: 'why-us',
  works: 'works',
  reviews: 'reviews',
  contact: 'contact',
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];
