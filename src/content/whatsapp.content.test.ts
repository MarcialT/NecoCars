import { describe, expect, it } from 'vitest';

import { buildWhatsAppUrl } from '@/lib/whatsapp';

import { whatsappContent } from './whatsapp.content';

describe('whatsappContent.defaultMessage', () => {
  it('ends with a wrench emoji instead of a full stop', () => {
    expect(whatsappContent.defaultMessage.endsWith(' 🔧')).toBe(true);
    expect(whatsappContent.defaultMessage.endsWith('.')).toBe(false);
  });

  it('keeps the quote request text before the emoji', () => {
    expect(whatsappContent.defaultMessage).toBe('Hola, quiero cotizar un tripoide para mi carro 🔧');
  });

  it('travels intact in the WhatsApp link (the emoji is percent-encoded and decodes back)', () => {
    const url = buildWhatsAppUrl('584122731718', whatsappContent.defaultMessage);

    expect(url).toContain('%F0%9F%94%A7');
    expect(new URL(url).searchParams.get('text')).toBe(whatsappContent.defaultMessage);
  });
});
