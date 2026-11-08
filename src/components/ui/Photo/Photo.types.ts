import type { PhotoContent } from '@/types/content.types';

export type PhotoRatio = '16-9' | '3-2' | '4-3' | '1-1';

export type PhotoProps = {
  photo: PhotoContent;
  /** Proporción de la foto. Ignorada con `fill`. */
  ratio?: PhotoRatio;
  /** Rellena a su contenedor (posición absoluta), p. ej. para el fondo del hero. */
  fill?: boolean;
  /** Foto principal de la página (LCP): se carga ya y con prioridad alta. */
  priority?: boolean;
  className?: string;
};
