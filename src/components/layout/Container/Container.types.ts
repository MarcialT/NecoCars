import type { ComponentPropsWithoutRef } from 'react';

export type ContainerSize = 'default' | 'narrow';

export type ContainerProps = ComponentPropsWithoutRef<'div'> & {
  size?: ContainerSize;
};
