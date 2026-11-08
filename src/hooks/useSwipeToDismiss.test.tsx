import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useSwipeToDismiss } from './useSwipeToDismiss';

type ProbeProps = { onDismiss: () => void };

function Probe({ onDismiss }: ProbeProps) {
  const { ref, reset } = useSwipeToDismiss<HTMLDivElement>({ onDismiss });

  return (
    <div>
      <div ref={ref} data-testid="panel">
        panel
      </div>
      <button type="button" onClick={reset}>
        reset
      </button>
    </div>
  );
}

function swipe(target: HTMLElement, { from = 0, to, y = 0 }: { from?: number; to: number; y?: number }) {
  fireEvent.pointerDown(target, { pointerType: 'touch', clientX: from, clientY: 0 });
  fireEvent.pointerMove(target, { pointerType: 'touch', clientX: to, clientY: y });
  fireEvent.pointerUp(target, { pointerType: 'touch', clientX: to, clientY: y });
}

afterEach(() => {
  vi.useRealTimers();
});

describe('useSwipeToDismiss', () => {
  it('dismisses when the finger drags far enough to the right', () => {
    const onDismiss = vi.fn();
    render(<Probe onDismiss={onDismiss} />);

    swipe(screen.getByTestId('panel'), { to: 140 });

    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('follows the finger while dragging and marks the element as swiping', () => {
    render(<Probe onDismiss={vi.fn()} />);
    const panel = screen.getByTestId('panel');

    fireEvent.pointerDown(panel, { pointerType: 'touch', clientX: 0, clientY: 0 });
    fireEvent.pointerMove(panel, { pointerType: 'touch', clientX: 60, clientY: 2 });

    expect(panel.style.getPropertyValue('--swipe-x')).toBe('60px');
    expect(panel).toHaveAttribute('data-swiping', 'true');
  });

  it('springs back and does not dismiss when the drag is too short and slow', () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<Probe onDismiss={onDismiss} />);
    const panel = screen.getByTestId('panel');

    fireEvent.pointerDown(panel, { pointerType: 'touch', clientX: 0, clientY: 0 });
    fireEvent.pointerMove(panel, { pointerType: 'touch', clientX: 40, clientY: 0 });
    vi.advanceTimersByTime(5000);
    fireEvent.pointerUp(panel, { pointerType: 'touch', clientX: 40, clientY: 0 });

    expect(onDismiss).not.toHaveBeenCalled();
    expect(panel.style.getPropertyValue('--swipe-x')).toBe('');
    expect(panel).not.toHaveAttribute('data-swiping');
  });

  it('dismisses with a short but fast flick', () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<Probe onDismiss={onDismiss} />);
    const panel = screen.getByTestId('panel');

    fireEvent.pointerDown(panel, { pointerType: 'touch', clientX: 0, clientY: 0 });
    vi.advanceTimersByTime(40);
    fireEvent.pointerMove(panel, { pointerType: 'touch', clientX: 50, clientY: 0 });
    fireEvent.pointerUp(panel, { pointerType: 'touch', clientX: 50, clientY: 0 });

    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('ignores vertical gestures, so the panel can still scroll', () => {
    const onDismiss = vi.fn();
    render(<Probe onDismiss={onDismiss} />);

    swipe(screen.getByTestId('panel'), { to: 30, y: 200 });

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('ignores a swipe to the left (the drawer only closes toward the right)', () => {
    const onDismiss = vi.fn();
    render(<Probe onDismiss={onDismiss} />);

    swipe(screen.getByTestId('panel'), { from: 200, to: 20 });

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('also works with the mouse (left button), so it can be tried in a narrow desktop window', () => {
    const onDismiss = vi.fn();
    render(<Probe onDismiss={onDismiss} />);
    const panel = screen.getByTestId('panel');

    fireEvent.pointerDown(panel, { pointerType: 'mouse', button: 0, clientX: 0, clientY: 0 });
    fireEvent.pointerMove(panel, { pointerType: 'mouse', clientX: 200, clientY: 0 });
    fireEvent.pointerUp(panel, { pointerType: 'mouse', clientX: 200, clientY: 0 });

    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('ignores the other mouse buttons', () => {
    const onDismiss = vi.fn();
    render(<Probe onDismiss={onDismiss} />);
    const panel = screen.getByTestId('panel');

    fireEvent.pointerDown(panel, { pointerType: 'mouse', button: 2, clientX: 0, clientY: 0 });
    fireEvent.pointerMove(panel, { pointerType: 'mouse', clientX: 200, clientY: 0 });
    fireEvent.pointerUp(panel, { pointerType: 'mouse', clientX: 200, clientY: 0 });

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('dismisses with a horizontal trackpad swipe, whichever direction the system reports', () => {
    for (const deltaX of [-30, 30]) {
      const onDismiss = vi.fn();
      const { unmount } = render(<Probe onDismiss={onDismiss} />);
      const panel = screen.getByTestId('panel');

      fireEvent.wheel(panel, { deltaX, deltaY: 1 });
      fireEvent.wheel(panel, { deltaX, deltaY: 1 });
      fireEvent.wheel(panel, { deltaX, deltaY: 1 });

      expect(onDismiss).toHaveBeenCalledOnce();
      unmount();
    }
  });

  it('dismisses only once per trackpad gesture, even if the system keeps sending inertia', () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<Probe onDismiss={onDismiss} />);
    const panel = screen.getByTestId('panel');

    for (let i = 0; i < 40; i++) {
      fireEvent.wheel(panel, { deltaX: -20, deltaY: 0 });
      vi.advanceTimersByTime(16);
    }

    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('accepts a new trackpad gesture after a pause', () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<Probe onDismiss={onDismiss} />);
    const panel = screen.getByTestId('panel');

    fireEvent.wheel(panel, { deltaX: -100, deltaY: 0 });
    vi.advanceTimersByTime(400);
    fireEvent.wheel(panel, { deltaX: -100, deltaY: 0 });

    expect(onDismiss).toHaveBeenCalledTimes(2);
  });

  it('lets vertical scrolling through (the panel can still scroll)', () => {
    const onDismiss = vi.fn();
    render(<Probe onDismiss={onDismiss} />);
    const panel = screen.getByTestId('panel');

    const wasNotPrevented = fireEvent.wheel(panel, { deltaX: 5, deltaY: 120 });

    expect(wasNotPrevented).toBe(true);
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('ignores a tiny horizontal wheel movement', () => {
    const onDismiss = vi.fn();
    render(<Probe onDismiss={onDismiss} />);

    fireEvent.wheel(screen.getByTestId('panel'), { deltaX: -10, deltaY: 0 });

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('does not dismiss when the gesture is cancelled by the browser', () => {
    const onDismiss = vi.fn();
    render(<Probe onDismiss={onDismiss} />);
    const panel = screen.getByTestId('panel');

    fireEvent.pointerDown(panel, { pointerType: 'touch', clientX: 0, clientY: 0 });
    fireEvent.pointerMove(panel, { pointerType: 'touch', clientX: 200, clientY: 0 });
    fireEvent.pointerCancel(panel, { pointerType: 'touch', clientX: 200, clientY: 0 });

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('reset() puts the element back where it was', () => {
    render(<Probe onDismiss={vi.fn()} />);
    const panel = screen.getByTestId('panel');
    fireEvent.pointerDown(panel, { pointerType: 'touch', clientX: 0, clientY: 0 });
    fireEvent.pointerMove(panel, { pointerType: 'touch', clientX: 90, clientY: 0 });

    fireEvent.click(screen.getByRole('button', { name: 'reset' }));

    expect(panel.style.getPropertyValue('--swipe-x')).toBe('');
    expect(panel).not.toHaveAttribute('data-swiping');
  });
});
