# AGENTS.md — Neco Cars Landing Page

Guía para cualquier agente de IA o persona que escriba código en este repositorio.
**Léela completa antes de crear, mover o modificar archivos.** Si una regla de este documento
entra en conflicto con lo que "parece más rápido", gana este documento.

---

## 1. Resumen del proyecto

**Neco Cars** es un **taller en Maracaibo, Zulia** especializado en **tripoides, cardanes y tren delantero**
(venta, reparación, cambio y mantenimiento). **No es una venta de coches.** Atención 24 horas por WhatsApp.
La marca completa está en [`docs/brand/`](./docs/brand/guia-de-marca.md) y manda sobre cualquier decisión de diseño o texto
(ver §7.0 y §8.0).

| Aspecto            | Valor                                                          |
| ------------------ | -------------------------------------------------------------- |
| Tipo               | Landing page de una sola página (SPA estática)                 |
| Framework          | React 19 + TypeScript 7                                        |
| Bundler            | Vite 8 (`@vitejs/plugin-react`)                                |
| Linter             | oxlint                                                         |
| Tests              | Vitest + React Testing Library + jsdom                         |
| Alias de imports   | `@/` → `src/`                                                  |
| Estilos            | CSS Modules + design tokens en variables CSS (sin librerías)   |
| Gestor de paquetes | npm (no mezclar con yarn/pnpm; solo existe `package-lock.json`) |
| Node               | ≥ 24                                                           |

### Objetivos de la landing (por orden de prioridad)

1. **Conversión**: que el visitante contacte / reserve / pida información **por WhatsApp** (único canal, ver §13).
2. **Rendimiento**: Lighthouse ≥ 95 en Performance, Accessibility, Best Practices y SEO.
3. **Accesibilidad**: WCAG 2.1 AA como mínimo.
4. **Mantenibilidad**: cualquier sección debe poder añadirse, quitarse o reordenarse tocando un solo archivo.

---

## 2. Comandos

```bash
npm install        # instalar dependencias
npm run dev        # servidor de desarrollo → http://localhost:5173
npm run build      # chequeo de tipos (tsc -b) + build de producción en dist/
npm run preview    # servir el build de producción localmente
npm run lint       # oxlint
npm run typecheck  # solo chequeo de tipos (tsc -b)
npm run test       # tests una vez (Vitest)
npm run test:watch # tests en modo watch
npm run check      # lint + typecheck + test
                   # (oxlint incluye reglas jsx-a11y, import/no-cycle y no-console)
```

**Antes de dar una tarea por terminada**, el agente DEBE ejecutar y dejar en verde:

```bash
npm run check && npm run build
```

---

## 3. Estructura de carpetas

Esta es la estructura **canónica**. No se crean carpetas de primer nivel en `src/` fuera de esta lista
sin actualizar antes este documento.

```
NecoCars/
├── AGENTS.md                     # este documento
├── index.html                    # HTML raíz: <title>, meta SEO, Open Graph, favicon
├── package.json
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── vite.config.ts
├── .env.example                  # variables de entorno documentadas (sin valores reales)
├── public/                       # archivos servidos tal cual, sin procesar por Vite
│   ├── favicon.ico               # favicon: el LOGO recortado al emblema, sobre negro opaco (16, 32 y 48 px)
│   ├── favicon-32x32.png         # el mismo favicon en PNG (pestañas)
│   ├── icon-192.png              # el mismo favicon a 192 px (Google lo usa en los resultados; debe ser múltiplo de 48)
│   ├── apple-touch-icon.png      # icono de iPhone/iPad (180 px, a sangre: iOS le pone sus esquinas redondeadas)
│   └── og-image.png              # imagen para compartir en redes (hoy: logo; ideal 1200×630)
│                                 # robots.txt y sitemap.xml NO están aquí: los genera vite.config.ts
│
└── src/
    ├── main.tsx                  # punto de entrada: monta <App /> e importa estilos globales
    │
    ├── app/                      # composición de la aplicación
    │   ├── App.tsx               # orden de las secciones de la landing
    │   └── providers/            # efectos y contextos globales
    │       ├── AppProviders.tsx  # ✔ envuelve <App /> (main.tsx)
    │       └── SmoothScroll.tsx  # ✔ scroll suave con inercia (Lenis)
    │
    ├── sections/                 # bloques grandes de la landing, uno por carpeta
    │   ├── Hero/                 # ✔ creado
    │   ├── Services/             # ✔ creado (tripoides, cardanes, tren delantero)
    │   ├── GeneralMechanics/     # ✔ creado (banda naranja a todo el ancho con CTA; sin cinta)
    │   ├── HowItWorks/           # ✔ creado
    │   ├── AboutUs/              # ✔ creado — "Nosotros" (banda a todo el ancho con 4 bloques rectos en ajedrez 2×2 naranja/negro, también en teléfono; sin cinta, sin título visible ni fotos)
    │   ├── Works/                # ✔ creado (antes/después de tripoide y cardán)
    │   ├── Reviews/              # ✔ creado (reseñas de Google; NO se muestra si no hay reseñas reales)
    │   └── Contact/              # ✔ creado (banda naranja a todo el ancho "Escríbenos por WhatsApp" con tres fichas negras pulsables: WhatsApp, Instagram y ubicación)
    │
    ├── components/
    │   ├── ui/                   # piezas atómicas reutilizables, sin lógica de negocio
    │   │   ├── Button/           # ✔ creado
    │   │   ├── Heading/          # ✔ creado
    │   │   ├── VisuallyHidden/   # ✔ creado
    │   │   ├── Tape/             # ✔ creado (cinta de taller, franjas diagonales)
    │   │   ├── Card/             # ✔ creado
    │   │   ├── SectionHeading/   # ✔ creado (h2 + descripción)
    │   │   ├── WhatsAppButton/   # ✔ creado (único CTA de contacto)
    │   │   ├── ExternalLink/     # ✔ creado (<a> externo: pestaña nueva segura + aviso a lectores de pantalla)
    │   │   ├── Icon/             # ✔ creado (instagram, whatsapp, map-pin, star, wrench, clock, box, arrow-up-right, close; SVG de trazo, decorativos)
    │   │   ├── Photo/            # ✔ creado (foto real o marcador "Foto pendiente" con el nombre de archivo)
    │   │   └── Reveal/           # ✔ creado (entrada con fundido + deslizamiento al aparecer en pantalla)
    │   └── layout/               # estructura de página
    │       ├── Container/        # ✔ creado
    │       ├── Section/          # ✔ creado
    │       ├── SkipLink/         # ✔ creado
    │       ├── Header/           # ✔ creado
    │       ├── Navbar/           # ✔ creado (menú de escritorio + botón hamburguesa)
    │       ├── MobileDrawer/     # ✔ creado (menú lateral del teléfono: <dialog> modal, se cierra con gesto)
    │       ├── Footer/           # ✔ creado
    │       └── SplashScreen/     # ✔ creado (pantalla de carga con el logo, solo en la 1ª visita de la sesión)
    │
    ├── content/                  # TODO el texto y los datos estáticos de la landing
    │   ├── ui.content.ts         # ✔ textos genéricos de interfaz (skip link, menú…)
    │   ├── whatsapp.content.ts   # ✔ textos de los mensajes que se envían por WhatsApp
    │   ├── brand.content.ts      # ✔ logo
    │   ├── navigation.content.ts # ✔
    │   ├── hero.content.ts       # ✔
    │   ├── services.content.ts   # ✔
    │   ├── general-mechanics.content.ts # ✔
    │   ├── how-it-works.content.ts # ✔
    │   ├── about-us.content.ts   # ✔ (borrador: confirmar con el cliente)
    │   ├── works.content.ts      # ✔
    │   ├── reviews.content.ts    # ✔ (vacío hasta tener reseñas reales)
    │   ├── contact.content.ts    # ✔
    │   ├── photos.content.ts     # ✔ huecos de fotos reales (ver §8.1)
    │   └── footer.content.ts     # ✔
    │
    ├── hooks/                    # hooks reutilizables
    │   ├── useInView.ts          # ✔ true cuando un elemento entró en pantalla (una sola vez)
    │   ├── useSplashScreen.ts    # ✔ fases de la pantalla de carga: showing → leaving → done
    │   ├── useScrollSnapIndex.ts # ✔ índice de la tarjeta visible en un carrusel (puntos indicadores)
    │   └── useSwipeToDismiss.ts  # ✔ cierre por gesto: arrastrar hacia la derecha (menú lateral)
    │
    ├── services/                 # comunicación con el exterior (analytics, etc.). NO hay envío de correos
    │   └── analytics.service.ts
    │
    ├── lib/                      # utilidades puras, sin React y sin efectos secundarios
    │   ├── cn.ts                 # unir classNames condicionalmente
    │   ├── whatsapp.ts           # ✔ buildWhatsAppUrl, composeWhatsAppMessage (enlaces wa.me)
    │   ├── photos.ts             # ✔ indexPhotosByName: asocia archivos de fotos con sus huecos
    │   ├── format.ts             # formateo de precios, fechas…
    │   └── validation.ts
    │
    ├── config/                   # configuración de la app
    │   └── site.config.ts        # nombre, redes sociales, teléfono, dirección y número de WhatsApp
    │
    ├── constants/                # valores fijos compartidos (ids de sección…)
    │   └── sections.ts
    │
    ├── types/                    # tipos globales compartidos por varias capas
    │   ├── content.types.ts      # ImageAsset, LinkItem y los tipos de cada sección
    │   └── vite-env.d.ts         # tipado de import.meta.env
    │
    ├── test/
    │   ├── setup.ts              # configuración global de Vitest (jest-dom, cleanup, sustituto de <dialog>: jsdom no tiene showModal)
    │   └── intersection-observer.ts # IntersectionObserver falso y controlable para los tests
    │
    ├── styles/                   # estilos globales (los únicos CSS no-módulo)
    │   ├── tokens.css            # design tokens: colores, tipografía, espaciado, sombras…
    │   ├── reset.css
    │   ├── global.css            # estilos base de html/body/tipografía
    │   └── utilities.css         # utilidades mínimas (.sr-only, .container…)
    │
    └── assets/                   # recursos que pasan por Vite (se optimizan y versionan)
        ├── images/
        │   ├── brand/            # ✔ logo (copia de docs/brand/logo)
        │   └── photos/           # fotos reales, ordenadas por carpeta de sección (ver §8.1)
        │       ├── services/     # tripoides, cardanes, tren-delantero (tarjetas de Servicios)
        │       └── works/        # tripoide-before/after, cardan-before/after (Trabajos realizados)
        └── icons/                # SVG
        # Las fuentes no van aquí: se autoalojan con los paquetes @fontsource/* (ver §10)
```

### 3.1 Estructura interna de un componente o sección

**Cada componente vive en su propia carpeta**, con este formato exacto:

```
Button/
├── Button.tsx            # el componente (obligatorio)
├── Button.module.css     # estilos (obligatorio si tiene estilos)
├── Button.types.ts       # props y tipos (obligatorio si las props tienen > 3 campos)
├── Button.test.tsx       # tests (obligatorio en componentes interactivos)
└── index.ts              # barrel: re-exporta lo público (obligatorio)
```

Las secciones pueden tener subcomponentes privados:

```
Services/
├── Services.tsx
├── Services.module.css
├── index.ts
└── components/           # subcomponentes usados SOLO por esta sección
    └── ServiceCard/
        ├── ServiceCard.tsx
        ├── ServiceCard.module.css
        └── index.ts
```

Regla: si un subcomponente pasa a usarse en **dos o más** secciones, se mueve a `components/ui/`
o `components/layout/`.

### 3.2 Qué va en cada carpeta (y qué NO)

| Carpeta              | Sí va                                                      | NO va                                         |
| -------------------- | ---------------------------------------------------------- | --------------------------------------------- |
| `app/`               | `App.tsx`, providers globales                              | UI concreta, estilos de secciones             |
| `sections/`          | Bloques de la landing que componen `ui/` y `layout/`       | Textos hardcodeados, llamadas `fetch`         |
| `components/ui/`     | Piezas genéricas reutilizables y configurables por props   | Texto de la landing, conocimiento del negocio |
| `components/layout/` | Header, Footer, Container, Section                         | Contenido de secciones                        |
| `content/`           | Textos, listas, datos estáticos tipados                    | JSX, lógica, imports de componentes           |
| `hooks/`             | Hooks `useX` reutilizables                                 | Hooks usados en un solo componente (van junto a él) |
| `services/`          | Analytics y otras integraciones externas                   | JSX, estado de React, envío de correos        |
| `lib/`               | Funciones puras y testeables                               | React, DOM, `fetch`                           |
| `config/`            | Datos de la marca, lectura de variables de entorno         | Secretos                                      |
| `constants/`         | Valores inmutables compartidos                             | Configuración que cambia por entorno          |
| `types/`             | Tipos usados por 2+ carpetas distintas                     | Props de un componente (van en su `.types.ts`) |
| `styles/`            | Tokens, reset, estilos globales                            | Estilos de componentes concretos              |
| `assets/`            | Imágenes, SVG, fuentes que importa el código               | Archivos que deben tener URL fija (→ `public/`) |

### 3.3 Dirección de las dependencias

Las importaciones solo pueden ir **hacia abajo** en esta jerarquía. Nunca hacia arriba ni en círculo.

```
app → sections → components/layout → components/ui
                         ↓
         hooks · services · content · config
                         ↓
               lib · constants · types · styles · assets
```

- `components/ui` **nunca** importa de `sections`, `content` ni `services`.
- `lib` **nunca** importa nada de React ni del resto de `src/` (salvo `types` y `constants`).
- `content` solo importa `types`, `constants` y `assets`.

---

## 4. Convenciones de nombres

| Elemento                     | Convención                    | Ejemplo                          |
| ---------------------------- | ----------------------------- | -------------------------------- |
| Carpeta de componente        | `PascalCase`                  | `CallToAction/`                  |
| Archivo de componente        | `PascalCase.tsx`              | `CallToAction.tsx`               |
| CSS Module                   | `PascalCase.module.css`       | `CallToAction.module.css`        |
| Tipos de un componente       | `PascalCase.types.ts`         | `CallToAction.types.ts`          |
| Hook                         | `useCamelCase.ts`             | `useScrollSpy.ts`                |
| Utilidad                     | `camelCase.ts`                | `format.ts`                      |
| Contenido                    | `kebab.content.ts`            | `faq.content.ts`                 |
| Servicio                     | `kebab.service.ts`            | `analytics.service.ts`           |
| Configuración                | `kebab.config.ts`             | `site.config.ts`                 |
| Carpetas genéricas           | `kebab-case` en minúscula     | `components/`, `images/photos/`   |
| Imágenes                     | `kebab-case` descriptivo      | `hero-suv-front.webp`            |
| Componentes / tipos          | `PascalCase`                  | `CarCard`, `CarCardProps`        |
| Variables / funciones        | `camelCase`                   | `formatPrice`, `isMenuOpen`      |
| Constantes globales          | `SCREAMING_SNAKE_CASE`        | `SECTION_IDS`, `MAX_TESTIMONIALS` |
| Booleanos                    | prefijo `is/has/should/can`   | `isOpen`, `hasError`             |
| Handlers                     | `handleX` dentro, `onX` en props | `handleSubmit` / `onSubmit`   |
| Clases CSS en módulos        | `camelCase`                   | `.heroTitle`, `.ctaButton`       |
| Variables CSS (tokens)       | `--kebab-case` con prefijo de categoría | `--color-primary-500`, `--space-4` |

**Idioma**: el código (nombres de variables, funciones, archivos, commits) va **en inglés**.
El contenido visible al usuario va en `content/` en **español**.

---

## 5. Reglas de TypeScript

- El proyecto compila con `strict`, `noUncheckedIndexedAccess` y `noImplicitOverride`: no se desactivan.
- **Prohibido `any`**. Si un tipo es realmente desconocido, usar `unknown` y estrechar.
- **Prohibido `// @ts-ignore`**. Si es inevitable, `// @ts-expect-error` con un comentario explicando por qué.
- Props siempre tipadas con `type` (no `interface`) y con nombre `NombreComponenteProps`.
- Usar `import type { … }` para importar solo tipos (el proyecto tiene `verbatimModuleSyntax`).
- No usar `enum` (el proyecto tiene `erasableSyntaxOnly`). En su lugar:

  ```ts
  export const SECTION_IDS = {
    hero: 'hero',
    services: 'services',
    contact: 'contact',
  } as const;

  export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];
  ```

- No usar `React.FC`. Tipar las props directamente en la firma.
- Preferir uniones de literales a `string` genérico: `variant: 'primary' | 'secondary' | 'ghost'`.
- Datos de `content/` siempre tipados con `satisfies` para no perder los literales:

  ```ts
  export const faqContent = {
    title: 'Preguntas frecuentes',
    items: [ … ],
  } satisfies FaqContent;
  ```

---

## 6. Reglas de componentes React

### 6.1 Plantilla de componente

```tsx
// src/components/ui/Button/Button.types.ts
import type { ComponentPropsWithoutRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isFullWidth?: boolean;
};
```

```tsx
// src/components/ui/Button/Button.tsx
import { cn } from '@/lib/cn';

import type { ButtonProps } from './Button.types';

import styles from './Button.module.css';

export function Button({
  variant = 'primary',
  size = 'md',
  isFullWidth = false,
  className,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        styles.button,
        styles[variant],
        styles[size],
        isFullWidth && styles.fullWidth,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
```

```ts
// src/components/ui/Button/index.ts
export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button.types';
```

### 6.2 Reglas

1. **Componentes funcionales** declarados con `function`, exportación **nombrada**. Nada de `export default`
   (excepción: archivos que una herramienta exija con default).
2. **Un componente por archivo.** Subcomponentes privados van en su propia carpeta dentro de `components/`.
3. **Máximo ~150 líneas por archivo.** Si se supera, extraer subcomponentes o hooks.
4. **Las secciones no contienen texto.** Todo texto viene de `content/`:

   ```tsx
   // ✅ Bien
   import { heroContent } from '@/content/hero.content';
   <Heading level={1}>{heroContent.title}</Heading>

   // ❌ Mal
   <h1>Tripoides, cardanes y tren delantero</h1>
   ```

5. **Componentes `ui/` agnósticos**: reciben todo por props, extienden los atributos nativos del elemento
   (`ComponentPropsWithoutRef<'button'>`) y aceptan `className`.
6. **Estado lo más local posible.** Subir estado solo cuando dos hermanos lo necesiten. Context solo para
   estado verdaderamente global (tema, consentimiento de cookies).
7. **Sin lógica en el JSX.** Cálculos y condiciones complejas se resuelven antes del `return`.
8. **Listas con `key` estable** (un `id` del dato, nunca el índice si la lista puede cambiar).
9. **Efectos (`useEffect`) solo para sincronizar con sistemas externos** (DOM, suscripciones, APIs).
   No usar efectos para derivar estado: calcularlo en el render.
10. **Composición sobre configuración**: preferir `children` a props como `title`, `subtitle`, `footer`…
    cuando el contenido sea libre.
11. **Nada de estilos en línea** (`style={{…}}`) salvo valores dinámicos calculados en tiempo de ejecución,
    y en ese caso mediante variables CSS: `style={{ '--progress': `${value}%` }}`.

### 6.3 Plantilla de sección

```tsx
// src/sections/Faq/Faq.tsx
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Accordion } from '@/components/ui/Accordion';
import { Heading } from '@/components/ui/Heading';
import { SECTION_IDS } from '@/constants/sections';
import { faqContent } from '@/content/faq.content';

import styles from './Faq.module.css';

export function Faq() {
  return (
    <Section id={SECTION_IDS.faq} aria-labelledby="faq-title">
      <Container>
        <Heading id="faq-title" level={2} className={styles.title}>
          {faqContent.title}
        </Heading>
        <Accordion items={faqContent.items} />
      </Container>
    </Section>
  );
}
```

`App.tsx` es solo la lista ordenada de secciones:

```tsx
export function App() {
  return (
    <>
      <SkipLink targetId={SECTION_IDS.main} />
      <Header />
      <main id={SECTION_IDS.main} tabIndex={-1}>
        <Hero />
        <Hero />
        <Tape />
        <Services />
        <GeneralMechanics />
        <HowItWorks />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
```

---

## 7. Estilos

### 7.1 Enfoque

- **CSS Modules** para todo componente (`Componente.module.css`).
- **Design tokens** en `src/styles/tokens.css` como variables CSS. Los módulos **solo** usan tokens,
  nunca valores sueltos de color, tamaño de fuente, espaciado, radio o sombra.
- Los estilos globales se importan **una sola vez** en `main.tsx`, en este orden:
  `reset.css` → `tokens.css` → `global.css` → `utilities.css`.

### 7.0 Marca (obligatorio al diseñar)

Fuente: `docs/brand/guia-de-marca.md`. Resumen de reglas:

- **Fondo negro** en toda la página. Texto en blanco; secundario en gris.
- **Naranja `#F57C20`**: el color de la marca. Destaca **una o dos cosas por bloque** (una palabra del título,
  el botón principal, un bloque), no todo.
- **Sobre naranja el texto va en negro, nunca en blanco** (token `--color-text-inverse`).
- **Tipografías:** Barlow Condensed ExtraBold, **en MAYÚSCULAS**, para títulos y etiquetas
  (ya aplicado a `h1–h6` en `global.css`); Barlow 400/600 para el texto, los botones y los datos.
- **Botón:** naranja, forma de pastilla (`--radius-pill`), texto negro. Sobre fondos naranja, variante `dark`.
- **Tarjetas:** fondo `carbon`, radio `--radius-card`. **Bloque naranja:** panel recto (sin radio).
- **Sin textos pequeños sobre los títulos** (eyebrows, etiquetas tipo "PASO 1" o "SERVICIOS"): el cliente no los quiere.
  Si hace falta contexto, va en el título o en la descripción. Para numerar, usar un número grande en naranja ("01").
- **Cinta de taller** (`Tape`): franjas diagonales naranja/negro **en movimiento continuo** (carrusel, solo si la persona
  no redujo el movimiento en su sistema). Se anima con `transform` sobre un pseudoelemento (compositor/GPU), **nunca con
  `background-position`** (repinta cada fotograma y va a trompicones en celulares básicos). Solo como banda entre bloques (hoy: bajo el hero y sobre el footer),
  **nunca detrás de texto** ni pegada a otra banda naranja.
- **Evitar:** degradados, brillos o resplandores, sombras decorativas, emojis y textos de relleno.
- **Favicon: es el logo** (no una versión simplificada ni una letra: el cliente lo descartó), recortado ajustado al emblema
  y sobre **negro opaco**. Sin transparencias: un hueco transparente se ve blanco en pestañas claras. Se genera desde el
  original de alta resolución (`docs/brand/logo/neco-cars-logo.png`) reduciéndolo en pasos para que no se dentelle. Si
  cambia el logo, rehacer `favicon.ico`, `favicon-32x32.png`, `icon-192.png` y `apple-touch-icon.png`.
- El logo va **siempre sobre negro**, sin deformarlo, recortarlo ni cambiarle los colores.
  El archivo actual se reconstruyó de una captura: **sustituirlo por el original del diseñador** cuando exista.

### 7.2 Tokens (estructura base)

```css
/* src/styles/tokens.css */
:root {
  /* Paleta de marca (fuente: docs/brand) */
  --negro: #000000;
  --carbon: #161616;
  --naranja: #f57c20;
  --blanco: #ffffff;
  --gris: #bdbdbd;

  /* Colores semánticos (los componentes usan ESTOS, no la paleta) */
  --color-bg: var(--negro);
  --color-surface: var(--carbon);
  --color-text: var(--blanco);
  --color-text-muted: var(--gris);
  --color-brand: var(--naranja);
  --color-text-inverse: var(--negro); /* texto sobre naranja: siempre negro */

  /* Tipografía */
  --font-family-base: 'Barlow', system-ui, sans-serif;
  --font-family-heading: 'Barlow Condensed', 'Arial Narrow', sans-serif;
  --font-size-sm: clamp(0.875rem, 0.85rem + 0.1vw, 0.9375rem);
  --font-size-md: clamp(1rem, 0.95rem + 0.2vw, 1.125rem);
  --font-size-3xl: clamp(2.25rem, 1.8rem + 2vw, 3.5rem);

  /* Espaciado (escala de 4px) */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-8: 2rem;
  --space-16: 4rem;

  /* Radios, sombras, transiciones, z-index */
  --radius-md: 0.5rem;
  --shadow-md: 0 4px 12px rgb(0 0 0 / 0.08);
  --transition-fast: 150ms ease-out;
  --z-header: 100;

  /* Layout */
  --container-max: 75rem;
}
```

### 7.3 Reglas de CSS

- **Mobile-first**: estilos base para móvil y `@media (min-width: …)` para crecer.
- Breakpoints únicos (las media queries de los CSS Modules usan siempre estos valores; las variables CSS
  no sirven dentro de `@media`): `sm 640px · md 768px · lg 1024px · xl 1280px`.
- **Hero en teléfono:** sin el logo grande (ya está en el navbar); aparece desde 640px. El título es más grande (crece con el
  ancho, `clamp(2.5rem, 12.5vw, 3.25rem)`) y "tren delantero" va en su propia línea en naranja: tres líneas equilibradas.
- **Trabajos realizados (`Works`) en teléfono:** antes y después van **siempre una al lado de otra** (dos columnas pegadas, con la línea
  naranja entre las dos) y **altas (3:4)** en el teléfono para que se aprecie la pieza; desde 640px, cuadradas. Etiquetas ANTES/DESPUÉS
  sobre cada foto. Se descartaron las fotos apiladas y el comparador deslizante: al cliente no le gustaron.
- **Tres pasos (`HowItWorks`):** siempre en **una sola fila de 3 tarjetas del MISMO alto** (el `<li>` estira a la tarjeta), con
  número, título y texto **centrados** en el teléfono (a la izquierda desde 640px). **En el teléfono no se ve el título de la sección**
  (queda solo para lectores de pantalla) y las tarjetas ocupan **todo el ancho y todo el alto de la banda** (márgenes negativos que
  anulan el relleno del contenedor y de la sección), sin franja naranja; la franja aparece desde 640px. Los tres títulos
  comparten tamaño y ocupan el mismo hueco de dos líneas (`min-height: 2.1em`, un título corto queda centrado en él): si
  no, unos parecen mayores que otros. **Sin `hyphens: auto`** (corta mal las palabras en columnas de ~90 px). Las tarjetas
  llevan `min-width: 0` para poder encogerse con la columna.
- **Botón de mecánica general en teléfono:** ocupa todo el ancho, con el texto **centrado** y equilibrado (`text-wrap: balance`).
- **Contacto en teléfono:** el título es **"Contáctanos"** (en escritorio "Escríbenos por WhatsApp"; son dos `<span>`, el oculto
  va en `display: none`) y **no hay botón "Abrir WhatsApp"**: la ficha de WhatsApp ya hace ese trabajo.
- **Mecánica general en teléfono:** sin el segundo párrafo ("Cuéntanos qué necesita tu carro…"); aparece desde 640px.
- **Footer en teléfono:** sin el bloque de marca (logo, "Neco Cars" y subtítulo) y sin "Atención 24 horas"; quedan Navegación, Contacto y el copyright. La marca
  aparece desde 640px.
- **Header en teléfono:** solo el logo (sin el nombre "Neco Cars" al lado); el nombre aparece desde 640px. El enlace
  de marca conserva `aria-label` para lectores de pantalla.
- **Escala compacta en teléfono (< 640px):** `tokens.css` redefine en un solo sitio la tipografía grande (h1 40 px, h2/h3
  32 px, texto 16 px), los espacios grandes (`--space-8` … `--space-24`), `--section-padding-block` (40 px) y
  `--header-height` (64 px). Los componentes usan siempre esos tokens, así que se compactan todos a la vez: **no poner
  tamaños fijos en `rem`/`px` para títulos o espacios grandes**; si un bloque necesita otro tamaño en teléfono, usar un
  token o una media query propia (como `min-height` de `ServiceCard` y `AboutUs`).
- **Menú de escritorio desde 1024px** (por debajo, menú hamburguesa): a 768px no caben el logo, 4 enlaces y el CTA.
- Rejillas de tarjetas: en **teléfono (< 640px) Servicios es un carrusel horizontal** con `scroll-snap` (tarjeta de 78vw
  con la siguiente asomando y puntos indicadores); 2 columnas desde 640px (si la última queda sola, se centra) y
  3 desde 960px. No dejar tarjetas huérfanas.
  - El carrusel es una `<ul role="list">` con scroll: lleva `tabIndex={0}` y `aria-label` (un contenedor con scroll
    debe poder enfocarse con teclado, WCAG 2.1.1). Los puntos son decorativos (`aria-hidden`).
  - Para dar padding a una lista con `role="list"` usar `.clase[role='list']`: el reset (`ul[role='list']`) tiene más
    especificidad que `.clase` y le quita el `padding`.
  - **Scroll nativo con `scroll-snap`** (`x mandatory`), sin JavaScript que intercepte el gesto: se probó un hook que forzaba una
    tarjeta por gesto (`usePagedCarousel`) y el carrusel se sentía trabado, así que se eliminó. Un deslizamiento fuerte puede pasar
    varias tarjetas: el cliente prefiere la fluidez.
  - Las tarjetas del carrusel no usan `Reveal` (ocultas mientras se deslizan parecerían un hueco).
- Probar siempre a **320, 360, 390, 768, 1024, 1280 y 1920px**: sin scroll horizontal, sin texto recortado,
  áreas táctiles ≥ 44px y sin violaciones de axe.
- El foco visible sobre superficies naranja usa anillo negro (`.panel :focus-visible` en `Contact`); el naranja-claro no se ve sobre naranja.
- Unidades: `rem` para tipografía y espaciado, `%`/`fr`/`min()`/`clamp()` para layout. `px` solo en bordes.
- Layout con **Flexbox y Grid**. Nada de `float` ni posicionamiento absoluto para maquetar.
- Nada de `!important` (única excepción: el bloque `prefers-reduced-motion` de `global.css`). Nada de selectores por id. Profundidad máxima de anidación: 2 niveles.
- Respetar `prefers-reduced-motion`: toda animación se desactiva o reduce bajo esta media query.
- Los estados `:hover` deben tener equivalente `:focus-visible`.

---

### 7.4 Animaciones y efectos (la web debe sentirse fluida)

Efectos actuales: entrada al hacer scroll (`Reveal`), entrada del hero al cargar, cinta de taller en movimiento,
barra de progreso de lectura en el header, hover de tarjetas (elevación, borde naranja y zoom de la foto), botones que se
levantan, subrayado animado del menú y menú lateral del teléfono (panel que se desliza desde la derecha y se cierra con un gesto).

Reglas:

- **Animaciones más rápidas en teléfono:** `--duration-reveal` 280 ms (700 ms en escritorio), `--reveal-distance` 8 px y
  `--reveal-delay-scale: 0.1` (multiplica el escalonado de `Reveal` y del hero). En el celular las entradas largas
  se sienten como que la página carga lenta.
- **Solo `opacity` y `transform`.** Nunca animar `width`, `height`, `top`, `margin`… (provocan saltos de diseño y
  jank). Comprobado: el CLS al recorrer la página es ~0,002.
- **Respetar `prefers-reduced-motion`.** Toda animación nueva debe desactivarse (`@media (prefers-reduced-motion: reduce)`)
  o declararse solo dentro de `no-preference`. Con movimiento reducido el contenido se ve siempre y sin animar.
- **El contenido nunca puede quedar oculto.** `useInView` devuelve `true` desde el inicio si no hay `IntersectionObserver`
  o si se pidió reducir el movimiento. Los elementos animados siguen en el DOM y en el árbol de accesibilidad.
- **Las animaciones de hover van dentro de `@media (hover: hover)`** (en táctil el hover se queda "pegado").
- **Tiempos y curvas con tokens:** `--duration-fast`, `--duration-normal`, `--duration-reveal`, `--easing-standard`,
  `--easing-out`, `--reveal-distance`. Nada de milisegundos sueltos.
- **Estilo de marca:** sin brillos, resplandores, degradados ni sombras decorativas. Movimientos sobrios y suaves.
- **No animar lo que está en el primer pantallazo** salvo el hero (que entra con CSS, sin retraso en el título para no
  empeorar el LCP). Lo demás usa `Reveal`; escalonar hermanos con `delay` (ej. `(index % 3) * 120`).
- **Librerías de movimiento:** la única aprobada es **Lenis** (scroll suave con inercia, `SmoothScroll.tsx`). Todo lo
  demás es CSS + el hook `useInView`. Otra (GSAP, Framer Motion…) solo con aprobación (ver §15).
- **Pantalla de carga (`SplashScreen`):** logo sobre negro, línea naranja que se llena y salida tipo cortina con la cinta.
  - Se muestra **una sola vez por sesión** (`sessionStorage`, clave `necocars:splash-seen`) y **nunca con movimiento
    reducido** ni si el almacenamiento está bloqueado. Dura 1,2 s mínimo y espera a fuentes + `load` (tope 3 s).
  - Es **decorativa**: `aria-hidden`, logo con `alt=""`. La página ya está renderizada debajo (SEO y lectores de
    pantalla no esperan por ella).
  - Mientras está activa marca `<html data-splash>`: sin scroll y la entrada del hero queda en pausa. Cualquier
    animación de entrada que deba esperar usa `:global(html[data-splash]) … { animation-play-state: paused }`.
  - La duración de salida (700 ms) está en `useSplashScreen.ts` **y** en `SplashScreen.module.css`: cambiar ambas.
  - Para probar con Playwright u otros scripts: poner `sessionStorage['necocars:splash-seen'] = '1'` antes de cargar
    (`addInitScript`), o se interpondrá 2 s en cada página nueva.
- **Lenis, reglas:**
  - Respeta "reducir movimiento" por sí solo (`respectReducedMotion`, activo por defecto) y no toca el scroll táctil.
  - Los enlaces `#ancla` los gestiona `SmoothScroll` (actualiza la URL y mueve el foco al destino si es enfocable: el
    enlace "Saltar al contenido" depende de ello). **No pasar `offset` a mano**: Lenis ya descuenta el
    `scroll-padding-top` del CSS (= alto del header); si se añade, el header se resta dos veces.
  - Si se añade un contenedor con scroll propio (modal, menú largo), marcarlo con `data-lenis-prevent`.
  - `html.lenis` desactiva el `scroll-behavior: smooth` de CSS para que no se sumen dos suavizados.
- Al probar visualmente, **recorrer la página antes** de capturar o de pasar axe: lo que está más abajo no se
  muestra hasta que entra en pantalla.

---

## 8. Contenido (`src/content/`)

### 8.0 Voz y tono de Neco Cars (obligatorio al escribir textos)

Fuente: `docs/brand/guia-de-marca.md`.

- Se habla como en el taller: **claro, directo, sin exagerar**. Frases cortas y palabras de todos los días
  (**"carro"**, "ruido al girar"), no "coche" ni "vehículo". Español de Venezuela: "les escribo", "tráelo".
- Casi todo texto termina invitando a **escribir por WhatsApp**.
- Sí: "Si tu carro hace ruido al girar, tráelo y lo revisamos."
  No: "Soluciones automotrices integrales de primer nivel."
- **Nunca inventar ni prometer** precios, tiempos, garantías, años de experiencia, cifras ni testimonios que
  no estén confirmados por el cliente. Si falta un dato, dejarlo fuera o preguntar.
- **El mensaje predeterminado de WhatsApp termina con 🔧 (llave inglesa) y no con punto** ("Hola, quiero cotizar un tripoide para mi
  carro 🔧"): lo pidió el cliente. Es la única excepción a la regla de emojis, que vale para el diseño de la página, no para ese mensaje.
- Sin emojis dentro del diseño. Preferir **fotos reales** del taller y de las piezas antes que ilustraciones o stock.
- **Horario del taller (confirmado):** lunes a sábado, 8:00 a. m. a 4:00 p. m. (`siteConfig.contact.workshopHours`).
  La atención por **WhatsApp es aparte: 24 horas**. No mezclar ambos horarios.
- **Dato pendiente del cliente** (no inventarlo): las reseñas de Google (`reviews.content.ts`; vacío = la sección no aparece).
  Solo se publican reseñas reales, con el texto y el nombre tal como están en Google.

### 8.1 Fotos reales (huecos marcados)

- Las fotos van en `src/assets/images/photos/`, **ordenadas en una carpeta por sección**. El id de cada hueco es su
  ruta sin extensión (`services/tripoides`). Para rellenarlo se copia la foto con **esa carpeta y ese nombre**
  (`jpg`, `jpeg`, `png`, `webp` o `avif`). No hace falta tocar código: `photos.content.ts` detecta el archivo y
  sustituye el marcador "Foto pendiente", que muestra la ruta exacta (`Archivo: services/tripoides.jpg`).
- Carpetas y huecos actuales:
  - `services/`: `tripoides`, `cardanes`, `tren-delantero`.
  - `works/`: `tripoide-before`, `tripoide-after`, `cardan-before`, `cardan-after`.
- **Una carpeta nueva por cada sección que lleve fotos.** El nombre dentro de la carpeta no repite la sección
  (`services/tripoides`, no `services/service-tripoides`). No dejar fotos sueltas en la raíz de `photos/`.
- **No hay fotos** en Nosotros ni de carros en el elevador (el cliente las descartó).
- **Hoy los siete huecos tienen fotos PROVISIONALES** (licencia libre, de Wikimedia Commons): ver `docs/FOTOS-PROVISIONALES.md`
  con créditos y cómo reemplazarlas. **No publicar con ellas.**
- Fotos reales, de día, con buena luz y buena resolución. Antes de publicar: optimizar (WebP, máx. ~1600 px de ancho).
- Siempre `alt` descriptivo (está en `photos.content.ts`). Las fotos de antes/después usan el mismo encuadre.

---

## 9. Accesibilidad (obligatorio, no opcional)

- HTML semántico: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<button>` para acciones,
  `<a>` para navegación. Nunca `<div onClick>`.
- **Un único `<h1>`** (en el Hero). Jerarquía de encabezados sin saltos (h1 → h2 → h3).
- Cada `<section>` lleva `aria-labelledby` apuntando a su encabezado.
- Todas las imágenes con `alt` descriptivo; las decorativas con `alt=""`.
- Contraste mínimo 4.5:1 en texto normal y 3:1 en texto grande e iconos.
- Todo es usable con teclado; el foco siempre es visible (`:focus-visible`).
- Enlace "Saltar al contenido" como primer elemento enfocable.
- Formularios: cada `<input>` con `<label>` asociada; errores anunciados con `aria-describedby`
  y `aria-invalid`.
- **Menú del teléfono (`MobileDrawer`)**: menú lateral con el `<dialog>` nativo en modo modal. "Contáctanos" (WhatsApp) es un elemento más de la
  lista, con el mismo aspecto que las secciones (no un botón). El navegador bloquea el
  fondo (inerte), atrapa el foco, cierra con `Escape` y devuelve el foco al botón. El botón hamburguesa lleva
  `aria-haspopup="dialog"`, `aria-expanded` y `aria-controls`. Se cierra con: botón X, tocar fuera del panel, Escape, elegir
  un enlace o **deslizar el panel hacia la derecha** (`useSwipeToDismiss`: distancia > 80 px o velocidad > 0,5 px/ms; el
  panel necesita `touch-action: pan-y`). Funciona con el **dedo, el ratón (botón izquierdo) y el trackpad** (deslizamiento
  horizontal de dos dedos, en cualquier sentido; cierra una sola vez aunque haya inercia). Los gestos hay que probarlos
  con los tres: en una ventana estrecha de escritorio no hay táctil y solo se prueba con ratón/trackpad. Mientras está abierto, `<html data-drawer>` bloquea el scroll de la página y
  el `<dialog>` lleva `data-lenis-prevent`. Si se ensancha la ventana a escritorio, se cierra solo. Duración de salida
  (220 ms) en `MobileDrawer.tsx` **y** en su CSS: cambiar ambas.
  El botón tiene una **etiqueta fija** ("Menú"): el estado lo comunica `aria-expanded`, no el texto.
- Todo enlace que abre pestaña nueva usa `ExternalLink` (o `WhatsAppButton`); el texto de estado
  `(se abre en una pestaña nueva)` va en `VisuallyHidden`, nunca con la clase `sr-only` a mano.
- Las listas con `list-style: none` llevan `role="list"` (Safari/VoiceOver pierde la semántica si no); por eso la
  regla `jsx-a11y/no-redundant-roles` está desactivada en `.oxlintrc.json`.
- Áreas táctiles de al menos 44×44px.

---

## 10. Rendimiento

- Imágenes en **WebP/AVIF**, con `width` y `height` explícitos para evitar CLS.
- `loading="lazy"` y `decoding="async"` en todas las imágenes **excepto** la principal del Hero,
  que lleva `fetchpriority="high"`.
- Usar `srcSet`/`sizes` para imágenes grandes. El componente `ui/Image` encapsula estas reglas.
- Fuentes **autoalojadas** con `@fontsource/barlow` y `@fontsource/barlow-condensed` (subconjunto `latin`,
  solo los pesos usados: 400/600 y 700/800), importadas en `main.tsx`. Prohibido enlazar Google Fonts u otros
  CDN: evita peticiones externas y problemas de privacidad. Máximo 2 familias, `font-display: swap`.
- Secciones pesadas por debajo del pliegue (mapas, vídeos, carruseles) se cargan con `React.lazy` + `Suspense`.
- **No añadir dependencias** para cosas que se resuelven con pocas líneas (ver §15).
- Objetivos: LCP < 2.5s, CLS < 0.1, INP < 200ms. JS inicial < 150 KB gzip.

---

## 11. SEO

- **NAP (nombre, dirección, teléfono) idéntico en toda la web, Google e Instagram.** El nombre para SEO y datos
  estructurados es `siteConfig.fullName` (**"Neco Cars mcbo"**); el nombre corto del logo es `siteConfig.name`.
  Nota: la ficha de Google aparece hoy como "Neco Cars Tripoides": si el cliente quiere que coincida al 100 %,
  debe renombrar la ficha o cambiar `fullName`.
- **El título de la pestaña (`<title>`) es "Neco Cars | Tripoides en Maracaibo"** (lo pidió el cliente; el mismo texto va
  en `og:title` y `twitter:title`; `og:site_name` es solo "Neco Cars"). Nombre primero y la frase clave después.
- Frases clave en títulos y textos, de forma natural: "tripoides en Maracaibo", "reparación de cardanes en Maracaibo".

- `index.html` contiene: `<html lang="es">`, `<title>`, `<meta name="description">`,
  `<link rel="canonical">`, Open Graph (`og:title`, `og:description`, `og:image`, `og:url`),
  Twitter Card y `theme-color`.
- Datos estructurados JSON-LD de tipo `AutoRepair` (taller, no `AutoDealer`) en `index.html`, con teléfono,
  dirección (Maracaibo, Zulia) e Instagram en `sameAs`.
- `robots.txt` y `sitemap.xml` los **genera `vite.config.ts`** en cada build. No crearlos a mano en `public/`.
- **El dominio público tiene una sola fuente: `VITE_SITE_URL`** (por defecto `https://necocars.com`).
  En `index.html` se escribe `%SITE_URL%` (canonical, Open Graph, JSON-LD) y el build lo sustituye.
  Nunca escribir el dominio a mano. Para cambiarlo: poner `VITE_SITE_URL` en `.env.local` o en el hosting.
- Los valores de marca (nombre, URL, teléfono, redes) salen de `config/site.config.ts`; si se duplican
  en `index.html`, mantenerlos sincronizados.

---

## 12. Testing

- **Vitest** + **React Testing Library** + `@testing-library/user-event` + `@testing-library/jest-dom` + `jsdom`.
- Configuración en `vite.config.ts` (bloque `test`) y `src/test/setup.ts`.
- Los CSS Modules se resuelven sin hash en los tests (`classNameStrategy: 'non-scoped'`), así que
  se puede comprobar `toHaveClass('primary')`.
- Importar `describe`, `it`, `expect`, `vi` explícitamente desde `vitest` (no hay globals).
- Estructura de cada test: preparar → actuar → comprobar, separados por una línea en blanco.
- Tests junto al archivo que prueban (`Button.test.tsx` al lado de `Button.tsx`).
- Prioridad de cobertura: `lib/` (100%), `services/`, componentes `ui/` interactivos
  (Accordion, Navbar móvil, formulario de contacto que abre WhatsApp).
- Buscar elementos por rol y nombre accesible (`getByRole('button', { name: … })`),
  no por clases ni `data-testid` salvo último recurso.

---

## 13. Contacto: solo WhatsApp (sin correos)

**Esta landing no envía correos ni tiene backend.** Todo el contacto lleva al WhatsApp del cliente
mediante enlaces `https://wa.me/<número>?text=<mensaje>`.

### Reglas

- **Prohibido** añadir servicios de correo (EmailJS, Resend, SMTP, Formspree, `mailto:` como CTA principal…)
  ni endpoints propios para formularios.
- El número vive **solo** en `siteConfig.whatsapp.phoneNumber` (`src/config/site.config.ts`), en formato
  internacional, solo dígitos y sin `+` (ej. `34600000000`). Nunca escribirlo a mano en un componente.
- Los textos de los mensajes viven en `src/content/whatsapp.content.ts`, no en los componentes.
- Los enlaces se construyen **siempre** con `buildWhatsAppUrl()` y los mensajes con
  `composeWhatsAppMessage()` de `src/lib/whatsapp.ts`. No concatenar URLs ni usar `encodeURIComponent` a mano en los componentes
  (la librería codifica con `%20`, no con `+`).
- Los CTA son enlaces `<a>` (no `<button>` con `window.open`), con `target="_blank"` y
  `rel="noopener noreferrer"`, y avisan al lector de pantalla de que abren una pestaña nueva
  (`uiContent.externalLink`).

### Formulario de contacto

Si una sección tiene formulario, **no envía datos a ningún servidor**: valida en cliente, compone el mensaje
con los campos y abre WhatsApp.

```tsx
// Añadir `contactFormGreeting` a whatsapp.content.ts cuando exista el formulario.
const message = composeWhatsAppMessage(whatsappContent.contactFormGreeting, [
  { label: 'Nombre', value: name },
  { label: 'Mensaje', value: text },
]);

window.location.href = buildWhatsAppUrl(siteConfig.whatsapp.phoneNumber, message);
```

- Pedir el mínimo de campos posible (nombre + qué necesita); cada campo extra reduce la conversión.
- Los datos solo existen en el navegador: no se guardan ni se registran (ni `console.log`, ni analytics).
- Botón de WhatsApp flotante (opcional, aún no existe): reutilizar `WhatsAppButton`, con su texto en `whatsapp.content.ts`.
- Las tarjetas de servicio (`ServiceCard`) no llevan botón: el cliente prefiere que el CTA esté solo en los bloques principales.

### Medición (opcional)

Si hay analytics, registrar el **clic** en el CTA (evento en `services/analytics.service.ts`), nunca el
contenido del mensaje.

---

## 14. Variables de entorno

- Solo las variables con prefijo `VITE_` llegan al navegador. **Nunca** poner secretos en el frontend.
- Toda variable nueva se documenta en `.env.example`.
- Hoy el código de `src/` no lee ninguna variable (`VITE_SITE_URL` solo la usa `vite.config.ts` al compilar).
  Si en el futuro hace falta, se crea `src/config/env.ts` como único punto de acceso a `import.meta.env`
  (que valide y tipe los valores); el resto del código nunca lee `import.meta.env` directamente.
- `.env`, `.env.local` y similares nunca se suben al repositorio.

---

## 15. Dependencias

Antes de instalar un paquete, el agente debe justificar que:

1. No se puede resolver razonablemente con la plataforma (CSS moderno, APIs del navegador) o con < 30 líneas propias.
2. Está mantenido activamente y tiene un tamaño razonable.
3. Se fija la versión exacta en `package.json` cuando sea una dependencia crítica.

Paquetes **no permitidos** sin aprobación explícita: librerías de UI completas (MUI, Chakra, Ant),
jQuery, Moment.js, Lodash completo, librerías de animación pesadas para efectos que hace CSS.

---

## 16. Imports

- Orden de imports (separados por una línea en blanco):
  1. Librerías externas (`react`, …)
  2. Módulos internos de otras carpetas de `src/`
  3. Imports relativos de la propia carpeta
  4. Tipos (`import type`)
  5. Estilos (`.module.css`) al final
- Importar siempre desde el `index.ts` de la carpeta del componente, nunca del archivo interno:
  `from '@/components/ui/Button'` ✅ — `from '@/components/ui/Button/Button'` ❌
- **Alias `@/` → `src/`** (configurado en `vite.config.ts` y `tsconfig.app.json`). Todo import entre
  carpetas distintas usa `@/`. Los imports relativos (`./`) solo para archivos de la misma carpeta.
  Nunca `../`.
- No crear barrels gigantes a nivel de carpeta (`components/index.ts`): dificultan el tree-shaking.

---

## 17. Calidad de código

- **Funciones pequeñas y con una sola responsabilidad.** Nombres que expliquen el *qué*.
- **Early returns** en lugar de `if` anidados.
- Nada de números ni strings mágicos: extraer a `constants/` o a la configuración.
- Nada de código comentado ni `console.log` en el código entregado.
- Comentarios solo para explicar el *por qué*, nunca el *qué*.
- `const` por defecto; `let` solo si se reasigna; nunca `var`.
- Inmutabilidad: no mutar props, estado ni datos de `content/`.
- Manejo de errores explícito en `services/` (cuando existan): devolver resultados tipados en lugar de lanzar
  sin control, con un tipo `Result<T>` definido en `types/result.types.ts` solo cuando se necesite:

  ```ts
  export type Result<T> = { ok: true; data: T } | { ok: false; error: string };
  ```

---

## 18. Git

- Ramas: `feature/<descripcion-corta>`, `fix/<descripcion-corta>`, `chore/<descripcion-corta>`.
- Commits con **Conventional Commits** en inglés:
  `feat(hero): add primary call to action`, `fix(navbar): close menu on escape`,
  `style(tokens): adjust orange contrast`, `refactor(services): extract ServiceCard`, `chore: update deps`.
- Un commit = un cambio lógico. No mezclar refactors con features.
- Nunca subir `dist/`, `node_modules/` ni archivos `.env`.

---

## 19. Flujo de trabajo para agentes

Al recibir una tarea:

1. **Leer** este documento y los archivos relacionados antes de escribir código.
2. **Reutilizar** antes de crear: revisar `components/ui/`, `hooks/` y `lib/` por si ya existe algo.
3. **Ubicar** cada archivo nuevo según §3; si no encaja en ninguna carpeta, preguntar en lugar de inventar una.
4. **Respetar** la estructura de carpeta por componente (§3.1) y los nombres (§4).
5. **Textos** siempre en `content/`, **estilos** siempre con tokens, **tipos** siempre explícitos.
6. **Verificar** con `npm run check && npm run build` antes de terminar.
7. **Informar** de qué archivos se crearon o modificaron y de cualquier decisión que se desvíe de este documento.

### Checklist para añadir una sección nueva

- [ ] Carpeta `src/sections/NuevaSeccion/` con `.tsx`, `.module.css`, `index.ts`.
- [ ] Contenido en `src/content/nueva-seccion.content.ts` y su tipo en `types/content.types.ts`.
- [ ] Id añadido a `SECTION_IDS` en `constants/sections.ts`.
- [ ] Enlace en `content/navigation.content.ts` si debe aparecer en el menú.
- [ ] Sección añadida en el orden correcto dentro de `app/App.tsx`.
- [ ] `<section>` con `aria-labelledby` y jerarquía de encabezados correcta.
- [ ] Revisada en móvil (360px), tablet (768px) y escritorio (1280px+).
- [ ] Tests de la sección si tiene interacción.
- [ ] `npm run check && npm run build` en verde.

### Lo que un agente NUNCA debe hacer

- Crear carpetas de primer nivel nuevas en `src/` sin actualizar este documento.
- Escribir texto visible dentro de componentes.
- Usar colores, tamaños o espaciados sin token.
- Añadir dependencias sin justificarlo.
- Usar `any`, `@ts-ignore`, `export default` o `React.FC`.
- Dejar `console.log`, código comentado o archivos sin usar.
- Usar imports con `../` (usar `@/`).
- Dar una tarea por terminada sin pasar `npm run check` y `npm run build`.

---

## 20. Mantenimiento de este documento

Este archivo es la **fuente de verdad** del proyecto. Cualquier cambio de convención se refleja aquí
**en el mismo commit** que introduce el cambio en el código.
