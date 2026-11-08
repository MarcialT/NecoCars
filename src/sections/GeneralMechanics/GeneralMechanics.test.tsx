import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { siteConfig } from '@/config/site.config';
import { generalMechanicsContent } from '@/content/general-mechanics.content';

import { GeneralMechanics } from './GeneralMechanics';

describe('GeneralMechanics', () => {
  it('has a level-2 heading naming the service', () => {
    render(<GeneralMechanics />);

    expect(screen.getByRole('heading', { level: 2, name: generalMechanicsContent.title })).toBeInTheDocument();
  });

  it('has a single button: the 24-hour WhatsApp one', () => {
    render(<GeneralMechanics />);

    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getByRole('link', { name: new RegExp(generalMechanicsContent.note) })).toBeInTheDocument();
  });

  it('opens WhatsApp with the service already written in the message', () => {
    render(<GeneralMechanics />);

    const href = screen.getByRole('link').getAttribute('href') ?? '';

    expect(href).toContain(`https://wa.me/${siteConfig.whatsapp.phoneNumber}`);
    expect(decodeURIComponent(href)).toContain('Servicio: Mecánica general');
  });
});
