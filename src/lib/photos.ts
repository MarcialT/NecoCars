/**
 * Resuelve las fotos reales del taller por su ruta dentro de src/assets/images/photos/.
 * La clave es la ruta sin extensión (`services/tripoides`, `works/cardan-after`): así la carpeta forma parte del
 * id del hueco (ver content/photos.content.ts) y se puede reemplazar una foto cambiando solo el archivo.
 */
const PHOTOS_FOLDER = '/photos/';

export function indexPhotos(files: Record<string, string>): Record<string, string> {
  const byId: Record<string, string> = {};

  for (const [path, url] of Object.entries(files)) {
    const relativePath = path.includes(PHOTOS_FOLDER)
      ? path.slice(path.indexOf(PHOTOS_FOLDER) + PHOTOS_FOLDER.length)
      : path;
    const id = relativePath.replace(/\.[^./]+$/, '').toLowerCase();

    if (id) byId[id] = url;
  }

  return byId;
}
