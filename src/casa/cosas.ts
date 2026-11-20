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
