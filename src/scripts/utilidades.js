// ============================================================
// utilidades.js — Funciones compartidas del sitio
// Todas las funciones y variables en español
// ============================================================

/**
 * Toggle de tema claro/oscuro.
 * Guarda la preferencia en localStorage.
 */
export function iniciarToggleTema(idBoton, claveStorage = 'salix-tema') {
  const raiz  = document.documentElement;
  const boton = document.getElementById(idBoton);
  if (!boton) return;

  raiz.setAttribute('data-tema', localStorage.getItem(claveStorage) || 'claro');

  boton.addEventListener('click', () => {
    const temaActual = raiz.getAttribute('data-tema');
    const nuevoTema  = temaActual === 'claro' ? 'oscuro' : 'claro';
    raiz.setAttribute('data-tema', nuevoTema);
    localStorage.setItem(claveStorage, nuevoTema);
  });
}

/**
 * Menu mobile (hamburguesa + overlay fullscreen).
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

  document.querySelectorAll(claseLinks).forEach((link) => {
    link.addEventListener('click', () => {
      if (estaAbierto) alternarMenu();
    });
  });
}

/**
 * Barra de progreso de scroll en la parte superior.
 */
export function iniciarBarraProgreso(idBarra) {
  const barra = document.getElementById(idBarra);
  if (!barra) return;

  window.addEventListener('scroll', () => {
    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    const porcentaje  = (window.scrollY / scrollTotal) * 100;
    barra.style.width = porcentaje + '%';
  }, { passive: true });
}

/**
 * Agrega fondo con blur al nav cuando hay scroll.
 */
export function iniciarNavScroll(idNav, umbral = 40) {
  const nav = document.getElementById(idNav);
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('fijo', window.scrollY > umbral);
  }, { passive: true });
}

/**
 * Smooth scroll a secciones con offset para la nav fija.
 */
export function iniciarSmoothScroll(offsetNav = 80) {
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
 * Animacion de iconos SVG (stroke-draw) cuando entran en el viewport.
 * Agrega la clase 'dibujado' al elemento padre.
 */
export function iniciarAnimacionIconos(selector = '.item-producto, .item-feature') {
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
 * El texto completo esta en el atributo data-texto.
 */
export function iniciarTypewriter(velocidad = 18) {
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
        setTimeout(() => escribir(entrada.target), 300);
        obs.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.typewriter[data-texto]').forEach((el) => observador.observe(el));
}

/**
 * Animaciones de aparicion al hacer scroll.
 * Observa elementos con clases .aparecer, .aparecer-izq, .aparecer-der, .aparecer-escala
 * y les agrega la clase 'visible' cuando entran en el viewport.
 */
export function iniciarApariciones() {
  const selectores = '.aparecer, .aparecer-izq, .aparecer-der, .aparecer-escala';

  const observador = new IntersectionObserver((entradas, obs) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visible');
        obs.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll(selectores).forEach((el) => observador.observe(el));
}
