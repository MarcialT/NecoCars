import type { HowItWorksContent } from '@/types/content.types';

export const howItWorksContent = {
  title: 'Tres pasos, sin vueltas',
  steps: [
    {
      id: 'write',
      title: 'Escríbenos',
      description: 'Cuéntanos por WhatsApp qué le pasa a tu carro. Si puedes, manda una foto o un video del ruido.',
    },
    {
      id: 'check',
      title: 'Lo revisamos',
      description: 'Tráelo al taller en Maracaibo y vemos qué pieza hay que atender.',
    },
    {
      id: 'fix',
      title: 'Lo resolvemos',
      description: 'Reparamos, cambiamos o damos mantenimiento a la pieza.',
    },
  ],
} satisfies HowItWorksContent;
