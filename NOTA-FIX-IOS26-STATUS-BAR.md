# Fix: Contenido visible detrás del Status Bar en iOS 26 (Safari Liquid Glass)

## El problema

A partir de iOS 26, Safari usa **Liquid Glass** — el status bar (zona del reloj, batería y Dynamic Island) es translúcido. El contenido de la página se ve a través de él cuando scrolleás.

Los elementos con `position: fixed; top: 0` ya **no arrancan desde el borde real de la pantalla**, sino desde **debajo del status bar**. Esto hace que el navbar no cubra esa zona y el contenido pase por detrás del reloj/batería.

`env(safe-area-inset-top)` devuelve `0` en iOS 26 Safari, así que no sirve para calcular la altura del safe area.

## La solución

### 1. Meta viewport con `viewport-fit=cover`

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

### 2. Navbar: subir con `top` negativo + `padding-top` compensatorio

El truco es mover el navbar hacia arriba con un `top` negativo para que su fondo (blur) cubra la zona del status bar. Luego un `padding-top` extra empuja el contenido del nav (logo, botones) a su posición normal debajo del status bar.

Se usa `@supports (-webkit-touch-callout: none)` para que solo aplique en Safari/iOS y no afecte desktop.

```css
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  /* Fondo transparente + blur para fundirse con Liquid Glass */
  background-color: transparent;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 14px 32px;
}

/* Al scrollear, agregar fondo semitransparente */
.nav.scrolled {
  background-color: color-mix(in srgb, var(--fondo) 60%, transparent);
  border-bottom: 1px solid var(--borde);
}

/* Solo iOS: subir el nav para cubrir el status bar */
@supports (-webkit-touch-callout: none) {
  .nav {
    top: -75px;
    padding-top: calc(75px + 14px); /* 75px status bar + 14px padding original */
  }
}
```

### 3. (Opcional) `background-color` en `html`

Safari 26 ya no lee el meta `theme-color`. Lee directamente el CSS de los elementos fixed para tintear el status bar. Poner un `background-color` explícito en `html` ayuda:

```css
html {
  background-color: var(--fondo);
}
```

## Por qué 75px y no otro valor

- El Dynamic Island en iPhones modernos ocupa ~59px
- Se usan 75px para tener margen extra y que no quede una línea visible entre el nav y el Liquid Glass
- El `padding-top: calc(75px + 14px)` compensa el offset negativo para que el contenido del nav quede en la posición correcta

## Por qué el nav es transparente con blur

Safari 26 aplica el efecto Liquid Glass (translúcido con blur) al status bar. Si el nav tiene un fondo sólido o semitransparente, se nota una línea/diferencia de tono donde termina el Liquid Glass y empieza el nav. Con el nav transparente + `backdrop-filter: blur()`, ambos se funden visualmente.

## Notas importantes

- `env(safe-area-inset-top)` NO funciona en iOS 26 Safari (devuelve 0)
- `@supports (-webkit-touch-callout: none)` solo matchea en Safari (iOS y Mac). En desktop Mac Safari no debería haber problema visual porque no hay status bar
- Safari 26 ignora el meta tag `theme-color` — ahora samplea `background-color` de elementos `position: fixed` cercanos al borde del viewport
- Si tenés overlays/modales ocultos con `opacity: 0`, Safari igual los samplea para el tinting. Usar `display: none` en vez de `opacity: 0`

## Archivos modificados en este proyecto

- `src/layouts/Plantilla.astro` → `viewport-fit=cover` en el meta viewport
- `src/components/Nav.astro` → estilos del nav (transparent + blur + @supports iOS)
- `src/styles/global.css` → `background-color` en html
