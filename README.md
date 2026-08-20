# salixweb — Landing page de Salix

Proyecto Astro para la landing page de **salixweb.com**.

La puerta para cualquier chat/IA es [`AGENTS.md`](AGENTS.md) (dónde está el repo, cómo se despliega, handoff de la tanda 2026-08-19).

## Cambiar el logo

El dibujo NO se edita acá. La fuente de la marca Salix es el repo de Flux:

```
Flux ·  src/componentes/marca/isotipo-salix.svg   ← reemplazás este archivo
Flux ·  npm run marca                             ← escribe public/logo-salix.svg acá
acá  ·  npm run publicar                          ← versión + imagen de compartir + build + servidor
```

`npm run publicar` hace todo lo que hay que acordarse:

- calcula la huella del logo y la cuelga de la URL (`?v=`). ⚠️ Sin eso el CDN de
  Hostinger sigue sirviendo el logo viejo **hasta 7 días** — `max-age=604800`—, así
  que cambiás el archivo, subís el sitio, y no cambia nada. Pasó el 2026-08-19.
- regenera `public/og-image.png`, la vista previa al compartir (con el mismo isotipo).
  Tiene que ser PNG: ninguna plataforma renderiza SVG en la tarjeta de un link.
- construye, **respalda lo que está publicado** en `~/respaldos-salixweb/` y sincroniza.

⚠️ **Este sitio no tiene deploy automático.** Vive en Hostinger y se sube por
SSH/rsync: un push al repositorio no cambia nada de lo que ve la gente.

El destino sale de `SALIXWEB_SSH` (default: el alias `hostinger-herreelec` del
`~/.ssh/config`) y `SALIXWEB_RUTA`. No hay nada del servidor escrito en el repo.

## Estructura

```
src/
├── components/
│   ├── ui/
│   │   └── IconoSVG.astro       ← Íconos SVG animados (stroke-draw)
│   ├── Nav.astro                 ← Navegación con toggle tema
│   ├── Hero.astro                ← Sección hero
│   ├── CarruselTecnologias.astro ← Franja de burbujas flotantes
│   ├── SeccionProductos.astro    ← Lista de productos
│   ├── SeccionPlanes.astro       ← Paneles con particle morphing
│   ├── SeccionFeatures.astro     ← Grilla "Por qué Salix"
│   ├── BannerCTA.astro           ← Banner de llamada a la acción
│   ├── SeccionTestimonios.astro  ← Testimonios de clientes
│   └── Footer.astro
├── layouts/
│   └── Plantilla.astro           ← Layout base (head, SEO, scripts)
├── pages/
│   └── index.astro               ← Página principal (ensambla todo)
├── scripts/
│   ├── particulas.js             ← Sistema de partículas con repulsión
│   ├── morphing.js               ← Particle morphing para los paneles
│   └── utilidades.js             ← Funciones comunes (nav, scroll, etc)
└── styles/
    ├── variables.css             ← Tokens de diseño (colores, etc)
    └── global.css                ← Estilos base y componentes reutilizables
```

## Instalación

```bash
npm install
npm run dev
```

## Qué editar

- **Textos del hero** → `src/components/Hero.astro` → constante `CONTENIDO`
- **Productos** → `src/components/SeccionProductos.astro` → array `PRODUCTOS`
- **Features** → `src/components/SeccionFeatures.astro` → array `FEATURES`
- **Testimonios** → `src/components/SeccionTestimonios.astro` → array `TESTIMONIOS`
- **Colores** → `src/styles/variables.css`
- **Logo** → buscar `REEMPLAZAR` en Nav.astro, Hero.astro y Footer.astro
- **SEO** → `src/layouts/Plantilla.astro`
- **Analytics** → descommentar bloques en `Plantilla.astro` y reemplazar IDs

## Tecnologías

- **Astro 4** — Framework de páginas estáticas
- **CSS puro** — Sin Tailwind, estilos en cada componente
- **Canvas 2D** — Partículas y morphing en JavaScript puro
- **IntersectionObserver** — Animaciones al scroll
- **stroke-dashoffset** — Técnica para íconos que se "dibujan"

## Archivos de verificación — `public/.well-known/` (NO borrar)

`public/.well-known/apple-app-site-association` es el archivo que Apple lee en
`https://salixweb.com/.well-known/apple-app-site-association` para autorizar las
**llaves de acceso (passkeys)** de la app Flux iOS: el RP ID de WebAuthn de la
familia es `salixweb.com` (el dominio padre), así que la verificación vive acá,
en la landing — no en la app. Sin este archivo, la ceremonia de passkey FALLA en
el iPhone aunque todo lo demás esté bien.

- Va **sin extensión** y se sirve como `application/json` (el `.htaccess` de la
  carpeta fuerza el tipo). No renombrar, no agregarle `.json`.
- Todo deploy de la landing DEBE incluir la carpeta `.well-known/` (Astro copia
  `public/` a la raíz del build automáticamente; si se sube a mano, no saltearla
  — es una carpeta oculta y los clientes FTP suelen esconderla).
- Contexto completo: repo Flux web → `docs/operacion/llaves-acceso-passkeys-setup.md`
  y `docs/familia-salix/cliente-nativo-flux.md` §11.
