// ============================================================
// formulario-casa.ts — el comportamiento del formulario de contacto de la web nueva
// (src/components/FormularioCasa.astro).
//
//   · Los pasos: validar, avanzar, volver, y el envío a /contacto.php (el contrato de siempre).
//   · En el teléfono, la pantalla completa: al tocar el formulario ocupa toda la pantalla y la página
//     de atrás deja de moverse; vuelve a su lugar con el botón, arrastrando con fuerza hacia abajo o
//     hacia arriba desde cualquier parte, con Escape o yendo atrás. Sigue a lo que queda a la vista cuando el teclado del iPhone achica la pantalla.
// ============================================================

const TEXTO_PREFERENCIA: Record<string, string> = {
  email: 'por correo',
  whatsapp: 'por WhatsApp',
  cualquiera: 'por correo o por WhatsApp',
};
const TELEFONO = window.matchMedia('(max-width: 47.99rem)');
const QUIETO = window.matchMedia('(prefers-reduced-motion: reduce)');
const NOMBRE_TRANSICION = 'formulario-casa';

type ConTransicion = Document & { startViewTransition?: (cambio: () => void) => { finished: Promise<void> } };

export function montarFormularioCasa(): void {
  const caja = document.querySelector<HTMLElement>('[data-fc]');
  const form = caja?.querySelector<HTMLFormElement>('form') ?? null;
  if (!caja || !form || caja.dataset.listo) return;
  caja.dataset.listo = '1';

  const lugar = caja.parentElement as HTMLElement;
  const abiertoA = performance.now();
  const $ = <T extends Element>(sel: string) => caja.querySelector<T>(sel)!;
  const cuerpo = $<HTMLElement>('.fc-cuerpo');
  const paradas = Array.from(caja.querySelectorAll<HTMLElement>('.fc-parada'));
  const riel = $<HTMLElement>('.fc-paradas');
  const sigue = $<HTMLButtonElement>('.fc-sigue');
  const sigueTexto = $<HTMLElement>('[data-fc-sigue]');
  const atras = $<HTMLButtonElement>('[data-fc-atras]');
  const sobre = $<HTMLElement>('[data-fc-sobre]');
  const sobreNombre = $<HTMLElement>('[data-fc-sobre-nombre]');
  const error = $<HTMLElement>('.fc-error');
  const campo = (nombre: string) => form.elements.namedItem(nombre) as HTMLInputElement;
  const elegido = () => form.querySelector<HTMLInputElement>('input[name="producto"]:checked');
  const preferencia = () => form.querySelector<HTMLInputElement>('input[name="preferencia"]:checked')?.value || 'email';

  let paso = 1;
  let enviando = false;
  let cambiando = false;
  let enPantalla = false;

  // ── Avisos de cada campo ──
  const avisar = (clave: string, texto: string) => {
    const aviso = caja.querySelector<HTMLElement>(`[data-aviso="${clave}"]`);
    if (aviso) aviso.textContent = texto;
    if (clave !== 'producto') campo(clave)?.setAttribute('aria-invalid', 'true');
  };
  const limpiar = (clave: string) => {
    const aviso = caja.querySelector<HTMLElement>(`[data-aviso="${clave}"]`);
    if (aviso) aviso.textContent = '';
    if (clave !== 'producto') campo(clave)?.removeAttribute('aria-invalid');
  };
  ['nombre', 'email', 'whatsapp'].forEach((c) => campo(c).addEventListener('input', () => limpiar(c)));

  function validar(n: number): HTMLElement | null {
    if (n === 1 && !elegido()) {
      avisar('producto', 'Elegí una opción para seguir.');
      return form!.querySelector<HTMLElement>('input[name="producto"]');
    }
    if (n === 2) {
      let primero: HTMLElement | null = null;
      const nombre = campo('nombre');
      const email = campo('email');
      const whatsapp = campo('whatsapp');
      if (!nombre.value.trim()) {
        avisar('nombre', 'Escribí tu nombre.');
        primero ??= nombre;
      }
      if (!email.value.trim()) {
        avisar('email', 'Escribí tu correo: ahí te llega la respuesta.');
        primero ??= email;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        avisar('email', 'Revisá el correo: le falta algo.');
        primero ??= email;
      }
      const digitos = whatsapp.value.replace(/\D/g, '').length;
      if (preferencia() === 'whatsapp' && digitos < 8) {
        avisar('whatsapp', 'Para responderte por WhatsApp necesitamos el número.');
        primero ??= whatsapp;
      } else if (whatsapp.value.trim() && digitos < 8) {
        avisar('whatsapp', 'Revisá el número: parece incompleto.');
        primero ??= whatsapp;
      }
      return primero;
    }
    return null;
  }

  // Con «WhatsApp» elegido, el número deja de ser opcional.
  const opcionalWhatsapp = $<HTMLElement>('label[for="fc-whatsapp"] .fc-opcional');
  form.querySelectorAll<HTMLInputElement>('input[name="preferencia"]').forEach((r) =>
    r.addEventListener('change', () => {
      const obligatorio = preferencia() === 'whatsapp';
      opcionalWhatsapp.hidden = obligatorio;
      if (!obligatorio) limpiar('whatsapp');
    }),
  );
  form.querySelectorAll<HTMLInputElement>('input[name="producto"]').forEach((r) =>
    r.addEventListener('change', () => {
      limpiar('producto');
      $<HTMLElement>('#fc-pista').textContent = r.dataset.pista || '';
      teñir();
    }),
  );

  /** La línea de lo elegido tiñe el recorrido del formulario; lo que todavía no tiene línea, el color de Salix. */
  function teñir() {
    const linea = elegido()?.dataset.linea;
    if (linea) caja!.style.setProperty('--fc-c', linea);
    else caja!.style.removeProperty('--fc-c');
    sobreNombre.textContent = elegido()?.dataset.nombre || '';
  }

  // ── Ir de un paso a otro ──
  const PARTES = '.fc-pregunta, .fc-opcion, .fc-grupo, .fc-chips, .fc-campo';
  const pasoDe = (n: number) => caja.querySelector<HTMLElement>(`.fc-paso[data-paso="${n}"]`);

  /** Deja a la vista el paso `n` y pone al día las paradas, los botones y lo elegido. */
  function mostrar(n: number) {
    paso = n;
    caja!.dataset.paso = String(n);
    caja!.querySelectorAll<HTMLElement>('.fc-paso').forEach((p) => (p.hidden = p.dataset.paso !== String(n)));
    // Las partes del paso entran en cascada: se numeran en el orden en que se leen.
    const partes = n === 4 ? Array.from(pasoDe(4)?.children ?? []) : Array.from(pasoDe(n)?.querySelectorAll(PARTES) ?? []);
    partes.forEach((el, i) => (el as HTMLElement).style.setProperty('--n', String(i)));
    paradas.forEach((p, i) => {
      p.classList.toggle('fc-parada--hecha', i + 1 < n);
      p.classList.toggle('fc-parada--actual', i + 1 === n);
      if (i + 1 === n) p.setAttribute('aria-current', 'step');
      else p.removeAttribute('aria-current');
    });
    riel.style.setProperty('--avance', String(Math.min(1, (n - 1) / (paradas.length - 1))));
    atras.disabled = n === 1 || n === 4;
    sobre.hidden = n === 1 || n === 4;
    sigueTexto.textContent = n === 3 ? 'Enviar' : 'Seguir';
    error.hidden = true;
    cuerpo.scrollTop = 0;
  }

  async function irA(n: number, conFoco = true) {
    if (cambiando) return;
    const animado = !QUIETO.matches && n !== paso;
    caja!.dataset.dir = n < paso ? 'atras' : 'adelante';
    if (animado) {
      // El paso que se va se apaga rápido hacia el lado contrario; después la caja pasa de un alto al
      // otro mientras entra el siguiente. En el teléfono a pantalla completa el alto no cambia.
      cambiando = true;
      const sale = pasoDe(paso);
      const altoAntes = cuerpo.offsetHeight;
      const corre = n < paso ? '0.5rem' : '-0.5rem';
      await sale?.animate([{ opacity: 1 }, { opacity: 0, translate: `${corre} 0` }], { duration: 130, easing: 'ease-out' }).finished.catch(() => undefined);
      mostrar(n);
      const altoDespues = cuerpo.offsetHeight;
      if (!enPantalla && altoAntes !== altoDespues) {
        cuerpo.animate([{ blockSize: `${altoAntes}px` }, { blockSize: `${altoDespues}px` }], { duration: 380, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
      }
      cambiando = false;
    } else {
      mostrar(n);
    }
    if (!conFoco) return;
    const destino =
      n === 4
        ? caja!.querySelector<HTMLElement>('.fc-listo-titulo')
        : n === 1
          ? null
          : caja!.querySelector<HTMLElement>(`.fc-paso[data-paso="${n}"] :is(input:not([type=radio]), textarea)`);
    // En el teléfono no se abre el teclado solo: tapa media pantalla antes de leer la pregunta.
    if (destino && (n === 4 || !TELEFONO.matches)) destino.focus({ preventScroll: true });
  }

  atras.addEventListener('click', () => {
    if (paso > 1 && paso < 4) irA(paso - 1);
  });

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    if (enviando || cambiando) return;
    const falla = validar(paso);
    if (falla) {
      falla.focus({ preventScroll: true });
      return;
    }
    if (paso < 3) {
      irA(paso + 1);
      return;
    }

    const datos = {
      producto: elegido()?.value || '',
      nombre: campo('nombre').value.trim(),
      email: campo('email').value.trim(),
      whatsapp: campo('whatsapp').value.trim(),
      preferencia: preferencia(),
      mensaje: (form.elements.namedItem('mensaje') as HTMLTextAreaElement).value.trim(),
      sitio_web: campo('sitio_web').value,
      pagina: location.pathname,
      demora: Math.round(performance.now() - abiertoA),
    };
    enviando = true;
    sigue.setAttribute('aria-busy', 'true');
    sigueTexto.textContent = 'Enviando';
    error.hidden = true;
    const corte = new AbortController();
    const reloj = window.setTimeout(() => corte.abort(), 15000);
    try {
      const r = await fetch('/contacto.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
        signal: corte.signal,
      });
      const respuesta = await r.json().catch(() => null);
      if (!r.ok || !respuesta?.ok) {
        const e = new Error(respuesta?.error || String(r.status)) as Error & { campo?: string; estado?: number };
        e.campo = respuesta?.campo;
        e.estado = r.status;
        throw e;
      }
      $<HTMLElement>('[data-res="producto"]').textContent = elegido()?.dataset.nombre || datos.producto;
      $<HTMLElement>('[data-res="nombre"]').textContent = datos.nombre;
      $<HTMLElement>('[data-res="contacto"]').textContent =
        datos.preferencia === 'whatsapp' ? datos.whatsapp : datos.preferencia === 'cualquiera' && datos.whatsapp ? `${datos.email} · ${datos.whatsapp}` : datos.email;
      $<HTMLElement>('.fc-listo-sub').textContent = `Te respondemos ${TEXTO_PREFERENCIA[datos.preferencia] ?? 'por correo'}.`;
      irA(4);
    } catch (e) {
      const falla = e as Error & { campo?: string; estado?: number };
      if (falla.campo && ['nombre', 'email', 'whatsapp'].includes(falla.campo)) {
        // El servidor rechazó un dato: se vuelve al paso de contacto, marcándolo.
        irA(2);
        avisar(falla.campo, 'Revisá este dato.');
      } else {
        $<HTMLElement>('[data-fc-error]').textContent =
          falla.estado === 429
            ? 'Recibimos varias consultas seguidas desde tu conexión. Probá de nuevo en un rato.'
            : 'No pudimos enviar tu consulta. Probá de nuevo en un momento.';
        error.hidden = false;
        sigueTexto.textContent = 'Enviar';
      }
    } finally {
      window.clearTimeout(reloj);
      enviando = false;
      sigue.removeAttribute('aria-busy');
    }
  });

  $<HTMLButtonElement>('[data-fc-otra]').addEventListener('click', () => {
    form.reset();
    $<HTMLElement>('#fc-pista').textContent = '';
    opcionalWhatsapp.hidden = false;
    teñir();
    irA(1);
  });

  // Una página de producto ya sabe de qué se trata la consulta.
  const pre = caja.dataset.pre;
  if (pre) {
    const opcion = Array.from(form.querySelectorAll<HTMLInputElement>('input[name="producto"]')).find((i) => i.value.toLowerCase() === pre.toLowerCase());
    if (opcion) {
      opcion.checked = true;
      opcion.dispatchEvent(new Event('change'));
    }
  }

  // ── La pantalla completa, en el teléfono ──
  let conHistorial = false;

  const seguirVista = () => {
    const vista = window.visualViewport;
    if (!vista) return;
    caja.style.setProperty('--fc-alto', `${Math.round(vista.height)}px`);
    caja.style.setProperty('--fc-arriba', `${Math.round(vista.offsetTop)}px`);
  };

  /** Cambia entre «parte de la página» y «pantalla completa», con la transición del navegador si existe. */
  function cambiar(poner: boolean) {
    const aplicar = () => {
      if (poner) lugar.style.minBlockSize = `${caja!.offsetHeight}px`;
      caja!.classList.toggle('fc--pantalla', poner);
      document.documentElement.classList.toggle('fc-abierto', poner);
      if (poner) {
        caja!.setAttribute('role', 'dialog');
        caja!.setAttribute('aria-modal', 'true');
        seguirVista();
      } else {
        caja!.removeAttribute('role');
        caja!.removeAttribute('aria-modal');
        caja!.style.removeProperty('--fc-alto');
        caja!.style.removeProperty('--fc-arriba');
        caja!.style.removeProperty('--fc-tira');
        caja!.style.removeProperty('--fc-escala');
        caja!.style.removeProperty('--fc-radio');
        caja!.classList.remove('fc--suelta');
        lugar.style.minBlockSize = '';
      }
    };
    const doc = document as ConTransicion;
    if (doc.startViewTransition && !QUIETO.matches) {
      caja!.style.viewTransitionName = NOMBRE_TRANSICION;
      doc
        .startViewTransition(aplicar)
        .finished.catch(() => undefined)
        .then(() => {
          caja!.style.viewTransitionName = '';
        });
    } else {
      aplicar();
      if (poner) {
        caja!.classList.add('fc--sube');
        caja!.addEventListener('animationend', () => caja!.classList.remove('fc--sube'), { once: true });
      }
    }
  }

  function abrir() {
    if (enPantalla || !TELEFONO.matches) return;
    enPantalla = true;
    cambiar(true);
    try {
      history.pushState({ formularioCasa: true }, '');
      conHistorial = true;
    } catch {
      conHistorial = false;
    }
    window.visualViewport?.addEventListener('resize', seguirVista);
    window.visualViewport?.addEventListener('scroll', seguirVista);
  }

  /** `porHistorial`: el navegador ya volvió atrás (gesto o botón), no hay que volver de nuevo. */
  function cerrar(porHistorial = false) {
    if (!enPantalla) return;
    enPantalla = false;
    (document.activeElement as HTMLElement | null)?.blur?.();
    window.visualViewport?.removeEventListener('resize', seguirVista);
    window.visualViewport?.removeEventListener('scroll', seguirVista);
    cambiar(false);
    if (conHistorial && !porHistorial) history.back();
    conHistorial = false;
  }

  // Tocar el formulario lo abre; el toque sigue su curso (elige la opción, entra al campo).
  caja.addEventListener('click', (e) => {
    if (enPantalla) return;
    if ((e.target as HTMLElement).closest('[data-fc-cerrar]')) return;
    abrir();
  });
  caja.addEventListener('focusin', () => abrir());
  $<HTMLButtonElement>('[data-fc-cerrar]').addEventListener('click', (e) => {
    e.stopPropagation();
    cerrar();
  });
  window.addEventListener('popstate', () => cerrar(true));
  document.addEventListener('keydown', (e) => {
    if (!enPantalla) return;
    if (e.key === 'Escape') cerrar();
    if (e.key !== 'Tab') return;
    // Mientras ocupa la pantalla, el foco no sale del formulario.
    const lista = Array.from(caja.querySelectorAll<HTMLElement>('button, input, textarea, a[href]')).filter((el) => el.offsetParent !== null && !el.hasAttribute('disabled') && el.tabIndex !== -1);
    if (lista.length === 0) return;
    const primero = lista[0];
    const ultimo = lista[lista.length - 1];
    if (e.shiftKey && document.activeElement === primero) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primero.focus();
    }
  });
  // Si la ventana se agranda (se gira una tableta), vuelve a ser parte de la página.
  TELEFONO.addEventListener('change', () => {
    if (!TELEFONO.matches) cerrar();
  });

  // Arrastrar con fuerza hacia abajo o hacia arriba lo despega y lo devuelve a su lugar en la página.
  // Vale desde cualquier parte del formulario (también sobre una opción o un botón: un toque sin
  // moverse sigue siendo un toque). Mientras se arrastra, la hoja sigue al dedo y se achica un poco,
  // así se ve la página de atrás. Si el contenido tiene para desplazarse (con el teclado abierto),
  // primero se desplaza y recién en el borde empieza a despegarse.
  const UMBRAL_INICIO = 10;
  const UMBRAL_SOLTAR = 90;
  let desdeX = 0;
  let desdeY = 0;
  let desdeT = 0;
  let tirando = false;
  let descartado = false;
  const mover = (dy: number) => {
    const avance = Math.min(1, Math.abs(dy) / 320);
    caja.style.setProperty('--fc-tira', `${Math.round(dy * 0.85)}px`);
    caja.style.setProperty('--fc-escala', String(1 - avance * 0.08));
    caja.style.setProperty('--fc-radio', `${Math.round(avance * 28)}px`);
  };
  const soltar = () => {
    caja.classList.add('fc--suelta');
    caja.style.setProperty('--fc-tira', '0px');
    caja.style.setProperty('--fc-escala', '1');
    caja.style.setProperty('--fc-radio', '0px');
  };
  caja.addEventListener(
    'touchstart',
    (e) => {
      if (!enPantalla || e.touches.length !== 1) return;
      desdeX = e.touches[0].clientX;
      desdeY = e.touches[0].clientY;
      desdeT = performance.now();
      tirando = false;
      // Un texto largo se desplaza con el dedo: ahí no se despega.
      descartado = Boolean((e.target as HTMLElement).closest('textarea'));
      caja.classList.remove('fc--suelta');
    },
    { passive: true },
  );
  caja.addEventListener(
    'touchmove',
    (e) => {
      if (!enPantalla || descartado || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - desdeX;
      const dy = e.touches[0].clientY - desdeY;
      if (!tirando) {
        if (Math.abs(dy) < UMBRAL_INICIO) return;
        if (Math.abs(dx) > Math.abs(dy)) {
          descartado = true;
          return;
        }
        // Si el contenido todavía tiene para desplazarse en ese sentido, que se desplace.
        const sobra = cuerpo.scrollHeight - cuerpo.clientHeight;
        const dentroDelCuerpo = cuerpo.contains(e.target as Node);
        if (dentroDelCuerpo && sobra > 1) {
          const puedeSubir = cuerpo.scrollTop > 0;
          const puedeBajar = cuerpo.scrollTop < sobra - 1;
          if ((dy > 0 && puedeSubir) || (dy < 0 && puedeBajar)) {
            descartado = true;
            return;
          }
        }
        tirando = true;
        (document.activeElement as HTMLElement | null)?.blur?.();
      }
      e.preventDefault();
      mover(dy);
    },
    { passive: false },
  );
  const terminar = (e: TouchEvent) => {
    if (!enPantalla || !tirando) return;
    tirando = false;
    const dy = (e.changedTouches[0]?.clientY ?? desdeY) - desdeY;
    const rapidez = Math.abs(dy) / Math.max(1, performance.now() - desdeT);
    if (Math.abs(dy) > UMBRAL_SOLTAR || (Math.abs(dy) > 36 && rapidez > 0.55)) {
      // El toque que termina un arrastre no cuenta como toque sobre lo que había debajo.
      e.preventDefault();
      cerrar();
      return;
    }
    soltar();
  };
  caja.addEventListener('touchend', terminar);
  caja.addEventListener('touchcancel', () => {
    if (!tirando) return;
    tirando = false;
    soltar();
  });
}
