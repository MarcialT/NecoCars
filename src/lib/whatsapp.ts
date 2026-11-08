const WHATSAPP_BASE_URL = 'https://wa.me';

/** Deja solo los dígitos: wa.me exige el número en formato internacional sin "+", espacios ni guiones. */
export function normalizePhoneNumber(phoneNumber: string): string {
  return phoneNumber.replace(/\D/g, '');
}

/** Construye el enlace que abre un chat de WhatsApp con el mensaje ya escrito. */
export function buildWhatsAppUrl(phoneNumber: string, message?: string): string {
  const baseUrl = `${WHATSAPP_BASE_URL}/${normalizePhoneNumber(phoneNumber)}`;
  const trimmedMessage = message?.trim();

  if (!trimmedMessage) return baseUrl;

  // Se codifica con encodeURIComponent (espacios como %20, saltos de línea como %0A): es lo que documenta WhatsApp.
  return `${baseUrl}?text=${encodeURIComponent(trimmedMessage)}`;
}

export type MessageField = {
  label: string;
  value: string;
};

/**
 * Compone el texto del mensaje a partir de un saludo y de los campos de un formulario.
 * Los campos vacíos se omiten.
 */
export function composeWhatsAppMessage(greeting: string, fields: MessageField[] = []): string {
  const lines = fields
    .filter((field) => field.value.trim() !== '')
    .map((field) => `${field.label}: ${field.value.trim()}`);

  return [greeting.trim(), ...lines].filter(Boolean).join('\n');
}
