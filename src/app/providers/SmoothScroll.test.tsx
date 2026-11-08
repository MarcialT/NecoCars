import { fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const lenisMock = vi.hoisted(() => ({
  constructorOptions: undefined as unknown,
  scrollTo: vi.fn(),
  destroy: vi.fn(),
}));

vi.mock('lenis', () => ({
  default: class FakeLenis {
    scrollTo = lenisMock.scrollTo;
    destroy = lenisMock.destroy;

    constructor(options: unknown) {
      lenisMock.constructorOptions = options;
    }
  },
}));

import { SmoothScroll } from './SmoothScroll';

function renderPage() {
  return render(
    <>
      <SmoothScroll />
      <a href="#target">Ir al destino</a>
      <a href="#missing">Destino que no existe</a>
      <a href="https://example.com">Externo</a>
      {/* Caso límite a propósito: un enlace "#" vacío no debe interceptarse. */}
      {/* oxlint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a href="#">Solo almohadilla</a>
      <main id="target" tabIndex={-1}>
        Destino
      </main>
    </>,
  );
}

beforeEach(() => {
  vi.spyOn(history, 'pushState').mockImplementation(() => undefined);
});

afterEach(() => {
  lenisMock.scrollTo.mockClear();
  lenisMock.destroy.mockClear();
});

describe('SmoothScroll', () => {
  it('starts Lenis with its own animation loop', () => {
    renderPage();

    expect(lenisMock.constructorOptions).toMatchObject({ autoRaf: true });
  });

  it('destroys Lenis when it unmounts', () => {
    const { unmount } = renderPage();

    unmount();

    expect(lenisMock.destroy).toHaveBeenCalledOnce();
  });

  it('scrolls to the anchor target through Lenis and updates the URL', () => {
    const { getByText } = renderPage();

    fireEvent.click(getByText('Ir al destino'));

    expect(lenisMock.scrollTo).toHaveBeenCalledWith(
      document.getElementById('target'),
      expect.objectContaining({ onComplete: expect.any(Function) }),
    );
    expect(history.pushState).toHaveBeenCalledWith(null, '', '#target');
  });

  it('does not add its own header offset (Lenis already reads scroll-padding-top from the CSS)', () => {
    const { getByText } = renderPage();

    fireEvent.click(getByText('Ir al destino'));

    expect(lenisMock.scrollTo.mock.calls[0]?.[1]).not.toHaveProperty('offset');
  });

  it('moves focus to a focusable target when the scroll finishes (skip link behaviour)', () => {
    const { getByText } = renderPage();

    fireEvent.click(getByText('Ir al destino'));
    const options = lenisMock.scrollTo.mock.calls[0]?.[1] as { onComplete: () => void };
    options.onComplete();

    expect(document.activeElement).toBe(document.getElementById('target'));
  });

  it.each(['Destino que no existe', 'Externo', 'Solo almohadilla'])('leaves "%s" to the browser', (label) => {
    const { getByText } = renderPage();

    fireEvent.click(getByText(label));

    expect(lenisMock.scrollTo).not.toHaveBeenCalled();
  });

  it('does not hijack clicks with modifier keys (open in new tab, etc.)', () => {
    const { getByText } = renderPage();

    fireEvent.click(getByText('Ir al destino'), { ctrlKey: true });
    fireEvent.click(getByText('Ir al destino'), { metaKey: true });

    expect(lenisMock.scrollTo).not.toHaveBeenCalled();
  });
});
