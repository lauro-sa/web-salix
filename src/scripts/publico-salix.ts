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
 *   - el menú móvil: abre y cierra con la hamburguesa, Escape o tocando un enlace; bloquea el
 *     scroll de atrás, lleva el foco adentro y lo devuelve al botón;
 *   - la cortina del pie: `.psx-pie--visible` cuando el final de la página lo destapa;
 *   - el selector de idioma (`.psx-idioma`, en el pie y en el menú): abre y cierra la lista, lleva
 *     el foco a la opción activa y lo devuelve al botón. ELEGIR el idioma es de cada producto: el
 *     de React escucha el clic de su opción; uno sin framework, el evento `psx:idioma` que se emite
 *     con `{ idioma }` al tocar una opción habilitada.
 */

const CLASE_FIJA = 'psx-barra--fija'
const CLASE_ABIERTO = 'psx-menu--abierto'
const CLASE_VISIBLE = 'psx-pie--visible'
const CLASE_SIN_SCROLL = 'psx-sin-scroll'

export function montarPublicoSalix(raiz: ParentNode = document): () => void {
  const progreso = raiz.querySelector<HTMLElement>('.psx-progreso')
  const barra = raiz.querySelector<HTMLElement>('.psx-barra')
  const pie = raiz.querySelector<HTMLElement>('.psx-pie')
  const boton = raiz.querySelector<HTMLButtonElement>('.psx-hamburguesa')
  const menu = boton?.getAttribute('aria-controls')
    ? document.getElementById(boton.getAttribute('aria-controls') as string)
    : null
  const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const soltar: Array<() => void> = []

  // ── Scroll: progreso, barra fija y cortina, una vez por cuadro ──
  let raf = 0
  let ultimoProgreso = -1
  const medir = () => {
    raf = 0
    const alto = document.documentElement.scrollHeight
    const max = alto - window.innerHeight
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
    if (progreso && p !== ultimoProgreso) {
      progreso.style.transform = `scaleX(${p})`
      ultimoProgreso = p
    }
    barra?.classList.toggle(CLASE_FIJA, window.scrollY > 12)
    if (pie) {
      const destapado = reducir || window.scrollY + window.innerHeight >= alto - pie.offsetHeight * 0.3
      pie.classList.toggle(CLASE_VISIBLE, destapado)
    }
  }
  const pedir = () => {
    if (!raf) raf = requestAnimationFrame(medir)
  }
  medir()
  window.addEventListener('scroll', pedir, { passive: true })
  window.addEventListener('resize', pedir)
  soltar.push(() => {
    cancelAnimationFrame(raf)
    window.removeEventListener('scroll', pedir)
    window.removeEventListener('resize', pedir)
  })

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

  return () => soltar.forEach((f) => f())
}
