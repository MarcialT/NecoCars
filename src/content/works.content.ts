import type { WorksContent } from '@/types/content.types';

import { photosContent } from './photos.content';

export const worksContent = {
  title: 'Trabajos realizados',
  description: 'Piezas de nuestro taller en Maracaibo, antes y después.',
  beforeLabel: 'Antes',
  afterLabel: 'Después',
  beforeAfter: [
    {
      id: 'tripoide',
      title: 'Tripoide desgastado y tripoide nuevo',
      before: photosContent.worksTripoideBefore,
      after: photosContent.worksTripoideAfter,
    },
    {
      id: 'cardan',
      title: 'Cardán desgastado y cardán nuevo',
      before: photosContent.worksCardanBefore,
      after: photosContent.worksCardanAfter,
    },
  ],
} satisfies WorksContent;
