import { act, render, renderHook, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { stubIntersectionObserver } from '@/test/intersection-observer';

import { useInView } from './useInView';

function Probe() {
  const { ref, isInView } = useInView<HTMLDivElement>();

  return (
    <div ref={ref} data-testid="probe" data-in-view={String(isInView)}>
      probe
    </div>
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useInView', () => {
  it('starts as "not in view" and observes the element', () => {
    const observers = stubIntersectionObserver();

    render(<Probe />);

    expect(screen.getByTestId('probe')).toHaveAttribute('data-in-view', 'false');
    expect(observers).toHaveLength(1);
    expect(observers[0]?.observe).toHaveBeenCalledWith(screen.getByTestId('probe'));
  });

  it('flips to "in view" once and stops observing', () => {
    const observers = stubIntersectionObserver();
    render(<Probe />);

    act(() => observers[0]?.callback([{ isIntersecting: true }]));

    expect(screen.getByTestId('probe')).toHaveAttribute('data-in-view', 'true');
    expect(observers[0]?.disconnect).toHaveBeenCalled();
  });

  it('ignores entries that are not intersecting', () => {
    const observers = stubIntersectionObserver();
    render(<Probe />);

    act(() => observers[0]?.callback([{ isIntersecting: false }]));

    expect(screen.getByTestId('probe')).toHaveAttribute('data-in-view', 'false');
  });

  it('never hides content when IntersectionObserver is not available', () => {
    vi.stubGlobal('IntersectionObserver', undefined);

    const { result } = renderHook(() => useInView<HTMLDivElement>());

    expect(result.current.isInView).toBe(true);
  });

  it('never hides content when the person asked to reduce motion', () => {
    stubIntersectionObserver();
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('reduce'), media: query }));

    const { result } = renderHook(() => useInView<HTMLDivElement>());

    expect(result.current.isInView).toBe(true);
  });
});
