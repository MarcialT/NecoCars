import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { whyUsContent } from '@/content/why-us.content';

import { WhyUs } from './WhyUs';

describe('WhyUs', () => {
  it('keeps a level-2 heading and one level-3 heading per reason', () => {
    render(<WhyUs />);

    expect(screen.getByRole('heading', { level: 2, name: whyUsContent.title })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(whyUsContent.reasons.length);
  });

  it('has no call-to-action button (the client asked to remove it)', () => {
    render(<WhyUs />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('has no photo: neither a real image nor a pending-photo marker', () => {
    const { container } = render(<WhyUs />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.querySelector('[data-photo-slot]')).not.toBeInTheDocument();
  });

  it('does not show the title or subtitle on screen (the heading is screen-reader only)', () => {
    render(<WhyUs />);

    expect(screen.getByRole('heading', { level: 2, name: whyUsContent.title })).toHaveClass('sr-only');
  });
});
