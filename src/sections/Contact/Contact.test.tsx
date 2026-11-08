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
});
