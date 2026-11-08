import type { ReactNode } from 'react';

import { SplashScreen } from '@/components/layout/SplashScreen';

import { SmoothScroll } from './SmoothScroll';

type AppProvidersProps = {
  children: ReactNode;
};

/** Efectos y contextos globales de la aplicación. */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <>
      <SplashScreen />
      <SmoothScroll />
      {children}
    </>
  );
}
