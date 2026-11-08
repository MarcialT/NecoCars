import { act, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { stubIntersectionObserver } from '@/test/intersection-observer';

import { useScrollSnapIndex } from './useScrollSnapIndex';

function Probe() {
  const ref = useRef<HTMLUListElement>(null);
  const index = useScrollSnapIndex(ref);

  return (
    <ul ref={ref} data-testid="list" data-index={index}>
      <li>uno</li>
      <li>dos</li>
      <li>tres</li>
    </ul>
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useScrollSnapIndex', () => {
  it('starts at the first item and observes every item inside the scroller', () => {
    const observers = stubIntersectionObserver();

    render(<Probe />);

    expect(screen.getByTestId('list')).toHaveAttribute('data-index', '0');
    expect(observers[0]?.observe).toHaveBeenCalledTimes(3);
  });

  it('marks as active the item that is most visible', () => {
    const observers = stubIntersectionObserver();
    render(<Probe />);
    const items = screen.getAllByRole('listitem');

    act(() =>
      observers[0]?.callback([
        { target: items[0]!, intersectionRatio: 0.25 },
        { target: items[1]!, intersectionRatio: 1 },
        { target: items[2]!, intersectionRatio: 0 },
      ]),
    );

    expect(screen.getByTestId('list')).toHaveAttribute('data-index', '1');
  });

  it('follows the swipe: when the third item takes over, it becomes active', () => {
    const observers = stubIntersectionObserver();
    render(<Probe />);
    const items = screen.getAllByRole('listitem');

    act(() => observers[0]?.callback([{ target: items[1]!, intersectionRatio: 1 }]));
    act(() =>
      observers[0]?.callback([
        { target: items[1]!, intersectionRatio: 0.25 },
        { target: items[2]!, intersectionRatio: 0.75 },
      ]),
    );

    expect(screen.getByTestId('list')).toHaveAttribute('data-index', '2');
  });

  it('stays at 0 and does not fail when IntersectionObserver is not available', () => {
    vi.stubGlobal('IntersectionObserver', undefined);

    render(<Probe />);

    expect(screen.getByTestId('list')).toHaveAttribute('data-index', '0');
  });

  it('stops observing when it unmounts', () => {
    const observers = stubIntersectionObserver();
    const { unmount } = render(<Probe />);

    unmount();

    expect(observers[0]?.disconnect).toHaveBeenCalled();
  });
});
