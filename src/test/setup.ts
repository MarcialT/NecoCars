import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});

/*
 * jsdom no implementa showModal() ni close() de <dialog>. Sustituto mínimo para los tests: marca/quita el atributo
 * `open` y emite `close`. No reproduce el bloqueo del fondo ni el foco atrapado (eso se comprueba en un navegador real).
 */
function fakeShowModal(this: HTMLDialogElement) {
  this.setAttribute('open', '');
}

function fakeClose(this: HTMLDialogElement) {
  if (!this.hasAttribute('open')) return;
  this.removeAttribute('open');
  this.dispatchEvent(new Event('close'));
}

if (typeof HTMLDialogElement !== 'undefined' && typeof HTMLDialogElement.prototype.showModal !== 'function') {
  HTMLDialogElement.prototype.showModal = fakeShowModal;
  HTMLDialogElement.prototype.close = fakeClose;
}
