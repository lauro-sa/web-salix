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

const version = createHash('sha256').update(readFileSync(LOGO)).digest('hex').slice(0, 8)

writeFileSync(
  resolve(RAIZ, 'src/marca-version.ts'),
  `/* ARCHIVO GENERADO — no editar a mano. Sale de \`npm run marca\`.
 *
 * Huella de public/logo-salix.svg. LogoSalix.astro la cuelga de la URL del logo
 * para que el CDN sirva el archivo nuevo apenas cambia, en vez de seguir con el
 * viejo hasta que expire su cache de 7 días.
 */
export const VERSION_LOGO = '${version}'
`,
)
console.log(`✓ src/marca-version.ts — versión del logo: ${version}`)

execFileSync('node', [resolve(RAIZ, 'scripts/og-image.mjs')], { stdio: 'inherit' })
