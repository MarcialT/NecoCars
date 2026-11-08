import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { PhotoContent } from '@/types/content.types';

import { Photo } from './Photo';

const pendingPhoto: PhotoContent = {
  id: 'hero',
  alt: 'Taller Neco Cars',
  hint: 'Foto horizontal del taller.',
};

describe('Photo', () => {
  it('renders the real image with its alt text when the file exists', () => {
    render(<Photo photo={{ ...pendingPhoto, src: '/hero.jpg' }} />);

    expect(screen.getByRole('img', { name: 'Taller Neco Cars' })).toHaveAttribute('src', '/hero.jpg');
  });

  it('lazy-loads images by default', () => {
    render(<Photo photo={{ ...pendingPhoto, src: '/hero.jpg' }} />);

    expect(screen.getByRole('img')).toHaveAttribute('loading', 'lazy');
  });

  it('loads the priority photo eagerly with high fetch priority', () => {
    render(<Photo photo={{ ...pendingPhoto, src: '/hero.jpg' }} priority />);

    const image = screen.getByRole('img');

    expect(image).toHaveAttribute('loading', 'eager');
    expect(image).toHaveAttribute('fetchpriority', 'high');
  });

  it('shows a marker with the file name when the photo is still pending', () => {
    render(<Photo photo={pendingPhoto} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('Foto horizontal del taller.')).toBeInTheDocument();
    expect(screen.getByText('Archivo: hero.jpg')).toBeInTheDocument();
  });
});
