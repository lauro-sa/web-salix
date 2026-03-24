// ============================================================
// morphing.js — Partículas que forman figuras al hacer hover
//
// Cada panel tiene su propio pool de partículas.
// En estado libre: flotan aleatoriamente.
// Al hacer hover: cada partícula se mueve hacia su posición
// en la figura asignada (llaves {} o anillos ○).
//
// Uso: import { iniciarMorphing } from '../scripts/morphing.js'
//      iniciarMorphing('canvas-izq', 'panel-izq', 'llaves')
//      iniciarMorphing('canvas-der', 'panel-der', 'anillos')
// ============================================================

/**
 * Genera los puntos para la figura "llaves" { }
 * @param {number} ancho — ancho del panel en px
 * @param {number} alto  — alto del panel en px
 * @returns {Array<{x:number, y:number}>}
 */
function generarPuntosLlaves(ancho, alto) {
  const puntos = [];
  const escala = Math.min(ancho, alto) * 0.3;
  const cx = ancho * 0.5;
  const cy = alto  * 0.5;

  // Genera los puntos de una llave { o } según dirección
  function dibujarLlave(desplazamientoX, direccion) {
    const brazo = escala * 0.25;
    const N = 90; // puntos por llave

    for (let i = 0; i < N; i++) {
      const t = i / N;
      let x, y;

      if (t < 0.12) {
        // Brazo superior horizontal
        x = desplazamientoX + direccion * brazo * (1 - t / 0.12);
        y = cy - escala * 0.45;
      } else if (t < 0.22) {
        // Curva superior
        const angulo = ((t - 0.12) / 0.10) * (Math.PI / 2);
        x = desplazamientoX - direccion * brazo * Math.sin(angulo);
        y = cy - escala * 0.45 + escala * 0.2 * Math.sin(angulo);
      } else if (t < 0.42) {
        // Barra vertical superior
        x = desplazamientoX;
        y = cy - escala * 0.25 + escala * 0.25 * ((t - 0.22) / 0.20);
      } else if (t < 0.5) {
        // Punta central (muesca de la llave)
        x = desplazamientoX + direccion * escala * 0.2 * Math.sin(((t - 0.42) / 0.08) * Math.PI);
        y = cy;
      } else if (t < 0.7) {
        // Barra vertical inferior
        x = desplazamientoX;
        y = cy + escala * 0.05 + escala * 0.25 * ((t - 0.5) / 0.20);
      } else if (t < 0.8) {
        // Curva inferior
        const angulo = ((t - 0.70) / 0.10) * (Math.PI / 2);
        x = desplazamientoX - direccion * brazo * Math.sin(angulo);
        y = cy + escala * 0.3 + escala * 0.15 * Math.sin(angulo);
      } else {
        // Brazo inferior horizontal
        x = desplazamientoX + direccion * brazo * ((t - 0.8) / 0.2);
        y = cy + escala * 0.45;
      }

      puntos.push({ x: cx + x, y });
    }
  }

  dibujarLlave(-escala * 0.28, -1); // Llave izquierda {
  dibujarLlave( escala * 0.28,  1); // Llave derecha }

  return puntos;
}

/**
 * Genera los puntos para la figura "anillos" (5 círculos)
 * @param {number} ancho
 * @param {number} alto
 * @returns {Array<{x:number, y:number}>}
 */
function generarPuntosAnillos(ancho, alto) {
  const puntos = [];
  const radio  = Math.min(ancho, alto) * 0.13;
  const cx     = ancho * 0.5;
  const cy     = alto  * 0.5;
  const sep    = radio * 0.9;

  // Centros de los 5 anillos
  const centros = [
    { x: cx - sep,       y: cy - sep * 0.7 },
    { x: cx + sep,       y: cy - sep * 0.7 },
    { x: cx,             y: cy + sep * 0.8 },
    { x: cx - sep * 1.2, y: cy + sep * 0.1 },
    { x: cx + sep * 1.0, y: cy + sep * 0.1 },
  ];

  centros.forEach((centro) => {
    for (let i = 0; i < 50; i++) {
      const angulo = (i / 50) * Math.PI * 2;
      puntos.push({
        x: centro.x + Math.cos(angulo) * radio,
        y: centro.y + Math.sin(angulo) * radio,
      });
    }
  });

  return puntos;
}

/**
 * Inicializa el sistema de morphing en un panel
 * @param {string} idCanvas  — id del <canvas> dentro del panel
 * @param {string} idPanel   — id del div del panel
 * @param {'llaves'|'anillos'} tipoForma — qué figura se forma al hover
 */
export function iniciarMorphing(idCanvas, idPanel, tipoForma) {
  const canvas = document.getElementById(idCanvas);
  const panel  = document.getElementById(idPanel);
  if (!canvas || !panel) return;

  const ctx = canvas.getContext('2d');
  let ancho = 0, alto = 0;
  let puntos = [];
  let puntosForma = [];
  let estaHovered = false;

  const CANTIDAD_PUNTOS = 200;

  // Ajustar canvas al tamaño del panel
  function ajustarTamaño() {
    ancho = canvas.width  = panel.offsetWidth;
    alto  = canvas.height = panel.offsetHeight;

    // Recalcular la forma con el nuevo tamaño
    puntosForma = tipoForma === 'llaves'
      ? generarPuntosLlaves(ancho, alto)
      : generarPuntosAnillos(ancho, alto);
  }

  // Crear las partículas del panel
  function inicializarPuntos() {
    puntos = Array.from({ length: CANTIDAD_PUNTOS }, (_, indice) => ({
      x:  Math.random() * ancho,
      y:  Math.random() * alto,
      // Posición libre (a la que vuelve cuando no hay hover)
      homeX: Math.random() * ancho,
      homeY: Math.random() * alto,
      velocidadX: (Math.random() - 0.5) * 0.4,
      velocidadY: (Math.random() - 0.5) * 0.4,
      // Posición target en la figura (asignada circularmente)
      targetX: puntosForma[indice % puntosForma.length]?.x ?? ancho / 2,
      targetY: puntosForma[indice % puntosForma.length]?.y ?? alto  / 2,
      radio:    Math.random() * 1.6 + 0.5,
      opacidad: Math.random() * 0.35 + 0.12,
      fase:     Math.random() * Math.PI * 2,
    }));
  }

  ajustarTamaño();
  inicializarPuntos();

  // Detectar hover en el panel
  panel.addEventListener('mouseenter', () => { estaHovered = true;  });
  panel.addEventListener('mouseleave', () => { estaHovered = false; });
  panel.addEventListener('touchstart', () => { estaHovered = true;  }, { passive: true });
  panel.addEventListener('touchend',   () => { estaHovered = false; }, { passive: true });

  // Reajustar si cambia el tamaño
  let rafResize = null;
  new ResizeObserver(() => {
    if (rafResize) cancelAnimationFrame(rafResize);
    rafResize = requestAnimationFrame(() => {
      ajustarTamaño();
      inicializarPuntos();
      rafResize = null;
    });
  }).observe(panel);

  // Bucle de animación del panel
  function animar() {
    ctx.clearRect(0, 0, ancho, alto);

    puntos.forEach((p) => {
      p.fase += 0.007;

      if (estaHovered) {
        // MODO FORMA: cada punto se mueve hacia su posición target
        // Velocidad proporcional a la distancia → desaceleración natural
        p.velocidadX = (p.targetX - p.x) * 0.09;
        p.velocidadY = (p.targetY - p.y) * 0.09;
      } else {
        // MODO LIBRE: deriva suave con algo de ruido
        p.velocidadX += (p.homeX - p.x) * 0.01 + (Math.random() - 0.5) * 0.04;
        p.velocidadY += (p.homeY - p.y) * 0.01 + (Math.random() - 0.5) * 0.04;
        p.velocidadX *= 0.978;
        p.velocidadY *= 0.978;

        // Límite de velocidad en modo libre
        const vel = Math.sqrt(p.velocidadX ** 2 + p.velocidadY ** 2);
        if (vel > 1.8) { p.velocidadX = p.velocidadX/vel*1.8; p.velocidadY = p.velocidadY/vel*1.8; }

        // Wrap dentro del panel (solo en modo libre)
        if (p.x < -10) p.x = ancho + 10;
        if (p.x > ancho + 10) p.x = -10;
        if (p.y < -10) p.y = alto  + 10;
        if (p.y > alto  + 10) p.y = -10;
      }

      p.x += p.velocidadX;
      p.y += p.velocidadY;

      // Color azul — más intenso cuando está formando la figura
      const pulsacion = p.opacidad + Math.sin(p.fase) * 0.07;
      const alpha = estaHovered
        ? Math.min(pulsacion * 2.8, 0.88)  // Más visible al formar la figura
        : pulsacion * 0.55;                 // Sutil cuando flota libre

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radio * (estaHovered ? 1.1 : 0.8), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59,130,246,${Math.max(0, alpha)})`;
      ctx.fill();
    });

    requestAnimationFrame(animar);
  }

  requestAnimationFrame(animar);
}
