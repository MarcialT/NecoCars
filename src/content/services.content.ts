import type { ServicesContent } from '@/types/content.types';

import { photosContent } from './photos.content';

export const servicesContent = {
  title: 'Servicios',
  description: 'Venta, reparación, cambio y mantenimiento de las piezas que hacen que tu carro gire y avance bien.',
  carouselLabel: 'Servicios: desliza para ver más',
  items: [
    {
      id: 'tripoides',
      name: 'Tripoides',
      description:
        'Venta, reparación y cambio de tripoides. Si el carro suena o golpea al girar, lo revisamos.',
      photo: photosContent.serviceTripoides,
    },
    {
      id: 'cardanes',
      name: 'Cardanes',
      description:
        'Reparación de cardanes: revisión, cambio y mantenimiento para que el carro avance sin vibraciones.',
      photo: photosContent.serviceCardanes,
    },
    {
      id: 'tren-delantero',
      name: 'Tren delantero',
      description: 'Mantenimiento y reparación de las piezas del tren delantero, incluidos los guardapolvos.',
      photo: photosContent.serviceTrenDelantero,
    },
  ],
} satisfies ServicesContent;
