import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { navigationContent } from '@/content/navigation.content';
import { uiContent } from '@/content/ui.content';

import { Navbar } from './Navbar';

function getDrawer(container: HTMLElement) {
  const dialog = container.querySelector('dialog');
  if (!dialog) throw new Error('drawer not found');

  return dialog;
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  delete document.documentElement.dataset['drawer'];
});

describe('Navbar', () => {
  it('renders the desktop menu with a link for every navigation item', () => {
    const { container } = render(<Navbar />);
    const desktopNav = container.querySelector('nav') as HTMLElement;

    for (const link of navigationContent.links) {
      expect(within(desktopNav).getByRole('link', { name: link.label })).toHaveAttribute('href', link.href);
    }
  });

  it('starts with the side menu closed and the toggle collapsed', () => {
    const { container } = render(<Navbar />);

    expect(screen.getByRole('button', { name: uiContent.menu })).toHaveAttribute('aria-expanded', 'false');
    expect(getDrawer(container)).not.toHaveAttribute('open');
  });

  it('opens the side menu when the hamburger is pressed', () => {
    const { container } = render(<Navbar />);

    fireEvent.click(screen.getByRole('button', { name: uiContent.menu }));

    expect(screen.getByRole('button', { name: uiContent.menu })).toHaveAttribute('aria-expanded', 'true');
    expect(getDrawer(container)).toHaveAttribute('open');
  });

  it('points the toggle at the side menu it controls', () => {
    const { container } = render(<Navbar />);

    const toggle = screen.getByRole('button', { name: uiContent.menu });

    expect(toggle).toHaveAttribute('aria-controls', getDrawer(container).id);
    expect(toggle).toHaveAttribute('aria-haspopup', 'dialog');
  });

  it('closes the side menu with its close button and collapses the toggle', () => {
    const { container } = render(<Navbar />);
    fireEvent.click(screen.getByRole('button', { name: uiContent.menu }));

    fireEvent.click(screen.getByRole('button', { name: uiContent.closeMenu }));
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByRole('button', { name: uiContent.menu })).toHaveAttribute('aria-expanded', 'false');
    expect(getDrawer(container)).not.toHaveAttribute('open');
  });

  it('closes the side menu with Escape', () => {
    const { container } = render(<Navbar />);
    fireEvent.click(screen.getByRole('button', { name: uiContent.menu }));

    act(() => {
      getDrawer(container).dispatchEvent(new Event('cancel', { cancelable: true }));
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(getDrawer(container)).not.toHaveAttribute('open');
  });

  it('closes the side menu when the window grows to the desktop layout', () => {
    let listener: ((event: MediaQueryListEvent) => void) | undefined;
    vi.stubGlobal('matchMedia', () => ({
      matches: false,
      addEventListener: (_type: string, callback: (event: MediaQueryListEvent) => void) => {
        listener = callback;
      },
      removeEventListener: vi.fn(),
    }));
    const { container } = render(<Navbar />);
    fireEvent.click(screen.getByRole('button', { name: uiContent.menu }));

    act(() => {
      listener?.({ matches: true } as MediaQueryListEvent);
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(getDrawer(container)).not.toHaveAttribute('open');
  });

  it('opens WhatsApp in a new tab from the call to action', () => {
    const { container } = render(<Navbar />);
    const desktopNav = container.querySelector('nav') as HTMLElement;

    const cta = within(desktopNav).getByRole('link', { name: new RegExp(navigationContent.ctaLabel) });

    expect(cta).toHaveAttribute('href', expect.stringContaining('https://wa.me/'));
    expect(cta).toHaveAttribute('target', '_blank');
    expect(cta).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
