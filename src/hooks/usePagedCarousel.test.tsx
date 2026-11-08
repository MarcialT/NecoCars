import { fireEvent, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { usePagedCarousel } from './usePagedCarousel';

/** Medidas simuladas (jsdom no calcula diseño): 3 tarjetas de 300 px en un contenedor de 390 px con 20 px de relleno. */
const ITEM_POSITIONS = [20, 320, 620] as const;
const SCROLL_WIDTH = 960;
const CLIENT_WIDTH = 390;
/** Posición de scroll de cada tarjeta = su posición menos el relleno (el último queda limitado por el máximo). */
const SNAP = [0, 300, 570] as const;

function Probe() {
  const ref = useRef<HTMLUListElement>(null);
  usePagedCarousel(ref);

  return (
    <ul ref={ref} data-testid="carousel">
      <li>uno</li>
      <li>dos</li>
      <li>tres</li>
    </ul>
  );
}

function setup({ scrollLeft = 0, scrollable = true }: { scrollLeft?: number; scrollable?: boolean } = {}) {
  render(<Probe />);
  const carousel = screen.getByTestId('carousel');
  const scrollTo = vi.fn();

  Object.defineProperty(carousel, 'scrollWidth', {
    configurable: true,
    value: scrollable ? SCROLL_WIDTH : CLIENT_WIDTH,
  });
  Object.defineProperty(carousel, 'clientWidth', { configurable: true, value: CLIENT_WIDTH });
  carousel.style.paddingLeft = '20px';
  carousel.scrollTo = scrollTo as unknown as typeof carousel.scrollTo;
  carousel.scrollLeft = scrollLeft;
  screen.getAllByRole('listitem').forEach((item, index) => {
    Object.defineProperty(item, 'offsetLeft', { configurable: true, value: ITEM_POSITIONS[index] ?? 0 });
  });

  return { carousel, scrollTo };
}

function swipe(
  target: HTMLElement,
  { distance, duration = 50, y = 0 }: { distance: number; duration?: number; y?: number },
) {
  fireEvent.pointerDown(target, { pointerType: 'touch', clientX: 200, clientY: 0 });
  fireEvent.pointerMove(target, { pointerType: 'touch', clientX: 200 + distance, clientY: y });
  vi.advanceTimersByTime(duration);
  fireEvent.pointerUp(target, { pointerType: 'touch', clientX: 200 + distance, clientY: y });
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('usePagedCarousel', () => {
  it('moves exactly one card forward with a normal swipe to the left', () => {
    const { carousel, scrollTo } = setup();

    swipe(carousel, { distance: -120 });

    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ left: SNAP[1] }));
  });

  it('moves ONE card even with a huge, very fast swipe (the bug: it used to skip several)', () => {
    const { carousel, scrollTo } = setup();

    swipe(carousel, { distance: -900, duration: 20 });

    expect(scrollTo).toHaveBeenCalledOnce();
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ left: SNAP[1] }));
  });

  it('moves one card back with a swipe to the right', () => {
    const { carousel, scrollTo } = setup({ scrollLeft: SNAP[2] });

    swipe(carousel, { distance: 900, duration: 20 });

    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ left: SNAP[1] }));
  });

  it('does not go past the last card', () => {
    const { carousel, scrollTo } = setup({ scrollLeft: SNAP[2] });

    swipe(carousel, { distance: -900, duration: 20 });

    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ left: SNAP[2] }));
  });

  it('does not go before the first card', () => {
    const { carousel, scrollTo } = setup({ scrollLeft: 0 });

    swipe(carousel, { distance: 900, duration: 20 });

    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ left: SNAP[0] }));
  });

  it('returns to the current card when the drag is short and slow', () => {
    const { carousel, scrollTo } = setup({ scrollLeft: SNAP[1] });

    swipe(carousel, { distance: -20, duration: 3000 });

    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ left: SNAP[1] }));
  });

  it('turns a short but fast flick into one step', () => {
    const { carousel, scrollTo } = setup();

    swipe(carousel, { distance: -30, duration: 40 });

    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ left: SNAP[1] }));
  });

  it('follows the finger while dragging', () => {
    const { carousel } = setup({ scrollLeft: SNAP[1] });

    fireEvent.pointerDown(carousel, { pointerType: 'touch', clientX: 200, clientY: 0 });
    fireEvent.pointerMove(carousel, { pointerType: 'touch', clientX: 140, clientY: 2 });

    expect(carousel.scrollLeft).toBe(SNAP[1] + 60);
    expect(carousel).toHaveAttribute('data-paging', 'true');
  });

  it('releases the snap lock once the movement has settled', () => {
    const { carousel } = setup();

    swipe(carousel, { distance: -120 });
    expect(carousel).toHaveAttribute('data-paging', 'true');

    vi.advanceTimersByTime(700);

    expect(carousel).not.toHaveAttribute('data-paging');
  });

  it('ignores vertical gestures so the page can still scroll', () => {
    const { carousel, scrollTo } = setup();

    swipe(carousel, { distance: -30, y: 200 });

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('also pages with a mouse drag (left button), for narrow desktop windows', () => {
    const { carousel, scrollTo } = setup();

    fireEvent.pointerDown(carousel, { pointerType: 'mouse', button: 0, clientX: 200, clientY: 0 });
    fireEvent.pointerMove(carousel, { pointerType: 'mouse', clientX: -300, clientY: 0 });
    vi.advanceTimersByTime(20);
    fireEvent.pointerUp(carousel, { pointerType: 'mouse', clientX: -300, clientY: 0 });

    expect(scrollTo).toHaveBeenCalledOnce();
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ left: SNAP[1] }));
  });

  it('ignores the other mouse buttons', () => {
    const { carousel, scrollTo } = setup();

    fireEvent.pointerDown(carousel, { pointerType: 'mouse', button: 2, clientX: 200, clientY: 0 });
    fireEvent.pointerMove(carousel, { pointerType: 'mouse', clientX: -300, clientY: 0 });
    fireEvent.pointerUp(carousel, { pointerType: 'mouse', clientX: -300, clientY: 0 });

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('moves ONE card per trackpad swipe, however long the inertia lasts', () => {
    const { carousel, scrollTo } = setup();

    for (let i = 0; i < 50; i++) {
      fireEvent.wheel(carousel, { deltaX: 40, deltaY: 0 });
      vi.advanceTimersByTime(16);
    }

    expect(scrollTo).toHaveBeenCalledOnce();
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ left: SNAP[1] }));
  });

  it('goes back one card with a trackpad swipe in the other direction', () => {
    const { carousel, scrollTo } = setup({ scrollLeft: SNAP[2] });

    fireEvent.wheel(carousel, { deltaX: -80, deltaY: 0 });

    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ left: SNAP[1] }));
  });

  it('accepts a new trackpad swipe after a pause', () => {
    const { carousel, scrollTo } = setup();

    fireEvent.wheel(carousel, { deltaX: 80, deltaY: 0 });
    vi.advanceTimersByTime(400);
    fireEvent.wheel(carousel, { deltaX: 80, deltaY: 0 });

    expect(scrollTo).toHaveBeenCalledTimes(2);
  });

  it('lets vertical wheel scrolling through so the page keeps scrolling', () => {
    const { carousel, scrollTo } = setup();

    const wasNotPrevented = fireEvent.wheel(carousel, { deltaX: 3, deltaY: 120 });

    expect(wasNotPrevented).toBe(true);
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('ignores a tiny horizontal wheel movement', () => {
    const { carousel, scrollTo } = setup();

    fireEvent.wheel(carousel, { deltaX: 10, deltaY: 0 });

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('prevents the native image drag that would cut a mouse swipe short', () => {
    const { carousel } = setup();

    const wasNotPrevented = fireEvent.dragStart(carousel);

    expect(wasNotPrevented).toBe(false);
  });

  it('does nothing when the list is not scrollable (tablet and desktop use a grid)', () => {
    const { carousel, scrollTo } = setup({ scrollable: false });

    swipe(carousel, { distance: -300 });
    fireEvent.wheel(carousel, { deltaX: 200, deltaY: 0 });

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('goes to the next and previous card with the arrow keys', () => {
    const { carousel, scrollTo } = setup({ scrollLeft: SNAP[1] });

    fireEvent.keyDown(carousel, { key: 'ArrowRight' });
    expect(scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ left: SNAP[2] }));

    fireEvent.keyDown(carousel, { key: 'ArrowLeft' });
    expect(scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ left: SNAP[0] }));
  });

  it('leaves other keys alone', () => {
    const { carousel, scrollTo } = setup();

    fireEvent.keyDown(carousel, { key: 'ArrowDown' });

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('moves without animation when the person asked to reduce motion', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('reduce'), media: query }));
    const { carousel, scrollTo } = setup();

    swipe(carousel, { distance: -120 });

    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'auto' }));
    vi.unstubAllGlobals();
  });
});
