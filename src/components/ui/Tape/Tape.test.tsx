import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Tape } from './Tape';

describe('Tape', () => {
  it('is decorative: hidden from assistive technology', () => {
    const { container } = render(<Tape />);

    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });
});
