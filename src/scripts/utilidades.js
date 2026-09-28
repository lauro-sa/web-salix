// ============================================================
// utilidades.js — Funciones compartidas del sitio
// Todas las funciones y variables en español
// ============================================================

/**
 * Toggle de tema: sistema → claro → oscuro → sistema.
 * Por defecto respeta la preferencia del sistema operativo.
 * Guarda la eleccion del usuario en localStorage.
 */
export function iniciarToggleTema(idBoton, claveStorage = 'salix-tema') {
  const raiz  = document.documentElement;
  const boton = document.getElementById(idBoton);
  if (!boton) return;

  var pref = localStorage.getItem(claveStorage) || 'sistema';

  function temaDelSistema() {
    return window.matchMedia('(prefers-color-scheme:dark)').matches ? 'oscuro' : 'claro';
  }

  function aplicar(p) {
    pref = p;
    var tema = p === 'sistema' ? temaDelSistema() : p;
    raiz.setAttribute('data-tema', tema);
    raiz.setAttribute('data-pref', p);
    raiz.style.colorScheme = tema === 'oscuro' ? 'dark' : 'light';
  }

  aplicar(pref);

  // Ciclo: sistema → claro → oscuro → sistema
  boton.addEventListener('click', () => {
    var siguiente = pref === 'sistema' ? 'claro' : pref === 'claro' ? 'oscuro' : 'sistema';
    localStorage.setItem(claveStorage, siguiente);
    aplicar(siguiente);
  });

  // Reaccionar si cambia el tema del OS mientras esta en modo sistema
  window.matchMedia('(prefers-color-scheme:dark)').addEventListener('change', () => {
    if (pref === 'sistema') aplicar('sistema');
  });
}

/**
 * Smooth scroll a secciones con offset para la nav fija.
 */
export function iniciarSmoothScroll(offsetNav = 80) {
  document.querySelectorAll('a[href^="#"], a[href^="/#"]').forEach((enlace) => {
    enlace.addEventListener('click', (e) => {
      let href = enlace.getAttribute('href');
      // Manejar links tipo "/#seccion" (desde otras paginas)
      if (href.startsWith('/#')) href = href.slice(1);

      const destino = document.querySelector(href);
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
  // Pre-reservar altura de todos los typewriters al inicio
  document.querySelectorAll('.typewriter[data-texto]').forEach((el) => {
    const texto = el.getAttribute('data-texto');
    if (!texto) return;
    el.textContent = texto;
    el.style.minHeight = el.offsetHeight + 'px';
    el.textContent = '';
  });

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
