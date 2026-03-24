// ============================================================
// utilidades.js — Funciones compartidas del sitio
// ============================================================

/**
 * Inicializa el toggle de tema claro/oscuro.
 * Lee y guarda la preferencia en localStorage.
 * @param {string} idBoton — id del botón de toggle
 * @param {string} claveStorage — clave en localStorage para guardar la preferencia
 */
export function iniciarToggleTema(idBoton, claveStorage = 'salix-tema') {
  const raiz  = document.documentElement;
  const boton = document.getElementById(idBoton);
  if (!boton) return;

  // Aplicar tema guardado (o claro por defecto)
  raiz.setAttribute('data-tema', localStorage.getItem(claveStorage) || 'claro');

  boton.addEventListener('click', () => {
    const temaActual = raiz.getAttribute('data-tema');
    const nuevoTema  = temaActual === 'claro' ? 'oscuro' : 'claro';
    raiz.setAttribute('data-tema', nuevoTema);
    localStorage.setItem(claveStorage, nuevoTema);
  });
}

/**
 * Inicializa el menú mobile (hamburguesa + overlay).
 * @param {string} idBoton  — id del botón hamburguesa
 * @param {string} idMenu   — id del overlay del menú
 * @param {string} claseLinks — selector de los links del menú
 */
export function iniciarMenuMobile(idBoton, idMenu, claseLinks = '.link-menu') {
  const boton = document.getElementById(idBoton);
  const menu  = document.getElementById(idMenu);
  if (!boton || !menu) return;

  let estaAbierto = false;

  function alternarMenu() {
    estaAbierto = !estaAbierto;
    boton.classList.toggle('on', estaAbierto);
    menu.classList.toggle('on',  estaAbierto);
    boton.setAttribute('aria-expanded', estaAbierto);
    document.body.style.overflow = estaAbierto ? 'hidden' : '';
  }

  boton.addEventListener('click', alternarMenu);

  // Cerrar al hacer clic en un link del menú
  document.querySelectorAll(claseLinks).forEach((link) => {
    link.addEventListener('click', () => {
      if (estaAbierto) alternarMenu();
    });
  });
}

/**
 * Inicializa la barra de progreso de scroll.
 * @param {string} idBarra — id del elemento de la barra
 */
export function iniciarBarraProgreso(idBarra) {
  const barra = document.getElementById(idBarra);
  if (!barra) return;

  window.addEventListener('scroll', () => {
    const scrollTotal    = document.documentElement.scrollHeight - window.innerHeight;
    const porcentaje     = (window.scrollY / scrollTotal) * 100;
    barra.style.width    = porcentaje + '%';
  }, { passive: true });
}

/**
 * Inicializa el fondo de la nav al hacer scroll.
 * @param {string} idNav — id del elemento nav
 * @param {number} umbral — px de scroll para activar el fondo (default: 40)
 */
export function iniciarNavScroll(idNav, umbral = 40) {
  const nav = document.getElementById(idNav);
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('fijo', window.scrollY > umbral);
  }, { passive: true });
}

/**
 * Smooth scroll a una sección con offset para la nav fija.
 * @param {number} offsetNav — altura de la nav en px (default: 76)
 */
export function iniciarSmoothScroll(offsetNav = 76) {
  document.querySelectorAll('a[href^="#"]').forEach((enlace) => {
    enlace.addEventListener('click', (e) => {
      const destino = document.querySelector(enlace.getAttribute('href'));
      if (destino) {
        e.preventDefault();
        const posicion = destino.getBoundingClientRect().top + window.scrollY - offsetNav;
        window.scrollTo({ top: posicion, behavior: 'smooth' });
      }
    });
  });
}

/**
 * Activa la animación de íconos SVG (stroke-draw) cuando entran en viewport.
 * Agrega la clase 'dibujado' al elemento padre cuando es visible.
 * @param {string} selector — selector de los elementos a observar
 */
export function iniciarAnimacionIconos(selector = '.fila-producto, .item-feature') {
  const observador = new IntersectionObserver((entradas, obs) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('dibujado');
        obs.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(selector).forEach((el) => observador.observe(el));
}

/**
 * Efecto typewriter — el texto se escribe letra a letra al entrar en viewport.
 * El texto completo debe estar en el atributo data-texto del elemento.
 * @param {number} velocidad — ms entre cada carácter (default: 20ms)
 */
export function iniciarTypewriter(velocidad = 20) {
  function escribir(elemento) {
    if (elemento._escrito) return;
    elemento._escrito = true;

    const texto = elemento.getAttribute('data-texto');
    if (!texto) return;

    elemento.textContent = '';
    elemento.classList.add('escribiendo');

    let indice = 0;
    const intervalo = setInterval(() => {
      elemento.textContent = texto.slice(0, ++indice);
      if (indice >= texto.length) {
        clearInterval(intervalo);
        elemento.classList.remove('escribiendo');
      }
    }, velocidad);
  }

  const observador = new IntersectionObserver((entradas, obs) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        // Pequeño delay para que el fade-in termine antes de escribir
        setTimeout(() => escribir(entrada.target), 300);
        obs.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.typewriter[data-texto]').forEach((el) => observador.observe(el));
}
