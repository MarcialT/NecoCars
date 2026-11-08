import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { worksContent } from '@/content/works.content';

import { Works } from './Works';

describe('Works', () => {
  it('shows one before/after pair per work with its title', () => {
    render(<Works />);

    for (const item of worksContent.beforeAfter) {
      expect(screen.getByRole('heading', { level: 3, name: item.title })).toBeInTheDocument();
    }
    expect(screen.getAllByText(worksContent.beforeLabel)).toHaveLength(worksContent.beforeAfter.length);
    expect(screen.getAllByText(worksContent.afterLabel)).toHaveLength(worksContent.beforeAfter.length);
  });

  it('has exactly four photos (two before/after pairs), whether real or still pending', () => {
    const { container } = render(<Works />);

    expect(container.querySelectorAll('figure')).toHaveLength(4);
  });

  it('has no call-to-action button (the client asked to remove it)', () => {
    render(<Works />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
