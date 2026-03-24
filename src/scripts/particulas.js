// ============================================================
// particulas.js — Sistema de partículas con repulsión del mouse
//
// Las partículas flotan libremente.
// Cuando el mouse se acerca, las repele.
// Cuando el mouse se aleja, vuelven suavemente a su zona.
//
// Uso: import { iniciarParticulas } from '../scripts/particulas.js'
//      iniciarParticulas('id-del-canvas')
// ============================================================

/**
 * Paleta de colores de las partículas.
 * Cada entrada: [rojo, verde, azul, opacidad base]
 */
const PALETA_COLORES = [
  { r: 26,  g: 107, b: 71,  op: 0.52 },  // Verde Salix
  { r: 59,  g: 130, b: 246, op: 0.45 },  // Azul
  { r: 168, g: 85,  b: 247, op: 0.38 },  // Violeta
  { r: 234, g: 88,  b: 12,  op: 0.42 },  // Naranja
  { r: 234, g: 179, b: 8,   op: 0.40 },  // Amarillo
  { r: 100, g: 100, b: 100, op: 0.28 },  // Gris neutro
];

// Constantes de física — ajustar para cambiar el comportamiento
const RADIO_REPULSION = 130;   // px — radio en el que el mouse repele
const FUERZA_REPULSION = 4.5;  // intensidad del empuje
const FRICCION = 0.94;         // <1 = partículas se frenan (0.94 = frena bastante rápido)
const FUERZA_RETORNO = 0.011;  // qué tan rápido vuelven a su posición original
const VELOCIDAD_MAXIMA = 6;    // px/frame — límite de velocidad

/**
 * Crea una partícula con posición y velocidad aleatoria
 * @param {number} anchoCanvas
 * @param {number} altoCanvas
 */
function crearParticula(anchoCanvas, altoCanvas) {
  const color = PALETA_COLORES[Math.floor(Math.random() * PALETA_COLORES.length)];
  return {
    x:    Math.random() * anchoCanvas,
    y:    Math.random() * altoCanvas,
    // Posición "home" — hacia donde vuelve cuando no hay repulsión
    posicionHomeX: Math.random() * anchoCanvas,
    posicionHomeY: Math.random() * altoCanvas,
    // Velocidad inicial aleatoria lenta
    velocidadX: (Math.random() - 0.5) * 0.5,
    velocidadY: (Math.random() - 0.5) * 0.5,
    radio:     Math.random() * 2.2 + 0.9,
    opacidad:  color.op,
    fase:      Math.random() * Math.PI * 2,  // Para el pulso suave
    colorR:    color.r,
    colorG:    color.g,
    colorB:    color.b,
  };
}

/**
 * Inicializa y arranca el sistema de partículas en un canvas
 * @param {string} idCanvas — id del elemento <canvas>
 */
export function iniciarParticulas(idCanvas) {
  const canvas = document.getElementById(idCanvas);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let ancho = 0, alto = 0;
  let particulas = [];
  let mouseX = -9999, mouseY = -9999;

  // Ajustar canvas al tamaño de la ventana
  function ajustarTamaño() {
    ancho = canvas.width  = window.innerWidth;
    alto  = canvas.height = window.innerHeight;
  }

  // Crear todas las partículas
  function inicializarParticulas() {
    // Densidad: 1 partícula cada ~6500px² del canvas
    const cantidad = Math.min(Math.floor((ancho * alto) / 6500), 140);
    particulas = Array.from({ length: cantidad }, () => crearParticula(ancho, alto));
  }

  ajustarTamaño();
  inicializarParticulas();

  // Escuchar el mouse
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Cuando el mouse sale de la ventana, desactivar repulsión
  document.addEventListener('mouseleave', () => {
    mouseX = -9999;
    mouseY = -9999;
  });

  // Reajustar cuando cambia el tamaño de la ventana
  window.addEventListener('resize', () => {
    ajustarTamaño();
    inicializarParticulas();
  }, { passive: true });

  // Bucle principal de animación
  function animar() {
    ctx.clearRect(0, 0, ancho, alto);

    particulas.forEach((p) => {
      // ---- 1. Repulsión del mouse ----
      const distX = p.x - mouseX;
      const distY = p.y - mouseY;
      const distancia = Math.sqrt(distX * distX + distY * distY) || 1;

      if (distancia < RADIO_REPULSION) {
        // Fuerza inversamente proporcional — más cerca = más fuerte
        const intensidad = FUERZA_REPULSION * Math.pow(1 - distancia / RADIO_REPULSION, 1.5);
        p.velocidadX += (distX / distancia) * intensidad;
        p.velocidadY += (distY / distancia) * intensidad;
      }

      // ---- 2. Fuerza de retorno al home ----
      p.velocidadX += (p.posicionHomeX - p.x) * FUERZA_RETORNO;
      p.velocidadY += (p.posicionHomeY - p.y) * FUERZA_RETORNO;

      // El home mismo deriva muy lentamente (movimiento orgánico)
      p.posicionHomeX += (Math.random() - 0.5) * 0.3;
      p.posicionHomeY += (Math.random() - 0.5) * 0.3;
      // Mantener el home dentro de los límites de la pantalla
      p.posicionHomeX = Math.max(40, Math.min(ancho - 40, p.posicionHomeX));
      p.posicionHomeY = Math.max(40, Math.min(alto  - 40, p.posicionHomeY));

      // ---- 3. Aplicar fricción y límite de velocidad ----
      p.velocidadX *= FRICCION;
      p.velocidadY *= FRICCION;

      const velocidadActual = Math.sqrt(p.velocidadX ** 2 + p.velocidadY ** 2);
      if (velocidadActual > VELOCIDAD_MAXIMA) {
        p.velocidadX = (p.velocidadX / velocidadActual) * VELOCIDAD_MAXIMA;
        p.velocidadY = (p.velocidadY / velocidadActual) * VELOCIDAD_MAXIMA;
      }

      // ---- 4. Mover ----
      p.x += p.velocidadX;
      p.y += p.velocidadY;

      // ---- 5. Dibujar ----
      // Pulso suave de opacidad con función seno
      p.fase += 0.007;
      const opacidadFinal = Math.max(0, p.opacidad + Math.sin(p.fase) * 0.08);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radio, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.colorR},${p.colorG},${p.colorB},${opacidadFinal})`;
      ctx.fill();
    });

    requestAnimationFrame(animar);
  }

  requestAnimationFrame(animar);
}
