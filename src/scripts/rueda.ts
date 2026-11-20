// ============================================================
// rueda.ts — la rueda de la portada (src/components/Rueda.astro): todo lo que hace la casa, pasando
// de frente como en un tambor. La ficha del frente se ve entera; las dos de al lado, un poco más
// chicas; las de las puntas se achican, se desenfocan y se apagan; las de atrás no se ven.
//
// Avanza de a una: descansa en cada ficha el tiempo de leer su nombre y pasa a la siguiente. Se puede
// arrastrar con el mouse o el dedo (sigue con el envión y se acomoda en la más cercana), espera
// mientras el mouse está encima y, con el teclado, la ficha enfocada viene al frente. Se detiene sola
// cuando sale de la vista o la pestaña pasa al fondo. Con «reducir movimiento» no se activa: queda la
// fila quieta, con el nombre de cada una.
// ============================================================

const REPOSO = 2.6; // segundos que descansa en cada ficha

export function montarRuedas(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-rueda]').forEach(montar);
}

function montar(rueda: HTMLElement): void {
  const fichas = Array.from(rueda.querySelectorAll<HTMLElement>('[data-ficha]'));
  const nombre = rueda.querySelector<HTMLElement>('[data-rueda-nombre]');
  const que = rueda.querySelector<HTMLElement>('[data-rueda-que]');
  const cartel = rueda.querySelector<HTMLElement>('[data-rueda-cartel]');
  if (fichas.length < 5) return;
  const paso = (Math.PI * 2) / fichas.length;

  // La entrada: las fichas salen todas del centro y se abren en abanico mientras la rueda termina de
  // acomodarse. `apertura` va de 0 a 1 en algo más de un segundo, después de que entró el título.
  const ENTRADA_DEMORA = 0.55;
  const ENTRADA_DURA = 1.25;
  let reloj = 0;
  let apertura = 0;
  let angulo = 0.7;
  let destino: number | null = 0;
  let velocidad = 0; // el envión del arrastre, en radianes por segundo
  let espera = 0;
  let radio = 0;
  let aLaVista = true;
  let encima = false;
  let conFoco = false;
  let arrastrando = false;
  let seMovio = false;
  let ultimoX = 0;
  let ultimoT = 0;
  let frente = -1;
  let cuadro = 0;
  let antes = performance.now();

  const medir = () => {
    const lado = fichas[0].offsetWidth;
    // Las dos de al lado quedan pegadas a la del frente, como en un estante; en un teléfono el radio
    // lo limita el ancho y las de las puntas se pierden en el borde.
    radio = Math.max(80, Math.min(lado * 2.7, rueda.clientWidth / 2 - lado * 0.28));
  };

  const pintar = () => {
    let mejor = -1;
    let mejorZ = -2;
    fichas.forEach((ficha, i) => {
      const a = i * paso + angulo;
      const z = Math.cos(a);
      if (z > mejorZ) {
        mejorZ = z;
        mejor = i;
      }
      if (z < 0.06) {
        if (ficha.style.visibility !== 'hidden') ficha.style.visibility = 'hidden';
        return;
      }
      const x = Math.sin(a) * radio * apertura;
      const escala = (0.52 + 0.48 * z * z) * (0.72 + 0.28 * apertura);
      const opacidad = Math.min(1, Math.pow((z - 0.06) / 0.62, 1.25)) * Math.min(1, apertura * 1.6);
      const desenfoque = z < 0.72 ? (0.72 - z) * 4.5 : 0;
      ficha.style.visibility = '';
      ficha.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0) scale(${escala.toFixed(3)})`;
      ficha.style.opacity = opacidad.toFixed(3);
      ficha.style.filter = desenfoque > 0.15 ? `blur(${desenfoque.toFixed(1)}px)` : '';
      ficha.style.zIndex = String(Math.round(z * 100));
    });
    if (mejor !== frente) {
      fichas[frente]?.classList.remove('rueda-ficha--frente');
      frente = mejor;
      const ficha = fichas[frente];
      ficha.classList.add('rueda-ficha--frente');
      rueda.style.setProperty('--frente', ficha.dataset.color ?? 'transparent');
      if (nombre && que && cartel) {
        nombre.textContent = ficha.dataset.nombre ?? '';
        que.textContent = ficha.dataset.que ?? '';
        cartel.classList.remove('rueda-cartel--cambia');
        void cartel.offsetWidth;
        cartel.classList.add('rueda-cartel--cambia');
      }
    }
  };

  const andar = (ahora: number) => {
    cuadro = 0;
    const dt = Math.min(0.05, (ahora - antes) / 1000);
    antes = ahora;
    if (apertura < 1) {
      reloj += dt;
      const t = Math.min(1, Math.max(0, (reloj - ENTRADA_DEMORA) / ENTRADA_DURA));
      apertura = 1 - Math.pow(1 - t, 4); // desacelera al llegar
      if (t > 0) rueda.classList.add('rueda--abierta');
    }
    if (!arrastrando && reloj >= ENTRADA_DEMORA) {
      if (Math.abs(velocidad) > 0.35) {
        // El envión del arrastre: sigue girando y se va gastando.
        angulo += velocidad * dt;
        velocidad *= Math.pow(0.03, dt);
        destino = null;
        espera = 0;
      } else {
        velocidad = 0;
        // Sin envión, se acomoda en la ficha más cercana…
        if (destino === null) destino = Math.round(angulo / paso) * paso;
        const falta = destino - angulo;
        angulo += falta * (1 - Math.exp(-dt * 4.6));
        if (Math.abs(falta) < 0.004) {
          angulo = destino;
          // …descansa ahí, y pasa a la siguiente.
          if (!encima && !conFoco && apertura >= 1) {
            espera += dt;
            if (espera > REPOSO) {
              destino -= paso;
              espera = 0;
            }
          }
        }
      }
    }
    pintar();
    pedir();
  };
  const pedir = () => {
    if (!cuadro && aLaVista && !document.hidden) cuadro = requestAnimationFrame(andar);
  };
  const reanudar = () => {
    antes = performance.now();
    pedir();
  };

  // Arrastrar: la rueda sigue al dedo; al soltar, sigue con el envión.
  rueda.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    arrastrando = true;
    seMovio = false;
    reloj = ENTRADA_DEMORA + ENTRADA_DURA;
    destino = null;
    velocidad = 0;
    ultimoX = e.clientX;
    ultimoT = performance.now();
  });
  window.addEventListener('pointermove', (e) => {
    if (!arrastrando) return;
    const dx = e.clientX - ultimoX;
    if (!seMovio && Math.abs(dx) < 5) return;
    seMovio = true;
    rueda.classList.add('rueda--arrastra');
    const ahora = performance.now();
    const giro = dx / radio;
    angulo += giro;
    velocidad = giro / Math.max(0.008, (ahora - ultimoT) / 1000);
    ultimoX = e.clientX;
    ultimoT = ahora;
  });
  const soltar = () => {
    if (!arrastrando) return;
    arrastrando = false;
    rueda.classList.remove('rueda--arrastra');
    velocidad = Math.max(-7, Math.min(7, velocidad));
    if (performance.now() - ultimoT > 90) velocidad = 0;
    espera = 0;
  };
  window.addEventListener('pointerup', soltar);
  window.addEventListener('pointercancel', soltar);
  // El toque que termina un arrastre no abre el enlace que quedó debajo.
  rueda.addEventListener(
    'click',
    (e) => {
      if (!seMovio) return;
      e.preventDefault();
      e.stopPropagation();
      seMovio = false;
    },
    true,
  );
  rueda.addEventListener('dragstart', (e) => e.preventDefault());
  rueda.addEventListener('pointerenter', (e) => {
    if (e.pointerType === 'mouse') encima = true;
  });
  rueda.addEventListener('pointerleave', () => {
    encima = false;
    espera = 0;
  });

  // Con el teclado: la ficha que toma el foco viene al frente por el camino más corto, y espera ahí.
  fichas.forEach((ficha, i) => {
    ficha.addEventListener('focus', () => {
      if (!ficha.matches(':focus-visible')) return;
      conFoco = true;
      const meta = -i * paso;
      destino = meta + Math.round((angulo - meta) / (Math.PI * 2)) * Math.PI * 2;
      velocidad = 0;
    });
    ficha.addEventListener('blur', () => {
      conFoco = false;
      espera = 0;
    });
  });

  new ResizeObserver(() => {
    medir();
    pintar();
  }).observe(rueda);
  new IntersectionObserver(([e]) => {
    aLaVista = e.isIntersecting;
    if (aLaVista) reanudar();
  }).observe(rueda);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) reanudar();
  });

  rueda.classList.add('rueda--viva');
  medir();
  pintar();
  reanudar();
}
