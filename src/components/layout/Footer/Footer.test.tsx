import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { siteConfig } from '@/config/site.config';

import { Footer } from './Footer';

describe('Footer', () => {
  it('links the address to Google Maps', () => {
    render(<Footer />);

    const link = screen.getByRole('link', { name: new RegExp(siteConfig.contact.address) });

    expect(link).toHaveAttribute('href', siteConfig.contact.mapsUrl);
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('links Instagram to the brand profile', () => {
    render(<Footer />);

    const link = screen.getByRole('link', { name: new RegExp(siteConfig.social.instagram.handle) });

    expect(link).toHaveAttribute('href', siteConfig.social.instagram.url);
  });

  it('gives each link a complete accessible name', () => {
    render(<Footer />);

    expect(screen.getByRole('link', { name: /^Instagram: @necocars\.mcbo/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^WhatsApp: / })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^Dirección: / })).toBeInTheDocument();
  });

  it('shows one decorative icon next to each link', () => {
    const { container } = render(<Footer />);

    const icons = container.querySelectorAll('li a svg[aria-hidden="true"]');

    expect(icons).toHaveLength(3);
  });
});
