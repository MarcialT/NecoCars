import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { stubIntersectionObserver } from '@/test/intersection-observer';

import { Reveal } from './Reveal';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Reveal', () => {
  it('always renders its children (they stay in the DOM and the accessibility tree)', () => {
    stubIntersectionObserver();

    render(
      <Reveal>
        <p>Contenido</p>
      </Reveal>,
    );

    expect(screen.getByText('Contenido')).toBeInTheDocument();
  });

  it('starts hidden and becomes visible when it enters the viewport', () => {
    const observers = stubIntersectionObserver();
    const { container } = render(<Reveal>Contenido</Reveal>);

    expect(container.firstChild).not.toHaveClass('visible');

    act(() => observers[0]?.callback([{ isIntersecting: true }]));

    expect(container.firstChild).toHaveClass('visible');
  });

  it('is visible straight away when IntersectionObserver is not available', () => {
    vi.stubGlobal('IntersectionObserver', undefined);

    const { container } = render(<Reveal>Contenido</Reveal>);

    expect(container.firstChild).toHaveClass('visible');
  });

  it('passes the delay to the CSS as a custom property', () => {
    stubIntersectionObserver();
    const { container } = render(<Reveal delay={240}>Contenido</Reveal>);

    expect((container.firstChild as HTMLElement).style.getPropertyValue('--reveal-delay')).toBe('240ms');
  });

  it('applies the requested direction and keeps custom class names', () => {
    stubIntersectionObserver();
    const { container } = render(
      <Reveal direction="left" className="extra">
        Contenido
      </Reveal>,
    );

    expect(container.firstChild).toHaveClass('left', 'extra');
  });
});
