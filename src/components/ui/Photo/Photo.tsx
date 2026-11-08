import { cn } from '@/lib/cn';

import type { PhotoProps } from './Photo.types';

import styles from './Photo.module.css';

/**
 * Foto real del taller. Si todavía no existe el archivo, muestra un marcador
 * que indica qué foto va aquí y cómo debe llamarse el archivo.
 */
export function Photo({ photo, ratio = '4-3', fill = false, priority = false, className }: PhotoProps) {
  const frameClassName = cn(styles.frame, fill ? styles.fill : styles[`ratio-${ratio}`], className);

  if (photo.src) {
    return (
      <div className={frameClassName}>
        <img
          className={styles.image}
          src={photo.src}
          alt={photo.alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div className={cn(frameClassName, styles.placeholder)} aria-hidden="true" data-photo-slot={photo.id}>
      <span className={styles.tag}>Foto pendiente</span>
      <span className={styles.hint}>{photo.hint}</span>
      <span className={styles.file}>Archivo: {photo.id}.jpg</span>
    </div>
  );
}
