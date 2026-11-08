import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { reviewsContent } from '@/content/reviews.content';

import { Reviews } from './Reviews';

describe('Reviews', () => {
  it('renders nothing until there are real Google reviews', () => {
    const { container } = render(<Reviews />);

    expect(reviewsContent.reviews).toHaveLength(0);
    expect(container).toBeEmptyDOMElement();
  });
});
