export type IconName = 'instagram' | 'whatsapp' | 'map-pin' | 'star' | 'wrench' | 'clock' | 'box';

export type IconProps = {
  name: IconName;
  /** Tamaño en rem. Por defecto 1.5. */
  size?: number;
  className?: string;
};
