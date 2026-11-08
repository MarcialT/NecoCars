import { vi } from 'vitest';

type ObserverCallback = (entries: Pick<IntersectionObserverEntry, 'isIntersecting'>[]) => void;

type FakeObserver = {
  callback: ObserverCallback;
  observe: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
};

/** Sustituye IntersectionObserver por uno controlable desde el test. Devuelve los observadores creados. */
export function stubIntersectionObserver(): FakeObserver[] {
  const observers: FakeObserver[] = [];

  class FakeIntersectionObserver {
    observe = vi.fn();
    disconnect = vi.fn();
    unobserve = vi.fn();
    takeRecords = vi.fn(() => []);

    callback: ObserverCallback;

    constructor(callback: ObserverCallback) {
      this.callback = callback;
      observers.push(this);
    }
  }

  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);

  return observers;
}
