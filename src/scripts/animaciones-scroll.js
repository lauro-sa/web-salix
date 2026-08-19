// ============================================================
// animaciones-scroll.js — Animaciones vinculadas al scroll
//
// Usa GSAP + ScrollTrigger para armar/desarmar al hacer scroll.
// Scroll nativo del navegador.
// Timings lentos y suaves para un efecto premium.
//
// Todas las funciones y variables en español.
// ============================================================
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Easing personalizado — mas suave que los defaults
const EASE_ENTRADA = 'power2.out';
const EASE_SALIDA  = 'power1.inOut';

/**
 * Animacion de entrada del Hero.
 * Entrada lenta y cinematografica al cargar.
 * Al scrollear se desvanece suavemente con parallax.
 */
function animarHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const marca     = hero.querySelector('.hero-marca');
  const badge     = hero.querySelector('.hero-badge');
  const lineas    = hero.querySelectorAll('.linea-titulo');
  const sub       = hero.querySelector('.hero-subtitulo');
  const botones   = hero.querySelector('.hero-botones');
  const scrollInd = hero.querySelector('.hero-scroll');

  // Estado inicial: todo invisible, desplazado
  const elementosEntrada = [marca, badge, ...lineas, sub, botones, scrollInd].filter(Boolean);
  gsap.set(elementosEntrada, { opacity: 0, y: 25 });

  // Timeline de entrada — delay inicial para que cargue la pagina
  const tlEntrada = gsap.timeline({ delay: 0.4 });

  // Entrada del logo — lenta y suave
  if (marca) {
    tlEntrada.to(marca, {
      opacity: 1, y: 0,
      duration: 1.2,
      ease: EASE_ENTRADA,
    });
  }

  // Badge — aparece mientras el logo termina
  if (badge) {
    tlEntrada.to(badge, {
      opacity: 1, y: 0,
      duration: 1,
      ease: EASE_ENTRADA,
    }, '-=0.7');
  }

  // Lineas del titulo — cada una entra con un overlap generoso
  lineas.forEach((linea, i) => {
    tlEntrada.to(linea, {
      opacity: 1, y: 0,
      duration: 1.2,
      ease: 'power3.out',
    }, i === 0 ? '-=0.5' : '-=0.9');
  });

  // Subtitulo — entra suave mientras el titulo termina
  if (sub) {
    tlEntrada.to(sub, {
      opacity: 1, y: 0,
      duration: 1,
      ease: EASE_ENTRADA,
    }, '-=0.7');
  }

  // Botones — ultimos en entrar
  if (botones) {
    tlEntrada.to(botones, {
      opacity: 1, y: 0,
      duration: 1,
      ease: EASE_ENTRADA,
    }, '-=0.6');
  }

  // Indicador de scroll
  if (scrollInd) {
    tlEntrada.to(scrollInd, {
      opacity: 1, y: 0,
      duration: 0.8,
      ease: EASE_ENTRADA,
    }, '-=0.4');
  }

  // Parallax al scrollear: el hero se desvanece y sube suavemente
  // Usamos scrub para que este vinculado 1:1 al scroll
  const contenidoHero = hero.querySelector('.hero-marca')?.parentElement || hero;
  const elementoParallax = contenidoHero.parentElement || contenidoHero;

  gsap.to(elementoParallax, {
    opacity: 0,
    y: -60,
    scale: 0.97,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom 30%',
      scrub: 0.8,   // scrub suave con lag de 0.8s
    },
  });
}

/**
 * Anima los encabezados de seccion.
 * Cada hijo (etiqueta, titulo, subtitulo) entra con stagger lento.
 */
function animarEncabezados() {
  document.querySelectorAll('.encabezado-seccion').forEach((encabezado) => {
    const hijos = Array.from(encabezado.children);
    if (!hijos.length) return;

    gsap.set(hijos, { opacity: 0, y: 35 });

    ScrollTrigger.create({
      trigger: encabezado,
      start: 'top 82%',
      onEnter: () => {
        gsap.to(hijos, {
          opacity: 1, y: 0,
          duration: 1.1,
          stagger: 0.18,
          ease: EASE_ENTRADA,
        });
      },
      onLeaveBack: () => {
        gsap.to(hijos, {
          opacity: 0, y: 35,
          duration: 0.7,
          stagger: 0.06,
          ease: EASE_SALIDA,
        });
      },
    });
  });
}

/**
 * Anima cards y elementos de grilla.
 * Entran con stagger lento, salen al subir.
 */
function animarCards() {
  const selectoresCards = [
    '.card-producto',
    '.item-feature',
    '.card-plan',
    '.card-precio',
    '.tarjeta-testimonio',
    '.card-feature',
    '.card-servicio',
    '.paso-card',
    '.precio-card',
  ];

  selectoresCards.forEach((selector) => {
    // Marcar para no procesar dos veces
    document.querySelectorAll(selector).forEach((card) => {
      if (card.dataset.gsap) return;
      card.dataset.gsap = '1';
    });

    // Agrupar cards por contenedor padre
    const padres = new Map();
    document.querySelectorAll(selector).forEach((card) => {
      const padre = card.parentElement;
      if (!padres.has(padre)) padres.set(padre, []);
      padres.get(padre).push(card);
    });

    padres.forEach((cards, padre) => {
      gsap.set(cards, { opacity: 0, y: 40 });

      ScrollTrigger.create({
        trigger: padre,
        start: 'top 82%',
        onEnter: () => {
          gsap.to(cards, {
            opacity: 1, y: 0,
            duration: 1,
            stagger: 0.12,
            ease: EASE_ENTRADA,
          });
        },
        onLeaveBack: () => {
          gsap.to(cards, {
            opacity: 0, y: 40,
            duration: 0.6,
            stagger: 0.05,
            ease: EASE_SALIDA,
          });
        },
      });
    });
  });
}

/**
 * Anima el carrusel de tecnologias.
 */
function animarCarrusel() {
  const carrusel = document.querySelector('.carrusel-tech');
  if (!carrusel) return;

  gsap.set(carrusel, { opacity: 0, y: 30 });

  ScrollTrigger.create({
    trigger: carrusel,
    start: 'top 88%',
    onEnter: () => {
      gsap.to(carrusel, {
        opacity: 1, y: 0,
        duration: 1.2,
        ease: EASE_ENTRADA,
      });
    },
    onLeaveBack: () => {
      gsap.to(carrusel, {
        opacity: 0, y: 30,
        duration: 0.6,
        ease: EASE_SALIDA,
      });
    },
  });
}

/**
 * Anima el banner CTA.
 * Entra con scale suave.
 */
function animarCTA() {
  const wrapper = document.querySelector('.cta-fondo');
  if (!wrapper) return;

  const contenido = wrapper.querySelector('.cta-contenido') || wrapper;

  gsap.set(contenido, { opacity: 0, scale: 0.95, y: 25 });

  ScrollTrigger.create({
    trigger: wrapper,
    start: 'top 80%',
    onEnter: () => {
      gsap.to(contenido, {
        opacity: 1, scale: 1, y: 0,
        duration: 1.3,
        ease: EASE_ENTRADA,
      });
    },
    onLeaveBack: () => {
      gsap.to(contenido, {
        opacity: 0, scale: 0.95, y: 25,
        duration: 0.7,
        ease: EASE_SALIDA,
      });
    },
  });
}

/**
 * Anima la seccion de contacto.
 */
function animarContacto() {
  const contacto = document.querySelector('#contacto');
  if (!contacto) return;

  // Buscar elementos dentro del contacto
  const hijos = contacto.querySelectorAll('.etiqueta, .titulo-seccion, .typewriter, .subtitulo, [style*="display:flex"]');
  if (!hijos.length) return;

  gsap.set(hijos, { opacity: 0, y: 25 });

  ScrollTrigger.create({
    trigger: contacto,
    start: 'top 80%',
    onEnter: () => {
      gsap.to(hijos, {
        opacity: 1, y: 0,
        duration: 1,
        stagger: 0.15,
        ease: EASE_ENTRADA,
      });
    },
    onLeaveBack: () => {
      gsap.to(hijos, {
        opacity: 0, y: 25,
        duration: 0.6,
        stagger: 0.05,
        ease: EASE_SALIDA,
      });
    },
  });
}

/**
 * Anima el footer.
 * Entra suavemente al llegar al final.
 */
function animarFooter() {
  const footer = document.querySelector('.footer');
  if (!footer) return;

  gsap.set(footer, { opacity: 0 });

  ScrollTrigger.create({
    trigger: footer,
    start: 'top 95%',
    onEnter: () => {
      gsap.to(footer, {
        opacity: 1,
        duration: 1,
        ease: EASE_ENTRADA,
      });
    },
    onLeaveBack: () => {
      gsap.to(footer, {
        opacity: 0,
        duration: 0.5,
        ease: EASE_SALIDA,
      });
    },
  });
}

/**
 * Funcion principal — inicializa todas las animaciones.
 */
export function iniciarAnimacionesScroll() {
  // Quitar clases CSS de aparicion basica para que GSAP controle todo
  document.querySelectorAll('.aparecer, .aparecer-izq, .aparecer-der, .aparecer-escala').forEach((el) => {
    el.classList.remove('aparecer', 'aparecer-izq', 'aparecer-der', 'aparecer-escala');
    el.classList.remove('delay-1', 'delay-2', 'delay-3', 'delay-4', 'delay-5', 'delay-6', 'delay-7');
  });

  // Defaults globales de GSAP — mas lento por defecto
  gsap.defaults({
    duration: 1,
    ease: EASE_ENTRADA,
  });

  // Iniciar cada seccion
  animarHero();
  animarEncabezados();
  animarCards();
  animarCarrusel();
  animarCTA();
  animarContacto();
  animarFooter();

  // Refresh despues de cargar imagenes/contenido
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
}
