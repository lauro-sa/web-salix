#!/usr/bin/env node
/**
 * Genera la imagen de compartir — `public/og-image.png`, 1200×630.
 *
 *   node scripts/og-image.mjs
 *
 * Por qué existe: el `og:image` del sitio era un **SVG**, y ninguna de las
 * plataformas donde se comparte un link lo renderiza. WhatsApp, Facebook,
 * Twitter/X y LinkedIn piden PNG o JPG; con un SVG la vista previa sale **sin
 * imagen**, que es lo que pasaba con cualquier link de salixweb.com.
 *
 * El isotipo NO se escribe acá: se lee de `public/logo-salix.svg`, que es el
 * mismo archivo que usa el cabecero. Una sola fuente — si cambia el logo, se
 * corre esto y la imagen de compartir cambia con él.
 */
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/** El cobre de Salix — el mismo `--salix` de src/styles/variables.css. */
const COBRE = '#c2710c'
const COBRE_CLARO = '#e8922a'

const ANCHO = 1200
const ALTO = 630
/** Alto del isotipo. Es un detalle en la tarjeta, no el protagonista. */
const LADO_MARCA = Math.round(ALTO * 0.28)

const TITULO = 'Salix'
const BAJADA = 'Software que simplifica tu negocio'

/** Saca el path del logo real, para no tener el dibujo escrito en dos lados. */
function pathDelLogo() {
  const svg = readFileSync(resolve(RAIZ, 'public/logo-salix.svg'), 'utf8')
  const m = svg.match(/<path\b[^>]*\sd="([^"]+)"/)
  if (!m) throw new Error('public/logo-salix.svg: no encontré el <path> del isotipo.')
  const vb = svg.match(/viewBox="([^"]+)"/)
  if (!vb) throw new Error('public/logo-salix.svg: no tiene viewBox.')
  return { d: m[1], viewBox: vb[1] }
}

const { d, viewBox } = pathDelLogo()

const marca = await sharp(
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${LADO_MARCA}" height="${LADO_MARCA}" viewBox="${viewBox}">` +
      `<path fill="#ffffff" fill-rule="nonzero" d="${d}"/></svg>`,
  ),
)
  .png()
  .toBuffer()

/* El texto va en el fondo y el isotipo se compone encima: así el bloque entero
   —logo, título y bajada— queda centrado como una sola pieza. */
const baseTitulo = ALTO / 2 + LADO_MARCA * 0.46
const fondo =
  `<svg xmlns="http://www.w3.org/2000/svg" width="${ANCHO}" height="${ALTO}">` +
  `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
  `<stop offset="0" stop-color="${COBRE}"/><stop offset="1" stop-color="${COBRE_CLARO}"/>` +
  `</linearGradient></defs>` +
  `<rect width="${ANCHO}" height="${ALTO}" fill="url(#g)"/>` +
  `<text x="${ANCHO / 2}" y="${baseTitulo}" font-family="Helvetica,Arial,sans-serif" font-size="76" ` +
  `font-weight="600" fill="#ffffff" text-anchor="middle" letter-spacing="1">${TITULO}</text>` +
  `<text x="${ANCHO / 2}" y="${baseTitulo + 52}" font-family="Helvetica,Arial,sans-serif" font-size="27" ` +
  `fill="#ffffff" fill-opacity="0.85" text-anchor="middle">${BAJADA}</text>` +
  `</svg>`

const png = await sharp(Buffer.from(fondo))
  .composite([
    {
      input: marca,
      top: Math.round(ALTO / 2 - LADO_MARCA * 1.06),
      left: Math.round((ANCHO - LADO_MARCA) / 2),
    },
  ])
  .png({ compressionLevel: 9 })
  .toBuffer()

writeFileSync(resolve(RAIZ, 'public/og-image.png'), png)
console.log(`✓ public/og-image.png — ${ANCHO}×${ALTO}, ${(png.length / 1024).toFixed(0)} KB`)
