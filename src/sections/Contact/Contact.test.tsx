import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { siteConfig } from '@/config/site.config';

import { Contact } from './Contact';

describe('Contact', () => {
  it('opens a WhatsApp chat when the phone number is clicked', () => {
    render(<Contact />);

    const link = screen.getByRole('link', { name: new RegExp(siteConfig.contact.phone) });
    const url = new URL(link.getAttribute('href') ?? '');

    expect(url.origin).toBe('https://wa.me');
    expect(url.pathname).toBe(`/${siteConfig.whatsapp.phoneNumber}`);
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('links the address to Google Maps and Instagram to the profile', () => {
    render(<Contact />);

    expect(screen.getByRole('link', { name: new RegExp(siteConfig.contact.address) })).toHaveAttribute(
      'href',
      siteConfig.contact.mapsUrl,
    );
    expect(screen.getByRole('link', { name: new RegExp(siteConfig.social.instagram.handle) })).toHaveAttribute(
      'href',
      siteConfig.social.instagram.url,
    );
  });

  it('shows each channel as one whole link with its label and value (WhatsApp, Instagram, location)', () => {
    render(<Contact />);

    expect(screen.getByRole('link', { name: /^WhatsApp 0412 273 1718/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^Instagram @necocars\.mcbo/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^Ubicación Av\. 16 con Calle 89B/ })).toBeInTheDocument();
  });

  it('keeps the decorative icons out of the accessibility tree', () => {
    const { container } = render(<Contact />);

    const icons = container.querySelectorAll('li a svg');

    expect(icons).toHaveLength(6);
    icons.forEach((icon) => expect(icon).toHaveAttribute('aria-hidden', 'true'));
  });
});
