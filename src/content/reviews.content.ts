import type { ReviewsContent } from '@/types/content.types';

/*
 * Reseñas de Google. PENDIENTE: el cliente las pasará cuando las tenga.
 * Solo se publican reseñas reales (texto y nombre tal cual aparecen en Google): nunca inventarlas.
 * Mientras `reviews` esté vacío, la sección no aparece en la página.
 */
export const reviewsContent: ReviewsContent = {
  title: 'Lo que dicen nuestros clientes',
  description: 'Reseñas reales de Google.',
  ratingLabel: 'de 5 estrellas',
  reviews: [],
};
