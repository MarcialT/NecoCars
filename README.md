# Neco Cars — Landing page

Landing page de Neco Cars (taller de tripoides, cardanes y tren delantero en Maracaibo) construida con React 19, TypeScript y Vite.
La marca está en [docs/brand/](./docs/brand/guia-de-marca.md).

## Empezar

```bash
npm install
cp .env.example .env.local   # opcional: VITE_SITE_URL (dominio público)
npm run dev                  # http://localhost:5173
```

## Scripts

| Comando              | Descripción                          |
| -------------------- | ------------------------------------ |
| `npm run dev`        | Servidor de desarrollo               |
| `npm run build`      | Chequeo de tipos + build a `dist/`   |
| `npm run preview`    | Sirve el build de producción         |
| `npm run lint`       | oxlint                               |
| `npm run typecheck`  | Chequeo de tipos                     |
| `npm run test`       | Tests (Vitest)                       |
| `npm run check`      | lint + typecheck + test              |

## Convenciones

Estructura de carpetas, nombres, estilos y reglas de código: ver [AGENTS.md](./AGENTS.md).
