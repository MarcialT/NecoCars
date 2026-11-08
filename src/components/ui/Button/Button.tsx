import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { uiContent } from '@/content/ui.content';
import { cn } from '@/lib/cn';

import type { ButtonProps, ButtonSize, ButtonVariant } from './Button.types';

import styles from './Button.module.css';

type ClassNameOptions = {
  variant: ButtonVariant;
  size: ButtonSize;
  isFullWidth: boolean;
  className: string | undefined;
};

function getClassName({ variant, size, isFullWidth, className }: ClassNameOptions): string {
  return cn(styles.button, styles[variant], styles[size], isFullWidth && styles.fullWidth, className);
}

export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const {
      variant = 'primary',
      size = 'md',
      isFullWidth = false,
      isExternal = false,
      className,
      children,
      ...rest
    } = props;
    const externalProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};

    return (
      <a className={getClassName({ variant, size, isFullWidth, className })} {...externalProps} {...rest}>
        {children}
        {isExternal ? (
          <>
            {' '}
            <VisuallyHidden>{uiContent.externalLink}</VisuallyHidden>
          </>
        ) : null}
      </a>
    );
  }

  const {
    variant = 'primary',
    size = 'md',
    isFullWidth = false,
    type = 'button',
    className,
    children,
    ...rest
  } = props;

  return (
    <button type={type} className={getClassName({ variant, size, isFullWidth, className })} {...rest}>
      {children}
    </button>
  );
}
