import type { WhyUsContent } from '@/types/content.types';

/* Borrador: confirmar con el cliente que cada punto es cierto antes de publicar. */
export const whyUsContent = {
  title: 'Por qué elegir Neco Cars',
  reasons: [
    {
      id: 'specialists',
      title: 'Especialistas',
      description: 'Tripoides, cardanes y tren delantero: venta, reparación, cambio y mantenimiento.',
    },
    {
      id: 'whatsapp-24h',
      title: '24 horas',
      description: 'Atención por WhatsApp a cualquier hora, con una foto o un video del problema.',
    },
    {
      id: 'quote',
      title: 'Cotiza desde casa',
      description: 'Cuéntanos qué le pasa a tu carro y cotizamos por WhatsApp.',
    },
    {
      id: 'one-place',
      title: 'Todo en un lugar',
      description: 'Compras la pieza y la instalamos en el mismo taller.',
    },
  ],
} satisfies WhyUsContent;
