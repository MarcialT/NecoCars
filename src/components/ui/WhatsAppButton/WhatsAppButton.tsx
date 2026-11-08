import { siteConfig } from '@/config/site.config';
import { whatsappContent } from '@/content/whatsapp.content';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

import { Button } from '../Button';
import type { ButtonSize, ButtonVariant } from '../Button';

type WhatsAppButtonProps = {
  children: string;
  /** Texto con el que se abre el chat. Por defecto, el mensaje general. */
  message?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isFullWidth?: boolean;
  className?: string;
};

/** Enlace que abre un chat de WhatsApp con el taller. Único canal de contacto de la web. */
export function WhatsAppButton({
  children,
  message = whatsappContent.defaultMessage,
  ...buttonProps
}: WhatsAppButtonProps) {
  return (
    <Button href={buildWhatsAppUrl(siteConfig.whatsapp.phoneNumber, message)} isExternal {...buttonProps}>
      {children}
    </Button>
  );
}
