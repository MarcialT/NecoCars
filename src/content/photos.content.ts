import { indexPhotos } from '@/lib/photos';
import type { PhotoContent } from '@/types/content.types';

/*
 * Huecos para las fotos reales (nada de stock), ordenados en carpetas por sección:
 *   src/assets/images/photos/services/  → fotos de las tarjetas de Servicios
 *   src/assets/images/photos/works/     → fotos de antes/después de Trabajos realizados
 * El id de cada hueco es su ruta sin extensión (`services/tripoides`). Para rellenarlo basta con copiar la foto con
 * ese nombre y esa carpeta (jpg, jpeg, png, webp o avif). Mientras no exista el archivo, la web muestra un marcador
 * con la ruta exacta y la indicación (`hint`). Fotos provisionales: docs/FOTOS-PROVISIONALES.md
 */
const photoFiles = import.meta.glob<string>('@/assets/images/photos/**/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
  query: '?url',
});

const photoIndex = indexPhotos(photoFiles);

function photo(id: string, alt: string, hint: string): PhotoContent {
  const src = photoIndex[id];

  return src ? { id, alt, hint, src } : { id, alt, hint };
}

export const photosContent = {
  serviceTripoides: photo(
    'services/tripoides',
    'Primer plano de un tripoide',
    'Primer plano de un tripoide.',
  ),
  serviceCardanes: photo(
    'services/cardanes',
    'Cardán con sus juntas universales',
    'Primer plano de un cardán.',
  ),
  serviceTrenDelantero: photo(
    'services/tren-delantero',
    'Conjunto de la rueda delantera de un carro: freno, semieje con su guardapolvo y brazo de suspensión',
    'Piezas del tren delantero y guardapolvos.',
  ),
  worksTripoideBefore: photo(
    'works/tripoide-before',
    'Tripoide con la bota desgastada y agrietada',
    'Pieza desgastada (ANTES), mismo encuadre que la nueva.',
  ),
  worksTripoideAfter: photo(
    'works/tripoide-after',
    'Tripoide nuevo con su bota',
    'Pieza nueva (DESPUÉS), mismo encuadre que la desgastada.',
  ),
  worksCardanBefore: photo(
    'works/cardan-before',
    'Semieje desgastado y sucio de grasa',
    'Cardán desgastado (ANTES), mismo encuadre que el nuevo.',
  ),
  worksCardanAfter: photo(
    'works/cardan-after',
    'Ejes de transmisión nuevos',
    'Cardán nuevo (DESPUÉS), mismo encuadre que el desgastado.',
  ),
} satisfies Record<string, PhotoContent>;
