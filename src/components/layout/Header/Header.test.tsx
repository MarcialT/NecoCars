import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { siteConfig } from '@/config/site.config';

import { Header } from './Header';

describe('Header', () => {
  it('names the brand link for assistive technology even when only the logo is visible (phones)', () => {
    render(<Header />);

    expect(screen.getByRole('link', { name: `${siteConfig.name}: inicio` })).toHaveAttribute('href', '#hero');
  });

  it('uses a decorative logo, so the name is not announced twice', () => {
    const { container } = render(<Header />);

    expect(container.querySelector('a img')).toHaveAttribute('alt', '');
  });
});
