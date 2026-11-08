import { Tape } from '@/components/ui/Tape';
import { brandContent } from '@/content/brand.content';
import { useSplashScreen } from '@/hooks/useSplashScreen';
import { cn } from '@/lib/cn';

import styles from './SplashScreen.module.css';

/**
 * Pantalla de carga con el logo. Es puramente decorativa (`aria-hidden`): la página ya está renderizada debajo,
 * así que el contenido y los lectores de pantalla no esperan por ella.
 */
export function SplashScreen() {
  const phase = useSplashScreen();
  const { logo } = brandContent;

  if (phase === 'done') return null;

  return (
    <div className={cn(styles.splash, phase === 'leaving' && styles.leaving)} aria-hidden="true">
      <div className={styles.content}>
        <img className={styles.logo} src={logo.src} alt="" width={logo.width} height={logo.height} decoding="async" />
        <span className={styles.line} />
      </div>
      <div className={styles.tape}>
        <Tape />
      </div>
    </div>
  );
}
