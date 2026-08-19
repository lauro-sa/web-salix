// ============================================================
// firma-stian.js — Web Component universal "S7ian Code"
// Uso: <firma-stian enlace="https://stiancode.dev" logo="/logo-claro.png"></firma-stian>
// Hover: "S7ian Code" explota letra por letra → "Developer" nace del centro
// Funciona en Astro, React, Vue, vanilla HTML, etc.
// ============================================================
class FirmaStian extends HTMLElement {
  static get observedAttributes() {
    return ['enlace', 'logo', 'posicion'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._themeObserver = null;
    // Direcciones aleatorias fijas para cada letra de "S7ian Code"
    this._explosiones = 'S7ian Code'.split('').map(() => ({
      x: (Math.random() - 0.5) * 60,
      y: (Math.random() - 0.5) * 40,
      r: (Math.random() - 0.5) * 120,
    }));
  }

  connectedCallback() {
    this.render();
    this._setupObserver();
    this._watchTheme();
  }

  disconnectedCallback() {
    this._observer?.disconnect();
    this._themeObserver?.disconnect();
    this._mql?.removeEventListener('change', this._mqlHandler);
  }

  attributeChangedCallback() {
    if (this.shadowRoot) this.render();
  }

  get enlace() { return this.getAttribute('enlace') || 'https://stiancode.dev'; }
  get logo() {
    if (this.getAttribute('logo')) return this.getAttribute('logo');
    // Auto-detectar ruta relativa al script
    const scripts = document.querySelectorAll('script[src*="firma-stian"]');
    const src = scripts.length ? scripts[scripts.length - 1].getAttribute('src') : '';
    const base = src.substring(0, src.lastIndexOf('/') + 1);
    return base + 'logo-claro.png';
  }
  get posicion() { return this.getAttribute('posicion') || 'inline'; }

  _esTemaOscuro() {
    const html = document.documentElement;
    if (html.getAttribute('data-tema') === 'oscuro') return true;
    if (html.getAttribute('data-tema') === 'claro') return false;
    if (html.getAttribute('data-theme') === 'dark') return true;
    if (html.getAttribute('data-theme') === 'light') return false;
    if (html.classList.contains('dark')) return true;
    if (html.classList.contains('light')) return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  _watchTheme() {
    this._themeObserver = new MutationObserver(() => this.render());
    this._themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-tema', 'data-theme', 'class']
    });
    this._mql = window.matchMedia('(prefers-color-scheme: dark)');
    this._mqlHandler = () => this.render();
    this._mql.addEventListener('change', this._mqlHandler);
  }

  _setupObserver() {
    this._observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.shadowRoot.querySelector('.firma')?.classList.add('visible');
          this._observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    this._observer.observe(this);
  }

  render() {
    const url = this.enlace;
    const logoSrc = this.logo;
    const pos = this.posicion;
    const oscuro = this._esTemaOscuro();

    const c = oscuro
      ? { texto: '#808499', textoHover: '#d0d3e0' }
      : { texto: '#7a7790', textoHover: '#2a2a3e' };

    const wasVisible = this.shadowRoot.querySelector('.firma')?.classList.contains('visible');

    // Generar letras de "S7ian Code" con direcciones de explosión
    const letrasHTML = 'S7ian Code'.split('').map((letra, i) => {
      const e = this._explosiones[i];
      const delay = i * 0.02;
      return `<span class="letra" style="--ex:${e.x}px;--ey:${e.y}px;--er:${e.r}deg;--d:${delay}s">${letra}</span>`;
    }).join('');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          ${pos === 'esquina' ? 'position:fixed;bottom:16px;right:16px;z-index:90;' : ''}
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .firma {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          cursor: pointer;
          padding: 4px 0;
          opacity: 0;
          transform: translateY(6px);
          transition:
            opacity .5s cubic-bezier(.4,0,.2,1),
            transform .5s cubic-bezier(.4,0,.2,1);
        }

        .firma.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Logo con efecto pop + onda */
        .firma-logo-wrap {
          position: relative;
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        .firma-logo {
          width: 18px;
          height: 18px;
          object-fit: contain;
          filter: grayscale(1) brightness(0.9);
          opacity: 0.7;
          transition:
            filter .15s ease,
            opacity .15s ease,
            transform .4s cubic-bezier(.175,.885,.32,1.275);
        }

        /* Onda expansiva */
        .firma-logo-wrap::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1.5px solid rgba(124, 92, 232, 0);
          transform: scale(0.5);
          opacity: 0;
          transition: none;
          pointer-events: none;
        }

        .firma:hover .firma-logo {
          filter: grayscale(0) brightness(1);
          opacity: 1;
          animation: logoPop .45s cubic-bezier(.175,.885,.32,1.275) forwards;
        }

        .firma:hover .firma-logo-wrap::after {
          animation: onda .5s cubic-bezier(.4,0,.2,1) forwards;
        }

        @keyframes logoPop {
          0%   { transform: scale(1); }
          35%  { transform: scale(0.7); }
          65%  { transform: scale(1.06); }
          100% { transform: scale(1); }
        }

        @keyframes onda {
          0%   { transform: scale(0.8); opacity: 0; border-color: rgba(124, 92, 232, 0.3); }
          40%  { opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; border-color: rgba(124, 92, 232, 0); }
        }

        /* Vuelta suave al salir */
        .firma:not(:hover) .firma-logo {
          transition:
            filter .4s ease .1s,
            opacity .4s ease .1s,
            transform .3s ease;
        }

        /* Contenedor de textos */
        .firma-textos {
          position: relative;
          display: flex;
          align-items: center;
          height: 14px;
        }

        /* Letras de "S7ian Code" — explotan al hover */
        .firma-default {
          display: flex;
          font-family: 'Instrument Sans', system-ui, -apple-system, sans-serif;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: ${c.texto};
        }

        .letra {
          display: inline-block;
          transition:
            transform .4s cubic-bezier(.36,.07,.19,.97) var(--d),
            opacity .3s ease var(--d);
        }

        .firma:hover .letra {
          transform: translate(var(--ex), var(--ey)) rotate(var(--er)) scale(0);
          opacity: 0;
        }

        /* "Developer" — nace del centro tras la explosión */
        .firma-hover {
          font-family: 'Instrument Sans', system-ui, -apple-system, sans-serif;
          font-size: 11.5px;
          font-weight: 500;
          letter-spacing: 0.02em;
          white-space: nowrap;
          color: ${c.textoHover};
          position: absolute;
          left: 50%;
          transform: translateX(-50%) scale(0);
          opacity: 0;
          transition:
            transform .45s cubic-bezier(.175,.885,.32,1.275) .15s,
            opacity .35s ease .15s;
        }

        .firma:hover .firma-hover {
          transform: translateX(-50%) scale(1);
          opacity: 1;
        }

        /* Al salir del hover: vuelve suave */
        .firma:not(:hover) .letra {
          transition:
            transform .35s cubic-bezier(.4,0,.2,1) .1s,
            opacity .3s ease .1s;
        }

        .firma:not(:hover) .firma-hover {
          transition:
            transform .25s cubic-bezier(.4,0,.2,1),
            opacity .2s ease;
        }

        @media (prefers-reduced-motion: reduce) {
          .firma, .firma-logo, .letra, .firma-hover, .firma-logo-wrap::after {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
            transition-delay: 0ms !important;
          }
          .firma { opacity: 1; transform: none; }
        }
      </style>
      <a class="firma${wasVisible ? ' visible' : ''}" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="S7ian Code — Developer">
        <span class="firma-logo-wrap"><img class="firma-logo" src="${logoSrc}" alt="" width="18" height="18" /></span>
        <span class="firma-textos">
          <span class="firma-default">${letrasHTML}</span>
          <span class="firma-hover">Developer</span>
        </span>
      </a>
    `;
  }
}

if (!customElements.get('firma-stian')) {
  customElements.define('firma-stian', FirmaStian);
}
