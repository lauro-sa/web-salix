// Lo que hace la casa, para las piezas que lo muestran como íconos (la órbita de la portada).
export interface Cosa {
  /** La línea de la casa: decide el color (`--linea-<id>`). */
  id: string;
  /** El ícono (IconoProducto.astro). */
  icono: string;
  nombre: string;
  que: string;
  /** La parte de la portada a la que lleva. */
  ancla: string;
  /** Todavía no existe: va en «Lo que viene». */
  obra: boolean;
}

// En el orden del anillo: arriba primero, en el sentido del reloj. Lo que anda y lo que está en obra
// se alternan, así el anillo queda parejo.
export const COSAS: Cosa[] = [
  { id: 'flux', icono: 'flux', nombre: 'Flux', que: 'Sistema de gestión', ancla: 'flux', obra: false },
  { id: 'sites', icono: 'sitio', nombre: 'Sitios web', que: 'A medida', ancla: 'sitios', obra: false },
  { id: 'menu', icono: 'menu', nombre: 'Menu', que: 'Carta digital con QR', ancla: 'menu', obra: false },
  { id: 'obra', icono: 'delivery', nombre: 'Go', que: 'En obra', ancla: 'viene', obra: true },
  { id: 'nuvix', icono: 'nuvix', nombre: 'Nuvix', que: 'App para iPhone', ancla: 'nuvix', obra: false },
  { id: 'obra', icono: 'cancha', nombre: 'Play', que: 'En obra', ancla: 'viene', obra: true },
  { id: 'integraciones', icono: 'link', nombre: 'Integraciones', que: 'Sesiones de 45 minutos', ancla: 'integraciones', obra: false },
  { id: 'obra', icono: 'agenda', nombre: 'Book', que: 'En obra', ancla: 'viene', obra: true },
];

/** Un elemento de la rueda de la portada: un producto, un servicio, algo que viene o un sitio hecho. */
export interface Pieza {
  /** La línea de la casa: decide el color de la luz y del borde cuando pasa al frente (`--linea-<id>`). */
  id: string;
  /** El ícono de la casa (IconoProducto.astro), o… */
  icono?: string;
  /** …el ícono oficial del sitio, tal como lo publica su dueño (nunca redibujado). */
  imagen?: string;
  /** El color de fondo de la ficha, como el de un ícono de app. Sin él, la ficha es neutra. */
  fondo?: string;
  /** El ícono trae su propio fondo y ocupa la ficha entera. */
  llena?: boolean;
  nombre: string;
  que: string;
  /** La parte de la portada a la que lleva. */
  ancla: string;
  obra?: boolean;
}

// Todo lo que hace la casa, en el orden de la rueda. Los productos, los sitios hechos y lo que viene
// se intercalan, así al frente y a sus lados siempre hay cosas distintas.
export const RUEDA: Pieza[] = [
  { id: 'flux', icono: 'flux', fondo: '#4e4eb8', nombre: 'Flux', que: 'Sistema de gestión', ancla: 'flux' },
  { id: 'sites', imagen: '/propuestas/iconos/herreelec.png', fondo: '#0f1320', nombre: 'herreelec.com', que: 'Sitio web hecho por Salix', ancla: 'sitios' },
  { id: 'menu', icono: 'menu', fondo: '#394a42', nombre: 'Menu', que: 'Carta digital con QR', ancla: 'menu' },
  { id: 'obra', icono: 'delivery', nombre: 'Go', que: 'Delivery para tu local · En obra', ancla: 'viene', obra: true },
  { id: 'nuvix', icono: 'nuvix', fondo: '#136c64', nombre: 'Nuvix', que: 'App para iPhone', ancla: 'nuvix' },
  { id: 'sites', imagen: '/propuestas/iconos/tph.png', fondo: '#000000', llena: true, nombre: 'tphservice.com', que: 'Sitio web hecho por Salix', ancla: 'sitios' },
  { id: 'integraciones', icono: 'link', fondo: '#2a2c33', nombre: 'Integraciones', que: 'Sesiones de 45 minutos', ancla: 'integraciones' },
  { id: 'obra', icono: 'cancha', nombre: 'Play', que: 'Turnos y cobros de canchas · En obra', ancla: 'viene', obra: true },
  { id: 'sites', imagen: '/propuestas/iconos/porcorosso.png', fondo: '#ffffff', llena: true, nombre: 'porcorosso.com.ar', que: 'Sitio web hecho por Salix', ancla: 'sitios' },
  { id: 'obra', icono: 'agenda', nombre: 'Book', que: 'Turnos para consultorios · En obra', ancla: 'viene', obra: true },
];
