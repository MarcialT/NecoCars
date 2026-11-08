import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { ServiceItem } from '@/types/content.types';

import { ServiceCard } from './ServiceCard';

const service: ServiceItem = {
  id: 'tripoides',
  name: 'Tripoides',
  description: 'Venta, reparación y cambio de tripoides.',
  photo: { id: 'services/tripoides', alt: 'Tripoide real', hint: 'Primer plano de un tripoide.' },
};

describe('ServiceCard', () => {
  it('shows the service name as a level-3 heading and its description', () => {
    render(<ServiceCard service={service} />);

    expect(screen.getByRole('heading', { level: 3, name: 'Tripoides' })).toBeInTheDocument();
    expect(screen.getByText(service.description)).toBeInTheDocument();
  });

  it('has no button or link (the client asked to remove it)', () => {
    render(<ServiceCard service={service} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('shows the pending-photo marker until the real photo exists', () => {
    render(<ServiceCard service={service} />);

    expect(screen.getByText('Archivo: services/tripoides.jpg')).toBeInTheDocument();
  });

  it('shows the real photo with its alt text when it exists', () => {
    render(<ServiceCard service={{ ...service, photo: { ...service.photo, src: '/tripoide.jpg' } }} />);

    expect(screen.getByRole('img', { name: 'Tripoide real' })).toHaveAttribute('src', '/tripoide.jpg');
  });
});
