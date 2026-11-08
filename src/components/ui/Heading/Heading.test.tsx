import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Heading } from './Heading';

describe('Heading', () => {
  it('renders the semantic level passed in', () => {
    render(<Heading level={2}>Nuestra flota</Heading>);

    expect(screen.getByRole('heading', { level: 2, name: 'Nuestra flota' })).toBeInTheDocument();
  });

  it('uses a default visual size based on the level', () => {
    render(<Heading level={1}>Título</Heading>);

    expect(screen.getByRole('heading')).toHaveClass('size-4xl');
  });

  it('allows overriding the visual size without changing the level', () => {
    render(
      <Heading level={1} size="xl">
        Título
      </Heading>,
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('size-xl');
  });
});
