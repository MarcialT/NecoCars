import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Icon } from './Icon';

describe('Icon', () => {
  it('is hidden from assistive technology', () => {
    const { container } = render(<Icon name="instagram" />);

    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('draws every icon in the set', () => {
    for (const name of ['instagram', 'whatsapp', 'map-pin', 'star', 'wrench', 'clock', 'box', 'arrow-up-right', 'close'] as const) {
      const { container, unmount } = render(<Icon name={name} />);

      expect(container.querySelector('svg')?.children.length).toBeGreaterThan(0);
      unmount();
    }
  });

  it('applies the requested size in rem', () => {
    const { container } = render(<Icon name="map-pin" size={2} />);

    expect(container.querySelector('svg')).toHaveAttribute('width', '2rem');
  });
});
