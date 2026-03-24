# salixweb — Landing page de Salix

Proyecto Astro para la landing page de **salixweb.com**.

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
