import { describe, expect, it } from 'vitest';

import { buildWhatsAppUrl, composeWhatsAppMessage, normalizePhoneNumber } from './whatsapp';

describe('normalizePhoneNumber', () => {
  it('strips everything that is not a digit', () => {
    expect(normalizePhoneNumber('+34 600-000 000')).toBe('34600000000');
  });
});

describe('buildWhatsAppUrl', () => {
  it('builds a wa.me link without text when there is no message', () => {
    expect(buildWhatsAppUrl('+34 600 000 000')).toBe('https://wa.me/34600000000');
  });

  it('ignores a blank message', () => {
    expect(buildWhatsAppUrl('34600000000', '   ')).toBe('https://wa.me/34600000000');
  });

  it('encodes spaces as %20 and line breaks as %0A, never as "+"', () => {
    const url = buildWhatsAppUrl('34600000000', 'Hola mundo\nSegunda línea');

    expect(url).toBe('https://wa.me/34600000000?text=Hola%20mundo%0ASegunda%20l%C3%ADnea');
  });

  it('encodes the message in the text parameter', () => {
    const url = new URL(buildWhatsAppUrl('34600000000', 'Hola, ¿tenéis el SUV & el sedán?'));

    expect(url.origin + url.pathname).toBe('https://wa.me/34600000000');
    expect(url.searchParams.get('text')).toBe('Hola, ¿tenéis el SUV & el sedán?');
  });
});

describe('composeWhatsAppMessage', () => {
  it('puts the greeting first and one field per line', () => {
    const message = composeWhatsAppMessage('Hola, quiero información.', [
      { label: 'Nombre', value: 'Ana' },
      { label: 'Modelo', value: 'SUV Compacto' },
    ]);

    expect(message).toBe('Hola, quiero información.\nNombre: Ana\nModelo: SUV Compacto');
  });

  it('skips empty fields and trims values', () => {
    const message = composeWhatsAppMessage('Hola', [
      { label: 'Nombre', value: '  Ana  ' },
      { label: 'Fechas', value: '   ' },
    ]);

    expect(message).toBe('Hola\nNombre: Ana');
  });
});
