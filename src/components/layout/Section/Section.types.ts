import type { ComponentPropsWithoutRef } from 'react';

import type { SectionId } from '@/constants/sections';

export type SectionBackground = 'default' | 'subtle' | 'brand';

export type SectionProps = Omit<ComponentPropsWithoutRef<'section'>, 'id'> & {
  id: SectionId;
  background?: SectionBackground;
};
