/* ARCHIVO GENERADO — no editar a mano. Sale de docs/familia-salix/publico-salix.ts (repo de
   Flux) vía `node scripts/marca/generar.mjs`: la barra y el pie de la familia se cambian ahí,
   y esta copia se pisa. */

/*
 * Comportamiento de la barra, el menú móvil y el pie de las páginas públicas de la familia Salix
 * (publico-salix.md). Fuente ÚNICA: el generador de Flux lo copia a Flux, Menu y salixweb.
 * Sin dependencias ni framework: lo llama un `<script>` de Astro o un `useEffect` de React con el
 * elemento raíz de la página, y devuelve la función que lo desmonta.
 *
 *   const soltar = montarPublicoSalix(document.body)   // busca .psx-* adentro
 *   soltar()                                            // saca todos los oyentes
 *
 * Lo que hace, y nada más:
 *   - la barra de progreso de lectura (escrita en el rAF, con `transform`: sin render ni layout);
 *   - la barra se entinta apenas se baja (`.psx-barra--fija`);
 *   - la barra de scroll de la página (`.psx-scroll`): con mouse o trackpad esconde la del navegador
 *     y dibuja una flotante, que arranca debajo de la barra fija, aparece al mover la página o al
 *     acercar el puntero al borde, y se arrastra. No ocupa lugar: no deja carril al costado;
 *   - marca en `<html>` la mitad de abajo de la página (`.psx-abajo`): con eso un producto cuya página
 *     empieza en un color y termina en otro elige el fondo de atrás, el que el navegador muestra en el
 *     rebote al tirar de más (publico-salix.md, «El fondo de atrás»);
 *   - el menú móvil: abre y cierra con la hamburguesa, Escape o tocando un enlace; bloquea el
 *     scroll de atrás, lleva el foco adentro y lo devuelve al botón;
 *   - la cortina del pie: escribe en `--psx-pie-avance` cuánto del pie está destapado (de 0 a 1),
 *     y con eso su contenido va apareciendo; `.psx-pie--visible` cuando ya está casi entero a la
 *     vista. Un pie más alto que la pantalla no va pegado al fondo (`.psx-pie--suelto`);
 *   - el cierre que se acomoda: el último bloque de la página (`.psx-cierre`, con su contenido en
 *     `.psx-cierre-caja`) se achica y se centra a medida que la cortina destapa el pie, para que al
 *     llegar al fondo entre entero entre la barra y el pie en vez de quedar cortado por la barra.
 *     Escribe `--psx-cierre-escala` y `--psx-cierre-corre` en la caja, una vez por cuadro;
 *   - el logo del pie (`.psx-pie-logo`): al destaparse, al pasar el mouse o al tocarlo asoma
 *     «by Salix» (`.psx-pie-firma`) y, con el dedo, late (`.msx--late`: donde no hay hover);
 *   - el selector de idioma (`.psx-idioma`, en el pie y en el menú): abre y cierra la lista, lleva
 *     el foco a la opción activa y lo devuelve al botón. ELEGIR el idioma es de cada producto: el
 *     de React escucha el clic de su opción; uno sin framework, el evento `psx:idioma` que se emite
 *     con `{ idioma }` al tocar una opción habilitada;
 *   - el botón de tema (`.psx-tema`, en el pie): cada toque pasa al modo siguiente (automático, claro,
 *     oscuro) y asoma un instante el nombre del modo. Le pone sus tres íconos, guarda la elección en
 *     `localStorage` bajo la clave de `data-clave` (automático no guarda nada: sigue al aparato),
 *     escribe `data-tema` («claro» u «oscuro») y `data-pref` («auto», «claro» u «oscuro») en `<html>`
 *     y emite `psx:tema` con `{ pref, tema }`. Un producto que aplica el tema por su cuenta (React)
 *     pone `data-solo-avisa` y escucha el evento. El tema ANTES del primer pintado sigue siendo de
 *     cada producto: un script en el `<head>` que lee la misma clave.
 */

const CLASE_FIJA = 'psx-barra--fija'
const CLASE_ABIERTO = 'psx-menu--abierto'
const CLASE_VISIBLE = 'psx-pie--visible'
const CLASE_ABAJO = 'psx-abajo'
const CLASE_SUELTO = 'psx-pie--suelto'
const CLASE_SIN_SCROLL = 'psx-sin-scroll'
const CLASE_ASOMA = 'psx-pie-logo--asoma'
const CLASE_LATE = 'msx--late'
const CLASE_SCROLL_VISIBLE = 'psx-scroll--visible'
const CLASE_SCROLL_ARRASTRA = 'psx-scroll--arrastra'
const CLASE_TEMA_CAMBIA = 'psx-tema-cambia'
const CLASE_TEMA_DICE = 'psx-tema--dice'
/** Lo que se elige en el control de tema: «auto» sigue al aparato. */
type PrefTema = 'auto' | 'claro' | 'oscuro'
/** El orden en que el botón de tema pasa de un modo a otro. */
const MODOS_TEMA: PrefTema[] = ['auto', 'claro', 'oscuro']
/** Cuánto queda a la vista el nombre del modo después de tocar el botón (en ms). */
const NOMBRE_TEMA_SE_VA = 1600
/** Cuándo la pieza dibuja la barra de scroll: la misma condición con la que el CSS esconde la del navegador. */
const CON_SCROLL_PROPIO = '(hover: hover) and (pointer: fine) and (scripting: enabled)'
/** El pulgar de la barra de scroll no baja de este alto (en px), para que siempre se pueda agarrar. */
const PULGAR_MINIMO = 36
/** Cuánto queda a la vista la barra de scroll después del último movimiento (en ms). */
const SCROLL_SE_VA = 900
/** A qué distancia del borde derecho el puntero la hace aparecer (en px). */
const BORDE_SCROLL = 18
/** Qué parte del pie tiene que estar destapada para darlo por «a la vista» (el logo repite su entrada). */
const PIE_A_LA_VISTA = 0.7
/** Lo mismo para un pie suelto, que entra desde abajo como cualquier bloque. */
const PIE_SUELTO_A_LA_VISTA = 0.25
/** Al destaparse el pie, la firma espera a que el nombre termine de entrar. */
const FIRMA_TRAS_ENTRADA = '0.9s'
/** El aire que el cierre conserva contra la barra y contra el pie al acomodarse, en px: en una pantalla baja, el 3 % de su alto. */
const AIRE_CIERRE = 28
const aireCierre = () => Math.min(AIRE_CIERRE, Math.round(window.innerHeight * 0.03))
/** Hasta cuánto se achica el cierre sin que su letra deje de leerse bien. Si ni así entra arriba del pie, el pie va suelto. */
const ESCALA_MINIMA_CIERRE = 0.6

/** Vuelve a arrancar una animación de clase: se saca, se fuerza un cuadro de estilo y se pone. */
function reiniciar(el: Element, clase: string) {
  el.classList.remove(clase)
  void (el as HTMLElement).offsetWidth
  el.classList.add(clase)
}

export function montarPublicoSalix(raiz: ParentNode = document): () => void {
  const progreso = raiz.querySelector<HTMLElement>('.psx-progreso')
  const barra = raiz.querySelector<HTMLElement>('.psx-barra')
  const pie = raiz.querySelector<HTMLElement>('.psx-pie')
  const pieLogo = raiz.querySelector<HTMLElement>('.psx-pie-logo')
  const cierre = raiz.querySelector<HTMLElement>('.psx-cierre')
  const cierreCaja = cierre?.querySelector<HTMLElement>('.psx-cierre-caja') ?? null
  const boton = raiz.querySelector<HTMLButtonElement>('.psx-hamburguesa')
  const menu = boton?.getAttribute('aria-controls')
    ? document.getElementById(boton.getAttribute('aria-controls') as string)
    : null
  const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const soltar: Array<() => void> = []

  // ── Scroll: progreso, barra fija y cortina, una vez por cuadro ──
  let raf = 0
  let ultimoProgreso = -1
  let ultimoAvance = -1
  let pieVisible = false
  let ultimoCierre = ''
  let ultimoAltoPie = ''
  const asomar = (retraso: string) => {
    if (!pieLogo) return
    pieLogo.style.setProperty('--psx-firma-retraso', retraso)
    reiniciar(pieLogo, CLASE_ASOMA)
  }

  // ── La barra de scroll de la página, dibujada por la pieza (publico-salix.css, `.psx-scroll`) ──
  // Va en <body>, fuera de la raíz: es fija y de un gris propio, no depende de los colores del producto.
  let riel: HTMLElement | null = null
  let pulgar: HTMLElement | null = null
  if (barra && window.matchMedia(CON_SCROLL_PROPIO).matches) {
    riel = document.createElement('div')
    riel.className = 'psx-scroll'
    riel.setAttribute('aria-hidden', 'true')
    pulgar = document.createElement('span')
    pulgar.className = 'psx-scroll-pulgar'
    riel.append(pulgar)
    document.body.append(riel)
  }
  let ultimoPulgar = ''
  /** Cuántos px puede recorrer el pulgar: con eso el arrastre se convierte en scroll. */
  let recorridoPulgar = 0
  let arrastrando = false
  let sobreElBorde = false
  let seVa = 0
  const mostrarScroll = () => {
    if (!riel) return
    riel.classList.add(CLASE_SCROLL_VISIBLE)
    window.clearTimeout(seVa)
    seVa = window.setTimeout(() => {
      if (!arrastrando && !sobreElBorde) riel?.classList.remove(CLASE_SCROLL_VISIBLE)
    }, SCROLL_SE_VA)
  }
  const medir = () => {
    raf = 0
    const alto = document.documentElement.scrollHeight
    const max = alto - window.innerHeight
    // El scroll sin el rebote del teléfono: pasado el fondo (o el principio), cuenta como el borde.
    const scroll = Math.min(Math.max(window.scrollY, 0), Math.max(max, 0))
    const p = max > 0 ? scroll / max : 0
    if (progreso && p !== ultimoProgreso) {
      progreso.style.transform = `scaleX(${p})`
      ultimoProgreso = p
    }
    barra?.classList.toggle(CLASE_FIJA, window.scrollY > 12)
    document.documentElement.classList.toggle(CLASE_ABAJO, p > 0.5)
    const altoBarra = barra?.offsetHeight ?? 0
    if (pulgar) {
      // El riel va de la barra fija al borde de abajo. Si la página no tiene scroll, no hay pulgar.
      const largo = window.innerHeight - altoBarra
      const altoPulgar = max > 0 ? Math.max(PULGAR_MINIMO, Math.round((largo * window.innerHeight) / alto)) : 0
      recorridoPulgar = Math.max(0, largo - altoPulgar)
      const y = Math.round((altoBarra + recorridoPulgar * p) * 10) / 10
      const valor = `${altoPulgar}|${y}`
      if (valor !== ultimoPulgar) {
        pulgar.style.setProperty('--psx-scroll-alto', `${altoPulgar}px`)
        pulgar.style.setProperty('--psx-scroll-y', `${y}px`)
        // Aparece cuando la página se mueve, no al cargar.
        if (ultimoPulgar && altoPulgar > 0) mostrarScroll()
        ultimoPulgar = valor
      }
    }
    // Qué parte del pie destapó la cortina (0 si va suelto o no hay pie): con eso se acomoda el cierre.
    let pesoCierre = 0
    if (pie) {
      const altoPie = pie.offsetHeight
      // Un pie más alto que la pantalla no puede ir pegado al fondo: su parte de arriba no se
      // vería nunca. Va suelto, como un pie común. Lo mismo si la página tiene un cierre y, con el
      // pie destapado, no queda lugar para el cierre ni achicado al máximo (pantallas bajas, el
      // teléfono): mejor un pie común que un cierre cortado por la barra o con letra diminuta.
      const minimoCierre = cierreCaja ? cierreCaja.offsetHeight * ESCALA_MINIMA_CIERRE + 2 * aireCierre() : 0
      const cabe = altoPie + minimoCierre <= window.innerHeight - altoBarra
      pie.classList.toggle(CLASE_SUELTO, !cabe)
      // El cierre llena lo que queda arriba de un pie pegado (publico-salix.css, `.psx-cierre`).
      const altoParaElCierre = cabe ? `${altoPie}px` : ''
      if (cierre && altoParaElCierre !== ultimoAltoPie) {
        if (altoParaElCierre) cierre.style.setProperty('--psx-pie-alto', altoParaElCierre)
        else cierre.style.removeProperty('--psx-pie-alto')
        ultimoAltoPie = altoParaElCierre
      }
      // Cuánto del pie quedó a la vista, de 0 a 1: el cuerpo termina donde empieza el pie.
      const aLaVista =
        altoPie > 0 ? Math.min(1, Math.max(0, (scroll + window.innerHeight - (alto - altoPie)) / altoPie)) : 1
      // Con eso aparece su contenido, a medida que la cortina lo destapa. Suelto o con menos
      // movimiento, está entero desde el principio.
      const avance = reducir || !cabe ? 1 : Math.round(aLaVista * 1000) / 1000
      if (cabe && !reducir) pesoCierre = aLaVista
      if (avance !== ultimoAvance) {
        pie.style.setProperty('--psx-pie-avance', String(avance))
        ultimoAvance = avance
      }
      const destapado = reducir || aLaVista >= (cabe ? PIE_A_LA_VISTA : PIE_SUELTO_A_LA_VISTA)
      pie.classList.toggle(CLASE_VISIBLE, destapado)
      if (destapado && !pieVisible) asomar(FIRMA_TRAS_ENTRADA)
      pieVisible = destapado
    }
    if (cierre && cierreCaja) {
      // El cierre ocupa la pantalla mientras el pie está tapado. Cuando el pie queda destapado del todo,
      // lo que se ve del cierre es la franja entre la barra y el pie: su contenido va hacia el tamaño y
      // el lugar que tiene que tener AL FINAL, en la misma proporción en que el pie se destapa. La cuenta
      // usa solo medidas quietas (altos y cuánto se destapó), nunca dónde está cada cosa en este cuadro:
      // medir posiciones en cada cuadro hacía temblar el cierre al bajar de golpe con el dedo y con el
      // rebote del teléfono (Sal, 2026-11-19: «queda como vibrando»).
      let escala = 1
      let corre = 0
      const altoCaja = cierreCaja.offsetHeight
      if (pesoCierre > 0 && altoCaja > 0 && pie) {
        const altoCierre = cierre.offsetHeight
        const altoPie = pie.offsetHeight
        const franja = window.innerHeight - altoBarra - altoPie
        // El aire nunca pide más que el que el cierre ya tenía alrededor de su contenido.
        const margenArriba = cierreCaja.offsetTop
        const margenAbajo = altoCierre - margenArriba - altoCaja
        const aire = Math.max(0, Math.min(aireCierre(), margenArriba, margenAbajo))
        const objetivo = Math.min(1, Math.max(ESCALA_MINIMA_CIERRE, (franja - 2 * aire) / altoCaja))
        // Al final el cierre termina donde empieza el pie: de ahí sale dónde queda el centro de su contenido.
        const centroDeLaCaja = window.innerHeight - altoPie - altoCierre + margenArriba + altoCaja / 2
        const alCentro = altoBarra + franja / 2 - centroDeLaCaja
        escala = 1 + pesoCierre * (objetivo - 1)
        corre = Math.abs(alCentro) < 1 ? 0 : pesoCierre * alCentro
      }
      const escalaRedonda = Math.round(escala * 1000) / 1000
      const correRedondo = Math.round(corre * 10) / 10
      const valor = `${escalaRedonda}|${correRedondo}`
      if (valor !== ultimoCierre) {
        cierreCaja.style.setProperty('--psx-cierre-escala', String(escalaRedonda))
        cierreCaja.style.setProperty('--psx-cierre-corre', `${correRedondo}px`)
        ultimoCierre = valor
      }
    }
  }
  const pedir = () => {
    if (!raf) raf = requestAnimationFrame(medir)
  }
  medir()
  window.addEventListener('scroll', pedir, { passive: true })
  window.addEventListener('resize', pedir)
  if (riel && pulgar) {
    const elRiel = riel
    const elPulgar = pulgar
    let inicioY = 0
    let inicioScroll = 0
    // Acercar el puntero al borde derecho la muestra; al alejarlo, se va sola.
    const alMover = (e: PointerEvent) => {
      const cerca = e.clientX >= window.innerWidth - BORDE_SCROLL
      if (cerca === sobreElBorde) return
      sobreElBorde = cerca
      mostrarScroll()
    }
    const alAgarrar = (e: PointerEvent) => {
      if (e.button !== 0) return
      e.preventDefault() // sin seleccionar texto mientras se arrastra
      arrastrando = true
      inicioY = e.clientY
      inicioScroll = window.scrollY
      elPulgar.setPointerCapture(e.pointerId)
      elRiel.classList.add(CLASE_SCROLL_ARRASTRA)
    }
    const alArrastrar = (e: PointerEvent) => {
      if (!arrastrando || recorridoPulgar <= 0) return
      const max = document.documentElement.scrollHeight - window.innerHeight
      // Sin suavizado, aunque la página lo tenga: el pulgar va con el puntero.
      window.scrollTo({ top: inicioScroll + (e.clientY - inicioY) * (max / recorridoPulgar), behavior: 'instant' as ScrollBehavior })
    }
    const alSoltar = () => {
      if (!arrastrando) return
      arrastrando = false
      elRiel.classList.remove(CLASE_SCROLL_ARRASTRA)
      mostrarScroll()
    }
    // El alto de la página cambia sin que nadie mueva el scroll (una imagen que carga, algo que se despliega).
    const alCrecer = 'ResizeObserver' in window ? new ResizeObserver(pedir) : null
    alCrecer?.observe(document.body)
    window.addEventListener('pointermove', alMover, { passive: true })
    elPulgar.addEventListener('pointerdown', alAgarrar)
    elPulgar.addEventListener('pointermove', alArrastrar)
    elPulgar.addEventListener('pointerup', alSoltar)
    elPulgar.addEventListener('pointercancel', alSoltar)
    soltar.push(() => {
      alCrecer?.disconnect()
      window.clearTimeout(seVa)
      window.removeEventListener('pointermove', alMover)
      elRiel.remove()
    })
  }
  soltar.push(() => {
    cancelAnimationFrame(raf)
    window.removeEventListener('scroll', pedir)
    window.removeEventListener('resize', pedir)
    pie?.style.removeProperty('--psx-pie-avance')
    pie?.classList.remove(CLASE_SUELTO)
    document.documentElement.classList.remove(CLASE_ABAJO)
    cierreCaja?.style.removeProperty('--psx-cierre-escala')
    cierreCaja?.style.removeProperty('--psx-cierre-corre')
    cierre?.style.removeProperty('--psx-pie-alto')
  })

  // ── El logo del pie: asoma la firma al pasar o tocar; con el dedo, además late ──
  if (pieLogo) {
    const alEntrar = (e: PointerEvent) => {
      asomar('0s')
      const marca = pieLogo.querySelector('.msx')
      if (e.pointerType !== 'mouse' && marca && !reducir) reiniciar(marca, CLASE_LATE)
    }
    const alTerminar = (e: AnimationEvent) => {
      if (e.animationName === 'msx-latido') pieLogo.querySelector('.msx')?.classList.remove(CLASE_LATE)
      else if (e.animationName.startsWith('psx-firma')) pieLogo.classList.remove(CLASE_ASOMA)
    }
    pieLogo.addEventListener('pointerenter', alEntrar)
    pieLogo.addEventListener('animationend', alTerminar)
    soltar.push(() => {
      pieLogo.removeEventListener('pointerenter', alEntrar)
      pieLogo.removeEventListener('animationend', alTerminar)
    })
  }

  // ── Menú móvil ──
  if (boton && menu) {
    // Lo que se puede enfocar: nada de una lista cerrada (la del idioma) ni un botón deshabilitado.
    const enlaces = () =>
      Array.from(menu.querySelectorAll<HTMLElement>('a, button')).filter(
        (el) => !el.closest('[hidden]') && !(el as HTMLButtonElement).disabled,
      )
    const abierto = () => boton.getAttribute('aria-expanded') === 'true'
    const poner = (abrir: boolean, devolverFoco = true) => {
      boton.setAttribute('aria-expanded', String(abrir))
      menu.classList.toggle(CLASE_ABIERTO, abrir)
      menu.toggleAttribute('inert', !abrir)
      menu.setAttribute('aria-hidden', String(!abrir))
      document.documentElement.classList.toggle(CLASE_SIN_SCROLL, abrir)
      if (abrir) enlaces()[0]?.focus({ preventScroll: true })
      else if (devolverFoco && menu.contains(document.activeElement)) boton.focus({ preventScroll: true })
    }
    poner(false, false)
    const alBoton = () => poner(!abierto())
    const alTecla = (e: KeyboardEvent) => {
      if (!abierto()) return
      if (e.key === 'Escape') {
        e.preventDefault()
        poner(false)
        return
      }
      // El foco no sale del menú mientras está abierto (el botón de cerrar es el de la barra).
      if (e.key === 'Tab') {
        const lista = [boton, ...enlaces()]
        const i = lista.indexOf(document.activeElement as HTMLElement)
        const siguiente = e.shiftKey ? (i <= 0 ? lista.length - 1 : i - 1) : i === lista.length - 1 ? 0 : i + 1
        e.preventDefault()
        lista[siguiente]?.focus()
      }
    }
    const alEnlace = (e: Event) => {
      if ((e.target as HTMLElement).closest('a')) poner(false, false)
    }
    // Si la ventana se agranda hasta mostrar los enlaces en la barra, el menú se cierra solo.
    const ancho = window.matchMedia('(min-width: 1024px)')
    const alAncho = () => ancho.matches && abierto() && poner(false, false)
    boton.addEventListener('click', alBoton)
    document.addEventListener('keydown', alTecla)
    menu.addEventListener('click', alEnlace)
    ancho.addEventListener('change', alAncho)
    soltar.push(() => {
      boton.removeEventListener('click', alBoton)
      document.removeEventListener('keydown', alTecla)
      menu.removeEventListener('click', alEnlace)
      ancho.removeEventListener('change', alAncho)
      document.documentElement.classList.remove(CLASE_SIN_SCROLL)
    })
  }

  // ── Idioma ──
  raiz.querySelectorAll<HTMLElement>('.psx-idioma').forEach((caja) => {
    const botonIdioma = caja.querySelector<HTMLButtonElement>('.psx-idioma-boton')
    const lista = caja.querySelector<HTMLElement>('.psx-idioma-lista')
    if (!botonIdioma || !lista) return
    const abierta = () => botonIdioma.getAttribute('aria-expanded') === 'true'
    const poner = (abrir: boolean, devolverFoco = false) => {
      botonIdioma.setAttribute('aria-expanded', String(abrir))
      lista.hidden = !abrir
      if (abrir) {
        const activa =
          lista.querySelector<HTMLElement>('button[aria-pressed="true"]') ??
          lista.querySelector<HTMLElement>('button:not(:disabled)')
        activa?.focus({ preventScroll: true })
      } else if (devolverFoco) botonIdioma.focus({ preventScroll: true })
    }
    poner(false)
    const alBoton = () => poner(!abierta())
    // Escape cierra la lista y NO el menú del teléfono que la contiene: se frena acá.
    const alTecla = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || !abierta()) return
      e.preventDefault()
      e.stopPropagation()
      poner(false, true)
    }
    const alOpcion = (e: Event) => {
      const opcion = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-idioma]')
      if (!opcion || opcion.disabled) return
      caja.dispatchEvent(new CustomEvent('psx:idioma', { bubbles: true, detail: { idioma: opcion.dataset.idioma } }))
      poner(false, true)
    }
    const alAfuera = (e: PointerEvent) => {
      if (abierta() && !caja.contains(e.target as Node)) poner(false)
    }
    const alSalirFoco = (e: FocusEvent) => {
      if (abierta() && e.relatedTarget && !caja.contains(e.relatedTarget as Node)) poner(false)
    }
    botonIdioma.addEventListener('click', alBoton)
    caja.addEventListener('keydown', alTecla)
    lista.addEventListener('click', alOpcion)
    caja.addEventListener('focusout', alSalirFoco)
    document.addEventListener('pointerdown', alAfuera)
    soltar.push(() => {
      botonIdioma.removeEventListener('click', alBoton)
      caja.removeEventListener('keydown', alTecla)
      lista.removeEventListener('click', alOpcion)
      caja.removeEventListener('focusout', alSalirFoco)
      document.removeEventListener('pointerdown', alAfuera)
    })
  })

  // ── Tema ──
  raiz.querySelectorAll<HTMLElement>('.psx-tema').forEach((boton) => {
    const clave = boton.dataset.clave
    const soloAvisa = boton.hasAttribute('data-solo-avisa')
    const html = document.documentElement
    const sistemaOscuro = window.matchMedia('(prefers-color-scheme: dark)')
    // Los tres íconos los pone la pieza (el producto escribe el botón vacío, con los nombres).
    if (!boton.querySelector('.psx-tema-icono')) {
      for (const modo of MODOS_TEMA) {
        const icono = document.createElement('span')
        icono.className = 'psx-tema-icono'
        icono.dataset.de = modo
        icono.setAttribute('aria-hidden', 'true')
        boton.appendChild(icono)
      }
    }
    const leer = (): PrefTema => {
      try {
        const guardado = clave ? localStorage.getItem(clave) : null
        return guardado === 'claro' || guardado === 'oscuro' ? guardado : 'auto'
      } catch {
        return 'auto'
      }
    }
    let pref = leer()
    let relojNombre = 0
    const aplicar = (avisar: boolean) => {
      const tema = pref === 'auto' ? (sistemaOscuro.matches ? 'oscuro' : 'claro') : pref
      const nombre = boton.dataset[pref] ?? pref
      boton.dataset.pref = pref
      boton.dataset.ahora = nombre
      boton.setAttribute('aria-label', boton.dataset.rotulo ? `${boton.dataset.rotulo}: ${nombre}` : nombre)
      if (!soloAvisa) {
        html.setAttribute('data-tema', tema)
        html.setAttribute('data-pref', pref)
      }
      if (avisar) boton.dispatchEvent(new CustomEvent('psx:tema', { bubbles: true, detail: { pref, tema } }))
    }
    aplicar(false)
    const alToque = () => {
      // Cada toque pasa al modo siguiente: automático, claro, oscuro, y de vuelta.
      pref = MODOS_TEMA[(MODOS_TEMA.indexOf(pref) + 1) % MODOS_TEMA.length]
      try {
        if (!clave) throw new Error('sin clave')
        if (pref === 'auto') localStorage.removeItem(clave)
        else localStorage.setItem(clave, pref)
      } catch {
        // Sin almacenamiento (modo privado estricto) la elección vale hasta salir de la página.
      }
      // El nombre del modo asoma un instante: con un solo ícono no se ven las opciones.
      boton.classList.add(CLASE_TEMA_DICE)
      window.clearTimeout(relojNombre)
      relojNombre = window.setTimeout(() => boton.classList.remove(CLASE_TEMA_DICE), NOMBRE_TEMA_SE_VA)
      // Toda la página cambia de una vez, fundida, si el navegador sabe hacerlo.
      const doc = document as Document & { startViewTransition?: (cambio: () => void) => { finished: Promise<void> } }
      if (soloAvisa || !doc.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        aplicar(true)
        return
      }
      html.classList.add(CLASE_TEMA_CAMBIA)
      doc
        .startViewTransition(() => aplicar(true))
        .finished.catch(() => undefined)
        .then(() => html.classList.remove(CLASE_TEMA_CAMBIA))
    }
    // En automático, si el aparato cambia de claro a oscuro, la página lo sigue.
    const alSistema = () => pref === 'auto' && aplicar(true)
    boton.addEventListener('click', alToque)
    sistemaOscuro.addEventListener('change', alSistema)
    soltar.push(() => {
      boton.removeEventListener('click', alToque)
      sistemaOscuro.removeEventListener('change', alSistema)
      window.clearTimeout(relojNombre)
    })
  })

  return () => soltar.forEach((f) => f())
}
