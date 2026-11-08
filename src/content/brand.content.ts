import type { ImageAsset } from '@/types/content.types';

import logoSrc from '@/assets/images/brand/neco-cars-logo-512.png';

export const brandContent = {
  logo: {
    src: logoSrc,
    alt: 'Neco Cars Tripoides',
    width: 512,
    height: 512,
  },
} satisfies { logo: ImageAsset };
