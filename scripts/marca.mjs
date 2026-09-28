#!/usr/bin/env node
/**
 * Prepara la marca del sitio a partir de `public/logo-salix.svg`.
 *
 *   npm run marca
 *
 * Hace las dos cosas que hay que acordarse de hacer al cambiar el logo, y que si
 * se olvidan fallan **en silencio**:
 *
 *   1. Calcula la versión del logo y la escribe en `src/marca-version.ts`, que
 *      `LogoSalix.astro` le cuelga a la URL como `?v=`. Sin eso el CDN de
 *      Hostinger sigue sirviendo el logo viejo hasta 7 días (`max-age=604800`):
 *      reemplazás el archivo, subís el sitio, y no cambia nada. Pasó el
 *      2026-08-19 con el logo cruzado en producción.
 *   2. Regenera `public/og-image.png`, la imagen de la vista previa al compartir,
 *      que lleva el mismo isotipo.
 *   3. Regenera el favicon (svg e ico) y el ícono de iPhone desde el mismo dibujo.
 *
 * El dibujo NO se edita acá: `public/logo-salix.svg` lo escribe el generador de
 * marca del repo de Flux (`node scripts/marca/generar.mjs`), que es la fuente
 * única de la familia. Ver `docs/familia-salix/kit-marca.md` §8 allá.
 */
import { readFileSync, writeFileSync } from 'fs'
import { createHash } from 'crypto'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execFileSync } from 'child_process'

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const LOGO = resolve(RAIZ, 'public/logo-salix.svg')

// La huella mira el dibujo Y esta receta: si cambia cómo se arma el favicon (2026-09-28: la placa
// clara), la URL tiene que cambiar igual, o la pestaña se queda con el ícono viejo en su caché.
const version = createHash('sha256')
  .update(readFileSync(LOGO))
  .update(readFileSync(fileURLToPath(import.meta.url)))
  .digest('hex')
  .slice(0, 8)

writeFileSync(
  resolve(RAIZ, 'src/marca-version.ts'),
  `/* ARCHIVO GENERADO — no editar a mano. Sale de \`npm run marca\`.
 *
 * Huella de public/logo-salix.svg y de scripts/marca.mjs. LogoSalix.astro la cuelga de la URL del logo
 * para que el CDN sirva el archivo nuevo apenas cambia, en vez de seguir con el
 * viejo hasta que expire su cache de 7 días.
 */
export const VERSION_LOGO = '${version}'
`,
)
console.log(`✓ src/marca-version.ts — versión del logo: ${version}`)

execFileSync('node', [resolve(RAIZ, 'scripts/og-image.mjs')], { stdio: 'inherit' })

/* 3. Los íconos del navegador y del teléfono salen del MISMO dibujo.
 *
 * Hasta el 2026-09-28 eran archivos sueltos que nadie regeneraba: al cambiar el logo
 * quedaron el favicon con un dibujo viejo y el ícono de iPhone con un logo AJENO, que
 * estuvo publicado desde el 2026-08-19 sin que nada avisara. Ahora `npm run marca` los
 * pisa en cada corrida, así que no pueden volver a quedar con otro dibujo. */
const sharp = (await import('sharp')).default
const svgLogo = readFileSync(LOGO, 'utf8')
const d = svgLogo.match(/\sd="([^"]+)"/)[1]
const regla = svgLogo.match(/fill-rule="(\w+)"/)?.[1] ?? 'nonzero'

// favicon.svg — la Cortina en cobre sobre una placa clara, igual que el del panel
// (`public/iconos/favicon-salix.svg` del repo de Flux, que sale de `faviconEnPlaca`).
// 🔴 Sin prefers-color-scheme: con la marca negra que pasaba a blanco en oscuro, Chrome la
// mostraba NEGRA sobre su barra oscura (no siempre evalúa la media query contra su propio tema,
// y el .ico no puede cambiar de color). Con la placa se lee igual en pestañas claras y oscuras.
const ocupacionFavicon = 0.72
const desplaceFavicon = +((24 * (1 - ocupacionFavicon)) / 2).toFixed(3)
const faviconSvg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="Salix">` +
  `<defs><linearGradient id="placa" x1="0" y1="0" x2="1" y2="1">` +
  `<stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#f0f0f1"/>` +
  `</linearGradient></defs>` +
  `<rect width="24" height="24" rx="5.5" fill="url(#placa)"/>` +
  `<path transform="translate(${desplaceFavicon} ${desplaceFavicon}) scale(${ocupacionFavicon})" fill="#c2710c" ` +
  `fill-rule="${regla}" d="${d}"/></svg>\n`
writeFileSync(resolve(RAIZ, 'public/favicon.svg'), faviconSvg)

// El dibujo sobre un fondo, ocupando `ocupacion` del lado
const icono = (lado, { fondo, color, ocupacion }) => {
  const m = (24 / ocupacion - 24) / 2
  const vb = `${-m} ${-m} ${24 + 2 * m} ${24 + 2 * m}`
  const rect = fondo ? `<rect x="${-m}" y="${-m}" width="${24 + 2 * m}" height="${24 + 2 * m}" fill="${fondo}"/>` : ''
  return sharp(
    Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${lado}" height="${lado}">${rect}<path fill="${color}" fill-rule="${regla}" d="${d}"/></svg>`),
  ).png().toBuffer()
}

// apple-touch-icon — iOS no respeta la transparencia: fondo claro propio
writeFileSync(resolve(RAIZ, 'public/apple-touch-icon.png'), await icono(180, { fondo: '#fbfaf8', color: '#111111', ocupacion: 0.62 }))

// favicon.ico — un ICO de verdad con 16, 32 y 48 (PNG adentro)
// El .ico se rasteriza del MISMO svg: así los dos no se separan nunca.
const pngs = await Promise.all(
  [16, 32, 48].map((l) => sharp(Buffer.from(faviconSvg), { density: 72 * (l / 24) * 4 }).resize(l, l).png().toBuffer()),
)
const cabecera = Buffer.alloc(6 + 16 * pngs.length)
cabecera.writeUInt16LE(0, 0); cabecera.writeUInt16LE(1, 2); cabecera.writeUInt16LE(pngs.length, 4)
let desplazamiento = cabecera.length
pngs.forEach((png, i) => {
  const lado = [16, 32, 48][i], o = 6 + 16 * i
  cabecera.writeUInt8(lado, o); cabecera.writeUInt8(lado, o + 1)
  cabecera.writeUInt16LE(1, o + 4); cabecera.writeUInt16LE(32, o + 6)
  cabecera.writeUInt32LE(png.length, o + 8); cabecera.writeUInt32LE(desplazamiento, o + 12)
  desplazamiento += png.length
})
writeFileSync(resolve(RAIZ, 'public/favicon.ico'), Buffer.concat([cabecera, ...pngs]))
console.log('✓ public/favicon.svg, favicon.ico y apple-touch-icon.png — del mismo logo')
