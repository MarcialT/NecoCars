import { describe, expect, it } from 'vitest';

import { indexPhotos } from './photos';

describe('indexPhotos', () => {
  it('uses the path inside the photos folder, without extension, as the id', () => {
    const index = indexPhotos({
      '/src/assets/images/photos/services/tripoides.jpg': '/assets/tripoides-abc.jpg',
      '/src/assets/images/photos/works/cardan-after.webp': '/assets/cardan-abc.webp',
    });

    expect(index).toEqual({
      'services/tripoides': '/assets/tripoides-abc.jpg',
      'works/cardan-after': '/assets/cardan-abc.webp',
    });
  });

  it('keeps the same file name in different folders apart', () => {
    const index = indexPhotos({
      '/src/assets/images/photos/services/a.jpg': '/one',
      '/src/assets/images/photos/works/a.jpg': '/two',
    });

    expect(index).toEqual({ 'services/a': '/one', 'works/a': '/two' });
  });

  it('is case-insensitive on the path', () => {
    expect(indexPhotos({ '/x/photos/Services/Tripoides.JPG': '/x' })).toEqual({ 'services/tripoides': '/x' });
  });

  it('accepts a photo placed directly in the photos folder', () => {
    expect(indexPhotos({ '/x/photos/hero.jpg': '/x' })).toEqual({ hero: '/x' });
  });

  it('returns an empty index when there are no photos', () => {
    expect(indexPhotos({})).toEqual({});
  });
});
