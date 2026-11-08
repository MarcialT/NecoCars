import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
  it('renders its children as the accessible name', () => {
    render(<Button>Reservar</Button>);

    expect(screen.getByRole('button', { name: 'Reservar' })).toBeInTheDocument();
  });

  it('defaults to type="button" to avoid accidental form submits', () => {
    render(<Button>Reservar</Button>);

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Reservar</Button>);

    await userEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Reservar
      </Button>,
    );

    await userEvent.click(screen.getByRole('button'));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies variant and size classes', () => {
    render(
      <Button variant="secondary" size="lg">
        Reservar
      </Button>,
    );

    expect(screen.getByRole('button')).toHaveClass('secondary', 'lg');
  });

  it('renders a link instead of a button when href is provided', () => {
    render(<Button href="#services">Ver servicios</Button>);

    expect(screen.getByRole('link', { name: 'Ver servicios' })).toHaveAttribute('href', '#services');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
