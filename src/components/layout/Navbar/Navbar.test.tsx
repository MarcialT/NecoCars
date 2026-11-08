import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { navigationContent } from '@/content/navigation.content';
import { uiContent } from '@/content/ui.content';

import { Navbar } from './Navbar';

describe('Navbar', () => {
  it('renders a link for every navigation item', () => {
    render(<Navbar />);

    for (const link of navigationContent.links) {
      expect(screen.getByRole('link', { name: link.label })).toHaveAttribute('href', link.href);
    }
  });

  it('starts with the mobile menu collapsed', () => {
    render(<Navbar />);

    expect(screen.getByRole('button', { name: uiContent.menu })).toHaveAttribute('aria-expanded', 'false');
  });

  it('expands the menu when the toggle is clicked', async () => {
    render(<Navbar />);

    await userEvent.click(screen.getByRole('button', { name: uiContent.menu }));

    expect(screen.getByRole('button', { name: uiContent.menu })).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes the menu with Escape and returns focus to the toggle', async () => {
    render(<Navbar />);
    await userEvent.click(screen.getByRole('button', { name: uiContent.menu }));

    await userEvent.keyboard('{Escape}');

    const toggle = screen.getByRole('button', { name: uiContent.menu });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();
  });

  it('opens WhatsApp in a new tab from the call to action', () => {
    render(<Navbar />);

    const cta = screen.getByRole('link', { name: new RegExp(navigationContent.ctaLabel) });

    expect(cta).toHaveAttribute('href', expect.stringContaining('https://wa.me/'));
    expect(cta).toHaveAttribute('target', '_blank');
    expect(cta).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
