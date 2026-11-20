// Datos de las propuestas de portada (rediseño 2026-11): lo mismo para las dos direcciones.
// Cada texto sale de lo que ya publica el producto en su web.
export interface Entrada {
  id: string;
  nombre: string;
  que: string;
  estado: string;
  frase: string;
  hechos: string[];
  url: string;
  dominio: string;
  /** Si todavía no existe: va en «Lo que viene», sin página ni precio. */
  viene?: boolean;
}

export const ENTRADAS: Entrada[] = [
  {
    id: 'flux',
    nombre: 'Flux',
    que: 'Sistema de gestión',
    estado: 'En uso',
    frase: 'Todo tu negocio. En un solo lugar.',
    hechos: [
      'Los mensajes, los presupuestos, las visitas y las facturas, en un mismo sistema.',
      'En la computadora se arma. En el teléfono se trabaja.',
      '30 días de prueba, sin tarjeta.',
    ],
    url: 'https://flux.salixweb.com',
    dominio: 'flux.salixweb.com',
  },
  {
    id: 'menu',
    nombre: 'Menu',
    que: 'Carta digital con QR',
    estado: 'En uso',
    frase: 'Que tu carta se vea tan bien como tu comida.',
    hechos: [
      'Clásica o tipo redes, en el idioma de tu cliente.',
      'Cambiás un precio y publicás. El QR no cambia nunca.',
      '30 días gratis al publicar.',
    ],
    url: 'https://menu.salixweb.com',
    dominio: 'menu.salixweb.com',
  },
  {
    id: 'nuvix',
    nombre: 'Nuvix',
    que: 'App para iPhone',
    estado: 'Llega pronto',
    frase: 'Cuándo te toca. Dónde sigue.',
    hechos: [
      'El registro personal de un tratamiento inyectable semanal o diario.',
      'Para iPhone, en español y en inglés.',
      'Próximamente en el App Store.',
    ],
    url: 'https://nuvix.salixweb.com',
    dominio: 'nuvix.salixweb.com',
  },
  {
    id: 'sites',
    nombre: 'Sites',
    que: 'Sitios web a medida',
    estado: 'A pedido',
    frase: 'El sitio de tu empresa, hecho por nosotros.',
    hechos: [
      'Diseño propio para tu marca y tu rubro.',
      'Rápido, y preparado para que te encuentren.',
      'Presupuesto a medida.',
    ],
    url: '/sites',
    dominio: 'salixweb.com/sites',
  },
  {
    id: 'integraciones',
    nombre: 'Integraciones',
    que: 'Sesiones de 45 minutos',
    estado: 'Con turno',
    frase: 'Te lo dejamos andando.',
    hechos: [
      'En Flux, en tu sitio o en el software que ya uses.',
      'Sesiones de 45 minutos, con alguien del equipo.',
      'US$ 70 la primera sesión.',
    ],
    url: '/integraciones',
    dominio: 'salixweb.com/integraciones',
  },
  { id: 'go', nombre: 'Go', que: 'Delivery para tu local', estado: 'En preparación', frase: '', hechos: [], url: '', dominio: '', viene: true },
  { id: 'play', nombre: 'Play', que: 'Turnos y cobros de canchas', estado: 'En preparación', frase: '', hechos: [], url: '', dominio: '', viene: true },
  { id: 'book', nombre: 'Book', que: 'Turnos para consultorios', estado: 'En preparación', frase: '', hechos: [], url: '', dominio: '', viene: true },
];

/**
 * Sitios hechos por Salix que se muestran con captura real (confirmados por el dueño, 2026-11-20).
 * `oscura`: la captura del mismo sitio en modo oscuro, para los que cambian con el tema del aparato.
 * Las saca `sitios-temas.mjs` (carpeta de pruebas), a 1440×900.
 * `sitio` o `producto`: la página de la casa que lo cuenta entero (src/casa/sitios.ts y productos.ts).
 */
export const SITIOS: { archivo: string; oscura?: string; dominio: string; que: string; sitio?: string; producto?: string }[] = [
  { archivo: 'sitio-herreelec.jpg', oscura: 'sitio-herreelec-oscuro.jpg', dominio: 'herreelec.com', que: 'Reparación de portones', sitio: 'herreelec' },
  { archivo: 'sitio-tph.jpg', oscura: 'sitio-tph-oscuro.jpg', dominio: 'tphservice.com', que: 'Servicio técnico', sitio: 'tph' },
  { archivo: 'sitio-porcorosso.jpg', dominio: 'b2b.porcorosso.com.ar', que: 'Mayorista de carne porcina', sitio: 'porcorosso' },
  { archivo: 'sitio-web-flux.jpg', oscura: 'sitio-web-flux-oscuro.jpg', dominio: 'flux.salixweb.com', que: 'La web de Flux', producto: 'flux' },
  { archivo: 'sitio-web-menu.jpg', dominio: 'menu.salixweb.com', que: 'La web de Menu', producto: 'menu' },
  { archivo: 'sitio-web-nuvix.jpg', oscura: 'sitio-web-nuvix-oscuro.jpg', dominio: 'nuvix.salixweb.com', que: 'La web de Nuvix', producto: 'nuvix' },
];

export const CORREO = 'hola@salixweb.com';
