/*
 * Tipos compartidos por los archivos de src/content/.
 * Cada sección añade aquí su tipo (HeroContent, FaqContent…) al crearse.
 */

export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type LinkItem = {
  id: string;
  label: string;
  href: string;
  isExternal?: boolean;
};

export type SectionHeadingContent = {
  title: string;
  description?: string;
};

/**
 * Un hueco para una foto real. Mientras `src` esté vacío se muestra un marcador
 * que explica qué foto va ahí (campo `hint`).
 */
export type PhotoContent = {
  /** Es también el nombre del archivo: `<id>.jpg` en src/assets/images/photos/. */
  id: string;
  alt: string;
  /** Qué foto hay que tomar para este hueco. */
  hint: string;
  src?: string;
};

export type NavigationContent = {
  ariaLabel: string;
  links: LinkItem[];
  ctaLabel: string;
};

export type HeroContent = {
  titleLead: string;
  titleHighlight: string;
  description: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
};

export type ServiceItem = {
  id: string;
  name: string;
  description: string;
  photo: PhotoContent;
};

export type ServicesContent = SectionHeadingContent & {
  items: ServiceItem[];
};

export type GeneralMechanicsContent = SectionHeadingContent & {
  detail: string;
  /** Texto del botón: indica la atención 24 h y abre WhatsApp. */
  note: string;
  ctaMessage: string;
};

export type StepItem = {
  id: string;
  title: string;
  description: string;
};

export type HowItWorksContent = SectionHeadingContent & {
  steps: StepItem[];
};

export type ReasonItem = {
  id: string;
  title: string;
  description: string;
};

export type WhyUsContent = SectionHeadingContent & {
  reasons: ReasonItem[];
};

export type BeforeAfterItem = {
  id: string;
  title: string;
  before: PhotoContent;
  after: PhotoContent;
};

export type WorksContent = SectionHeadingContent & {
  beforeLabel: string;
  afterLabel: string;
  beforeAfter: BeforeAfterItem[];
};

export type ReviewItem = {
  id: string;
  author: string;
  text: string;
  /** Estrellas de 1 a 5. */
  rating: number;
};

export type ReviewsContent = SectionHeadingContent & {
  /** Reseñas reales de Google. Mientras esté vacío, la sección no se muestra. */
  reviews: ReviewItem[];
  ratingLabel: string;
};

export type ContactContent = {
  title: string;
  description: string;
  ctaLabel: string;
  detailLabels: {
    whatsapp: string;
    instagram: string;
    location: string;
  };
};

export type FooterContent = {
  tagline: string;
  rights: string;
  instagramLabel: string;
  whatsappLabel: string;
  addressLabel: string;
  navigationTitle: string;
  contactTitle: string;
};
