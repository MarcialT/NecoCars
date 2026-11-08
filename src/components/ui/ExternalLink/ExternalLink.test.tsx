import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ExternalLink } from './ExternalLink';

describe('ExternalLink', () => {
  it('opens in a new tab with a safe rel', () => {
    render(<ExternalLink href="https://example.com">Sitio</ExternalLink>);

    const link = screen.getByRole('link');

    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('tells screen readers that it opens a new tab', () => {
    render(<ExternalLink href="https://example.com">Sitio</ExternalLink>);

    expect(screen.getByRole('link')).toHaveAccessibleName('Sitio (se abre en una pestaña nueva)');
  });
});
