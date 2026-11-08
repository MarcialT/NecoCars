import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useSplashScreen } from './useSplashScreen';

const SEEN_KEY = 'necocars:splash-seen';

beforeEach(() => {
  vi.useFakeTimers();
  window.sessionStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  delete document.documentElement.dataset['splash'];
});

describe('useSplashScreen', () => {
  it('starts in the "showing" phase on a first visit and marks <html data-splash>', () => {
    const { result } = renderHook(() => useSplashScreen());

    expect(result.current).toBe('showing');
    expect(document.documentElement.dataset['splash']).toBe('active');
  });

  it('remembers the visit so it is not shown again in the same session', () => {
    renderHook(() => useSplashScreen());

    expect(window.sessionStorage.getItem(SEEN_KEY)).toBe('1');
  });

  it('is skipped when it was already seen in this session', () => {
    window.sessionStorage.setItem(SEEN_KEY, '1');

    const { result } = renderHook(() => useSplashScreen());

    expect(result.current).toBe('done');
    expect(document.documentElement.dataset['splash']).toBeUndefined();
  });

  it('is skipped when the person asked to reduce motion', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('reduce'), media: query }));

    const { result } = renderHook(() => useSplashScreen());

    expect(result.current).toBe('done');
  });

  it('stays visible for the minimum time even if everything is already loaded', async () => {
    const { result } = renderHook(() => useSplashScreen());

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1100);
    });

    expect(result.current).toBe('showing');
  });

  it('leaves after the minimum time, then finishes the exit and clears <html data-splash>', async () => {
    const { result } = renderHook(() => useSplashScreen());

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1300);
    });
    expect(result.current).toBe('leaving');
    expect(document.documentElement.dataset['splash']).toBe('active');

    await act(async () => {
      await vi.advanceTimersByTimeAsync(800);
    });
    expect(result.current).toBe('done');
    expect(document.documentElement.dataset['splash']).toBeUndefined();
  });

  it('treats blocked storage as "already seen" instead of repeating the splash on every load', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    const { result } = renderHook(() => useSplashScreen());

    expect(result.current).toBe('done');
  });
});
