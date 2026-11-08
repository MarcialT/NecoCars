import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { navigationContent } from '@/content/navigation.content';
import { uiContent } from '@/content/ui.content';

import { MobileDrawer } from './MobileDrawer';

function getDialog(container: HTMLElement) {
  const dialog = container.querySelector('dialog');
  if (!dialog) throw new Error('dialog not found');

  return dialog;
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  delete document.documentElement.dataset['drawer'];
});

describe('MobileDrawer', () => {
  it('is closed until it is asked to open', () => {
    const { container } = render(<MobileDrawer id="drawer" isOpen={false} onClose={vi.fn()} />);

    expect(getDialog(container)).not.toHaveAttribute('open');
  });

  it('opens as a modal dialog named "Menú" and locks the page scroll', () => {
    const { container } = render(<MobileDrawer id="drawer" isOpen onClose={vi.fn()} />);
    const dialog = getDialog(container);

    expect(dialog).toHaveAttribute('open');
    expect(dialog).toHaveAttribute('aria-label', uiContent.menu);
    expect(document.documentElement.dataset['drawer']).toBe('open');
  });

  it('shows every navigation link and the WhatsApp call to action', () => {
    render(<MobileDrawer id="drawer" isOpen onClose={vi.fn()} />);

    for (const link of navigationContent.links) {
      expect(screen.getByRole('link', { name: link.label })).toHaveAttribute('href', link.href);
    }
    expect(screen.getByRole('link', { name: new RegExp(navigationContent.ctaLabel) })).toHaveAttribute(
      'href',
      expect.stringContaining('https://wa.me/'),
    );
  });

  it('closes with the close button', () => {
    const onClose = vi.fn();
    render(<MobileDrawer id="drawer" isOpen onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: uiContent.closeMenu }));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('closes when a link is chosen', () => {
    const onClose = vi.fn();
    render(<MobileDrawer id="drawer" isOpen onClose={onClose} />);

    fireEvent.click(screen.getByRole('link', { name: navigationContent.links[0]!.label }));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('closes with Escape using its own animation (the browser default close is prevented)', () => {
    const onClose = vi.fn();
    const { container } = render(<MobileDrawer id="drawer" isOpen onClose={onClose} />);
    const cancel = new Event('cancel', { cancelable: true });

    act(() => {
      getDialog(container).dispatchEvent(cancel);
    });

    expect(cancel.defaultPrevented).toBe(true);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('closes when the dark area outside the panel is tapped, but not when the panel is', () => {
    const onClose = vi.fn();
    const { container } = render(<MobileDrawer id="drawer" isOpen onClose={onClose} />);

    fireEvent.click(screen.getByRole('link', { name: new RegExp(navigationContent.ctaLabel) }));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(getDialog(container));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('closes with a swipe to the right on the panel', () => {
    const onClose = vi.fn();
    const { container } = render(<MobileDrawer id="drawer" isOpen onClose={onClose} />);
    const panel = container.querySelector('dialog > div') as HTMLElement;

    fireEvent.pointerDown(panel, { pointerType: 'touch', clientX: 0, clientY: 0 });
    fireEvent.pointerMove(panel, { pointerType: 'touch', clientX: 150, clientY: 4 });
    fireEvent.pointerUp(panel, { pointerType: 'touch', clientX: 150, clientY: 4 });

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('plays the exit animation, then really closes the dialog and unlocks the scroll', () => {
    const { container, rerender } = render(<MobileDrawer id="drawer" isOpen onClose={vi.fn()} />);
    const dialog = getDialog(container);

    rerender(<MobileDrawer id="drawer" isOpen={false} onClose={vi.fn()} />);
    expect(dialog).toHaveAttribute('data-state', 'closing');
    expect(dialog).toHaveAttribute('open');

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(dialog).not.toHaveAttribute('open');
    expect(document.documentElement.dataset['drawer']).toBeUndefined();
  });

  it('unlocks the scroll if it is removed while open', () => {
    const { unmount } = render(<MobileDrawer id="drawer" isOpen onClose={vi.fn()} />);

    unmount();

    expect(document.documentElement.dataset['drawer']).toBeUndefined();
  });
});
