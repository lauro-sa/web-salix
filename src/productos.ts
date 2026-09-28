// ============================================================
// productos.ts — los productos y servicios de Salix. Fuente ÚNICA: la usan la grilla de
// «Productos y servicios» (SeccionProductos) y el formulario de contacto (FormularioContacto).
// Un producto nuevo se agrega acá y aparece en los dos.
//
//   id       lo que viaja en la consulta, y el que pasa cada página a productoPreseleccionado
//   nombre   el nombre con marca, para la grilla ("Flux by Salix")
//   corto    el nombre en el formulario ("Flux")
//   linea    qué es, en dos o tres palabras, debajo del nombre en el formulario
//   pista    la ayuda del mensaje en el paso 3: qué nos sirve saber para responder bien
// ============================================================

export interface Producto {
  id: string;
  nombre: string;
  corto: string;
  linea: string;
  pista: string;
  descripcion: string;
  icono: string;
  disponible: boolean;
  url: string;
  color: string;
}

export const PRODUCTOS: Producto[] = [
  {
    id: 'Flux',
    nombre: 'Flux by Salix',
    corto: 'Flux',
    linea: 'Todo tu negocio',
    pista: '¿A qué se dedica tu empresa y cuántas personas la usarían?',
    descripcion: 'Un solo sistema. Crece desde el primer cliente hasta todo el equipo, sin cambiar de software al escalar.',
    icono: 'flux',
    disponible: true,
    url: '/flux',
    color: 'var(--salix)',
  },
  {
    id: 'Menú',
    nombre: 'Menú by Salix',
    corto: 'Menú',
    linea: 'Carta digital con QR',
    pista: '¿Qué local tenés y cuántos platos tiene la carta?',
    descripcion: 'La carta digital de tu local, con un QR que no cambia nunca. Cambiás precios, platos y fotos cuando quieras.',
    icono: 'menu',
    disponible: true,
    url: 'https://menu.salixweb.com',
    color: 'var(--salix)',
  },
  {
    id: 'Sites',
    nombre: 'Sites',
    corto: 'Sites',
    linea: 'Sitios web a medida',
    pista: '¿Qué sitio necesitás? ¿Ya tenés dominio o un sitio que haya que rehacer?',
    descripcion: 'Sitios web a medida con tecnología Salix. Rápidos, con SEO completo y diseño profesional.',
    icono: 'sitio',
    disponible: true,
    url: '/sites',
    color: 'var(--salix)',
  },
  {
    id: 'Go',
    nombre: 'Go',
    corto: 'Go',
    linea: 'Delivery',
    pista: 'Go todavía no salió. Contanos de tu local y te avisamos primero cuando esté.',
    descripcion: 'Delivery de comidas. El cliente elige, pide por WhatsApp, paga con MercadoPago y recibe en su puerta.',
    icono: 'delivery',
    disponible: false,
    url: '/go',
    color: 'var(--salix)',
  },
  {
    id: 'Play',
    nombre: 'Play',
    corto: 'Play',
    linea: 'Canchas',
    pista: 'Play todavía no salió. Contanos cuántas canchas tenés y te avisamos primero cuando esté.',
    descripcion: 'Gestión de canchas de pádel. Turnos fijos, pagos mensuales con links de MercadoPago y control visual.',
    icono: 'cancha',
    disponible: false,
    url: '/play',
    color: 'var(--salix)',
  },
  {
    id: 'Book',
    nombre: 'Book',
    corto: 'Book',
    linea: 'Turnos',
    pista: 'Book todavía no salió. Contanos cómo das turnos hoy y te avisamos primero cuando esté.',
    descripcion: 'Gestor de citas para equipos. Psicología, estética, consultorios. Turnos por WhatsApp e interfaz simple.',
    icono: 'agenda',
    disponible: false,
    url: '/book',
    color: 'var(--salix)',
  },
  {
    id: 'Integraciones',
    nombre: 'Integraciones',
    corto: 'Integraciones',
    linea: 'Sesiones de 45 min',
    pista: '¿Qué querés dejar andando, y en qué sistema?',
    descripcion: 'Te lo dejamos andando. En Flux, Sites o el software que ya uses. Sesiones de 45 minutos.',
    icono: 'link',
    disponible: true,
    url: '/integraciones',
    color: 'var(--salix)',
  },
];

/** La opción del formulario para quien todavía no sabe qué necesita. */
export const SIN_DECIDIR = {
  id: 'No sé aún',
  corto: 'No sé aún',
  linea: 'Te asesoramos',
  pista: 'Contanos a qué se dedica tu negocio y qué te gustaría resolver.',
  icono: 'ayuda',
};

/** El correo donde llegan las consultas; el formulario lo muestra si el envío falla. */
export const CORREO_CONTACTO = 'hola@salixweb.com';
