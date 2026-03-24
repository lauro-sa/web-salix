// ============================================================
// particulas.js — Grid magnetico de puntos POR SECCION
//
// Grilla de puntos que reaccionan al mouse.
// Se puede instanciar multiples veces, una por cada canvas.
// Cada instancia observa su propio contenedor.
// ============================================================

// Configuracion del grid
const ESPACIO       = 40;    // px entre cada punto
const RADIO_BASE    = 1.2;   // tamaño base del punto (en px logicos, se escala con DPR)
const RADIO_HOVER   = 3;     // tamaño cerca del mouse
const RADIO_MOUSE   = 160;   // px — radio de influencia del mouse
const FUERZA        = 20;    // px maximo de desplazamiento
const SUAVIZADO     = 0.08;  // velocidad de interpolacion (0-1, mas bajo = mas suave)

/**
 * Inicializa un grid magnetico en un canvas especifico.
 * El canvas debe estar dentro de un contenedor con position:relative.
 * @param {string} idCanvas — id del elemento <canvas>
 */
export function iniciarParticulas(idCanvas) {
  const canvas = document.getElementById(idCanvas);
  if (!canvas) return;

  const contenedor = canvas.parentElement;
  if (!contenedor) return;

  const ctx = canvas.getContext('2d');
  let ancho = 0, alto = 0;
  let puntos = [];
  let mouseX = -9999, mouseY = -9999;
  let activo = false; // solo animar cuando es visible

  // Color segun tema
  function obtenerColor() {
    const tema = document.documentElement.getAttribute('data-tema');
    return tema === 'oscuro'
      ? { r: 255, g: 255, b: 255 }
      : { r: 0,   g: 0,   b: 0   };
  }

  // Crear la grilla
  function crearGrilla() {
    puntos = [];
    const cols = Math.ceil(ancho / ESPACIO) + 1;
    const fils = Math.ceil(alto  / ESPACIO) + 1;
    const offX = (ancho - (cols - 1) * ESPACIO) / 2;
    const offY = (alto  - (fils - 1) * ESPACIO) / 2;

    for (let f = 0; f < fils; f++) {
      for (let c = 0; c < cols; c++) {
        const ox = offX + c * ESPACIO;
        const oy = offY + f * ESPACIO;
        puntos.push({
          origenX: ox, origenY: oy,
          x: ox, y: oy,
          radioActual: RADIO_BASE,
          opacidadActual: 0.15,
        });
      }
    }
  }

  // DPR para que el canvas se vea nitido en pantallas retina
  const dpr = window.devicePixelRatio || 1;

  // Ajustar canvas al tamaño del contenedor
  function ajustarTamaño() {
    const rect = contenedor.getBoundingClientRect();
    ancho = Math.round(rect.width);
    alto  = Math.round(rect.height);

    // El canvas se dibuja a resolucion nativa del display
    canvas.width  = ancho * dpr;
    canvas.height = alto  * dpr;

    // Pero se muestra al tamaño logico del contenedor
    canvas.style.width  = ancho + 'px';
    canvas.style.height = alto  + 'px';

    // Escalar el contexto para que las coordenadas logicas coincidan
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  ajustarTamaño();
  crearGrilla();

  // Mouse: convertir coordenadas de pagina a coordenadas del contenedor
  document.addEventListener('mousemove', (e) => {
    const rect = contenedor.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  document.addEventListener('mouseleave', () => {
    mouseX = -9999;
    mouseY = -9999;
  });

  // Resize con debounce
  let tiempoResize = null;
  window.addEventListener('resize', () => {
    clearTimeout(tiempoResize);
    tiempoResize = setTimeout(() => {
      ajustarTamaño();
      crearGrilla();
    }, 150);
  }, { passive: true });

  // Solo animar cuando la seccion es visible (performance)
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      activo = entrada.isIntersecting;
      if (activo) requestAnimationFrame(animar);
    });
  }, { threshold: 0 });
  observador.observe(contenedor);

  // Bucle de animacion
  function animar() {
    if (!activo) return;

    ctx.clearRect(0, 0, ancho, alto);
    const color = obtenerColor();

    for (let i = 0; i < puntos.length; i++) {
      const p = puntos[i];
      const distX = mouseX - p.origenX;
      const distY = mouseY - p.origenY;
      const dist  = Math.sqrt(distX * distX + distY * distY);

      let tX = p.origenX;
      let tY = p.origenY;
      let tR = RADIO_BASE;
      let tO = 0.15;

      if (dist < RADIO_MOUSE) {
        const factor = (1 - dist / RADIO_MOUSE);
        const f2     = factor * factor;
        const angulo = Math.atan2(p.origenY - mouseY, p.origenX - mouseX);

        tX = p.origenX + Math.cos(angulo) * FUERZA * f2;
        tY = p.origenY + Math.sin(angulo) * FUERZA * f2;
        tR = RADIO_BASE + (RADIO_HOVER - RADIO_BASE) * f2;
        tO = 0.15 + 0.55 * f2;
      }

      // Lerp suave
      p.x              += (tX - p.x) * SUAVIZADO;
      p.y              += (tY - p.y) * SUAVIZADO;
      p.radioActual    += (tR - p.radioActual) * SUAVIZADO;
      p.opacidadActual += (tO - p.opacidadActual) * SUAVIZADO;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radioActual, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${p.opacidadActual})`;
      ctx.fill();
    }

    // Lineas constelacion cerca del mouse
    if (mouseX > -9000) {
      for (let i = 0; i < puntos.length; i++) {
        const pA = puntos[i];
        const dA = Math.sqrt((mouseX - pA.origenX) ** 2 + (mouseY - pA.origenY) ** 2);
        if (dA >= RADIO_MOUSE) continue;

        for (let j = i + 1; j < puntos.length; j++) {
          const pB = puntos[j];
          const dB = Math.sqrt((mouseX - pB.origenX) ** 2 + (mouseY - pB.origenY) ** 2);
          if (dB >= RADIO_MOUSE) continue;

          const dAB = Math.sqrt((pA.x - pB.x) ** 2 + (pA.y - pB.y) ** 2);
          if (dAB < ESPACIO * 1.8) {
            const opLinea = 0.12 * (1 - dA / RADIO_MOUSE);
            ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},${opLinea})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(pA.x, pA.y);
            ctx.lineTo(pB.x, pB.y);
            ctx.stroke();
          }
        }
      }
    }

    requestAnimationFrame(animar);
  }
}
