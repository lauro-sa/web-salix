// ============================================================
// casa.ts — el movimiento de la web nueva de Salix.
//
//   · El plano de líneas se dibuja con el scroll: escribe en `--p` (de 0 a 1) cuánto avanzó la
//     escena, y el CSS reparte ese avance entre la casa, cada línea, los cruces y lo que está en obra.
//   · Las líneas de los productos siguen bajando por el costado hasta la parada de cada uno: escribe
//     en `--y` hasta dónde llegó la punta dentro de cada tramo y marca `.llego` al tocar la parada.
//   · Lo que lleva `data-asoma` aparece una vez, al entrar en pantalla.
//   · Las capturas con selector (`data-vistas`) muestran la vista que se elige con su rótulo.
//
// Sin este archivo la página se ve entera y quieta: todo lo que acá se mueve arranca visible.
// Con «reducir movimiento» no se ata nada al scroll ni hay recorridos.
// ============================================================

const QUIETO = window.matchMedia('(prefers-reduced-motion: reduce)');

function entre(valor: number, minimo = 0, maximo = 1): number {
  return Math.min(maximo, Math.max(minimo, valor));
}

function montarScroll(): void {
  const escena = document.querySelector<HTMLElement>('[data-escena]');
  const fija = escena?.querySelector<HTMLElement>('[data-escena-fija]') ?? null;
  const plano = escena?.querySelector<HTMLElement>('[data-plano]') ?? null;
  const tramos = Array.from(document.querySelectorAll<HTMLElement>('[data-riel]'));
  if (!plano && tramos.length === 0) return;

  let pedido = 0;
  let ultimoP = -1;

  const medir = () => {
    pedido = 0;
    const alto = window.innerHeight;

    if (escena && plano) {
      let p = 1;
      if (!QUIETO.matches) {
        const caja = escena.getBoundingClientRect();
        const pegada = fija !== null && getComputedStyle(fija).position === 'sticky';
        if (pegada) {
          // La escena queda quieta mientras se baja: el dibujo arranca un poco antes de que se
          // pegue y termina un poco antes de que se suelte.
          const previo = alto * 0.16;
          const recorrido = caja.height - alto + previo;
          p = (previo - caja.top) / (recorrido * 0.9);
        } else {
          // Pantalla baja (un teléfono acostado): se dibuja mientras el plano cruza la pantalla.
          const r = plano.getBoundingClientRect();
          p = (alto * 0.92 - r.top) / Math.max(1, r.height - alto * 0.05);
        }
      }
      p = Math.round(entre(p) * 1000) / 1000;
      if (p !== ultimoP) {
        ultimoP = p;
        escena.style.setProperty('--p', String(p));
        plano.classList.toggle('plano--entero', p >= 0.94);
      }
    }

    for (const tramo of tramos) {
      const caja = tramo.getBoundingClientRect();
      if (caja.bottom < -alto || caja.top > alto * 2) continue;
      if (QUIETO.matches) {
        tramo.style.removeProperty('--y');
        tramo.classList.add('llego');
        continue;
      }
      const y = Math.max(0, alto * 0.62 - caja.top);
      tramo.style.setProperty('--y', `${Math.round(y)}px`);
      const parada = tramo.querySelector<HTMLElement>('[data-parada]');
      if (parada) tramo.classList.toggle('llego', y >= parada.offsetTop + parada.offsetHeight / 2);
    }
  };

  const pedir = () => {
    if (!pedido) pedido = requestAnimationFrame(medir);
  };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir);
  QUIETO.addEventListener('change', pedir);
  medir();

  // Los pulsos que recorren las líneas solo corren con el plano a la vista.
  if (plano && 'IntersectionObserver' in window) {
    new IntersectionObserver((entradas) => {
      for (const e of entradas) plano.classList.toggle('plano--vivo', e.isIntersecting);
    }).observe(plano);
  }
}

function montarAsoma(): void {
  const piezas = Array.from(document.querySelectorAll<HTMLElement>('[data-asoma]'));
  if (piezas.length === 0) return;
  if (!('IntersectionObserver' in window)) {
    piezas.forEach((p) => p.classList.add('visto'));
    return;
  }
  const mirador = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('visto');
        mirador.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
  );
  piezas.forEach((p) => mirador.observe(p));
}

function montarVistas(): void {
  document.querySelectorAll<HTMLElement>('[data-vistas]').forEach((caja) => {
    const vistas = Array.from(caja.querySelectorAll<HTMLElement>('[data-vista]'));
    const rotulos = Array.from(caja.querySelectorAll<HTMLButtonElement>('[data-rotulo]'));
    const elegir = (activa: number) => {
      vistas.forEach((v, i) => {
        v.dataset.pos = String(i - activa);
        v.setAttribute('aria-hidden', String(i !== activa));
      });
      rotulos.forEach((r, i) => r.setAttribute('aria-selected', String(i === activa)));
    };
    rotulos.forEach((r, i) => r.addEventListener('click', () => elegir(i)));
  });
}

export function montarCasa(): void {
  montarScroll();
  montarAsoma();
  montarVistas();
}
