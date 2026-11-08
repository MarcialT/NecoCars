import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { siteConfig } from '@/config/site.config';
import { whatsappContent } from '@/content/whatsapp.content';

import { WhatsAppButton } from './WhatsAppButton';

describe('WhatsAppButton', () => {
  it('links to the configured WhatsApp number with the default message', () => {
    render(<WhatsAppButton>Escríbenos</WhatsAppButton>);

    const url = new URL(screen.getByRole('link').getAttribute('href') ?? '');

    expect(url.pathname).toBe(`/${siteConfig.whatsapp.phoneNumber}`);
    expect(url.searchParams.get('text')).toBe(whatsappContent.defaultMessage);
  });

  it('uses a custom message when provided', () => {
    render(<WhatsAppButton message="Hola, consulta">Escríbenos</WhatsAppButton>);

    const url = new URL(screen.getByRole('link').getAttribute('href') ?? '');

    expect(url.searchParams.get('text')).toBe('Hola, consulta');
  });

  it('opens in a new tab safely and warns screen readers', () => {
    render(<WhatsAppButton>Escríbenos</WhatsAppButton>);

    const link = screen.getByRole('link');

    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveAccessibleName('Escríbenos (se abre en una pestaña nueva)');
  });
});
