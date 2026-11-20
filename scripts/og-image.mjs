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
 *
 * Desde el rediseño de 2026-11 lleva la cara de la casa: fondo de tinta, el isotipo y el
 * nombre en papel, la frase de la portada y, colgando de arriba, las líneas de la casa con
 * el color de cada una. La letra es Archivo, la del sitio (`public/fuentes`); si la máquina
 * no la puede leer, cae a la sans del sistema y avisa.
 */
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// Los colores de la casa en oscuro: los mismos de src/styles/casa.css.
const FONDO = '#0d0e11'
const PAPEL = '#f2efe8'
const GRIS = '#a5a299'
const BORDE = '#26282e'
/** Las líneas de la casa, en el orden del plano: Flux, Menu, Nuvix, sitios, integraciones y lo que viene. */
const LINEAS = [
  { color: '#8585f2', largo: 0.62 },
  { color: '#9bb88f', largo: 0.78 },
  { color: '#2fb5a6', largo: 0.5 },
  { color: '#e8922a', largo: 0.7 },
  { color: PAPEL, largo: 0.42 },
  { color: '#5d6068', largo: 0.3, obra: true },
  { color: '#5d6068', largo: 0.22, obra: true },
]

const ANCHO = 1200
const ALTO = 630
const MARGEN = 96
const LADO_MARCA = 104

const TITULO = 'Salix'
const FRASE = 'Software que simplifica.'
const BAJADA = 'Sistemas, apps y sitios web.'
const FUENTE = resolve(RAIZ, 'public/fuentes/archivo-latin.woff2')

/** Saca el path del logo real, para no tener el dibujo escrito en dos lados. */
function pathDelLogo() {
  const svg = readFileSync(resolve(RAIZ, 'public/logo-salix.svg'), 'utf8')
  const m = svg.match(/<path\b[^>]*\sd="([^"]+)"/)
  if (!m) throw new Error('public/logo-salix.svg: no encontré el <path> del isotipo.')
  const vb = svg.match(/viewBox="([^"]+)"/)
  if (!vb) throw new Error('public/logo-salix.svg: no tiene viewBox.')
  return { d: m[1], viewBox: vb[1] }
}

/** Un renglón de texto como imagen, con la letra del sitio si se puede leer. */
async function renglon(texto, { tamano, peso, color }) {
  const marcado = `<span foreground="${color}" font_weight="${peso}">${texto}</span>`
  const con = (fuente) =>
    sharp({ text: { text: marcado, font: `Archivo ${tamano}`, ...fuente, rgba: true, dpi: 72 } }).png().toBuffer()
  try {
    return await con({ fontfile: FUENTE })
  } catch {
    console.warn('⚠ No pude leer Archivo: el texto sale con la sans del sistema.')
    return sharp({ text: { text: marcado, font: `sans ${tamano}`, rgba: true, dpi: 72 } }).png().toBuffer()
  }
}

const { d, viewBox } = pathDelLogo()
const marca = await sharp(
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${LADO_MARCA}" height="${LADO_MARCA}" viewBox="${viewBox}">` +
      `<path fill="${PAPEL}" fill-rule="nonzero" d="${d}"/></svg>`,
  ),
)
  .png()
  .toBuffer()

// Las líneas cuelgan de arriba, a la derecha. Las que están en obra van punteadas.
const PASO = 44
const GROSOR = 8
const x0 = ANCHO - MARGEN - PASO * (LINEAS.length - 1) - GROSOR
const lineas = LINEAS.map((l, i) => {
  const x = x0 + i * PASO
  const alto = Math.round(ALTO * l.largo)
  const trazo = l.obra ? ` stroke-dasharray="10 10"` : ''
  return (
    `<line x1="${x + GROSOR / 2}" y1="0" x2="${x + GROSOR / 2}" y2="${alto}" stroke="${l.color}" stroke-width="${GROSOR}"${trazo}/>` +
    `<circle cx="${x + GROSOR / 2}" cy="${alto}" r="11" fill="${FONDO}" stroke="${l.color}" stroke-width="6"/>`
  )
}).join('')

const fondo =
  `<svg xmlns="http://www.w3.org/2000/svg" width="${ANCHO}" height="${ALTO}">` +
  `<rect width="${ANCHO}" height="${ALTO}" fill="${FONDO}"/>` +
  lineas +
  `<rect x="${MARGEN}" y="${ALTO - MARGEN + 28}" width="${ANCHO - 2 * MARGEN}" height="1" fill="${BORDE}"/>` +
  `</svg>`

const titulo = await renglon(TITULO, { tamano: 112, peso: 650, color: PAPEL })
const frase = await renglon(FRASE, { tamano: 46, peso: 500, color: PAPEL })
const bajada = await renglon(BAJADA, { tamano: 46, peso: 400, color: GRIS })

const png = await sharp(Buffer.from(fondo))
  .composite([
    { input: marca, top: 132, left: MARGEN },
    { input: titulo, top: 262, left: MARGEN - 4 },
    { input: frase, top: 396, left: MARGEN },
    { input: bajada, top: 452, left: MARGEN },
  ])
  .png({ compressionLevel: 9 })
  .toBuffer()

writeFileSync(resolve(RAIZ, 'public/og-image.png'), png)
console.log(`✓ public/og-image.png — ${ANCHO}×${ALTO}, ${(png.length / 1024).toFixed(0)} KB`)
