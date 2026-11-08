/*
 * Datos de marca y contacto (fuente: docs/brand/LEEME.txt).
 * Si alguno se repite en index.html (title, description, og:*, JSON-LD), mantenerlos sincronizados.
 */
export const siteConfig = {
  /** Nombre corto de marca, para el logo y los textos. */
  name: 'Neco Cars',
  /** Nombre para SEO y datos estructurados (NAP). Debe ser idéntico en Google e Instagram. */
  fullName: 'Neco Cars mcbo',
  description:
    'Venta, reparación y cambio de tripoides, cardanes y tren delantero en Maracaibo. Cotiza por WhatsApp, atención 24 horas.',
  locale: 'es-VE',
  /** Único canal de contacto: todos los CTA abren un chat con este número. */
  whatsapp: {
    /** Formato internacional, solo dígitos y sin "+". */
    phoneNumber: '584122731718',
  },
  contact: {
    /** Se muestra tal cual en pantalla; no hay envío de correos. */
    phone: '0412 273 1718',
    location: 'Maracaibo, Zulia',
    /** Dirección tal como se muestra en pantalla. */
    address: 'Av. 16 con Calle 89B',
    /** Enlace de Google Maps a la ubicación del taller. */
    mapsUrl: 'https://maps.app.goo.gl/6cPVe5EuVBuNokcF7',
    /** Horario del taller (confirmado por el cliente). La atención por WhatsApp es aparte: 24 horas. */
    workshopHours: [{ days: 'Lunes a sábado', hours: '8:00 a. m. a 4:00 p. m.' }] as { days: string; hours: string }[],
    availability: 'Atención 24 horas',
  },
  social: {
    instagram: {
      handle: '@necocars.mcbo',
      url: 'https://www.instagram.com/necocars.mcbo',
    },
  },
} as const;
