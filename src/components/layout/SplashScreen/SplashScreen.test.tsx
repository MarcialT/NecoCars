import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SplashScreen } from './SplashScreen';

beforeEach(() => {
  vi.useFakeTimers();
  window.sessionStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
  delete document.documentElement.dataset['splash'];
});

describe('SplashScreen', () => {
  it('is purely decorative: hidden from assistive technology and without a readable logo', () => {
    const { container } = render(<SplashScreen />);

    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('img')).toHaveAttribute('alt', '');
  });

  it('does not render when it was already seen in this session', () => {
    window.sessionStorage.setItem('necocars:splash-seen', '1');

    const { container } = render(<SplashScreen />);

    expect(container).toBeEmptyDOMElement();
  });

  it('plays the exit animation and is then removed from the page', async () => {
    const { container } = render(<SplashScreen />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1300);
    });
    expect(container.firstChild).toHaveClass('leaving');

    await act(async () => {
      await vi.advanceTimersByTimeAsync(800);
    });
    expect(container).toBeEmptyDOMElement();
  });
});
