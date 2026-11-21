// Lo que hace la casa, como fichas: la rueda de la portada y el «Más de la casa» de cada página.
/** Un elemento de la rueda de la portada: un producto, un servicio, algo que viene o un sitio hecho. */
export interface Pieza {
  /** La línea de la casa: decide el color de la luz y del borde cuando pasa al frente (`--linea-<id>`). */
  id: string;
  /**
   * El ícono de app oficial, tal como lo publica su dueño: el de cada producto es el de su app y el de
   * cada sitio, el de su marca. Va entero, sin retoques (nunca redibujado ni recoloreado).
   */
  imagen?: string;
  /** Un logo con fondo transparente: va centrado sobre este color, que es el de su marca. */
  fondo?: string;
  /** Lo que todavía no tiene ícono propio lleva uno de trazo de la casa (IconoProducto.astro). */
  icono?: string;
  nombre: string;
  que: string;
  /** La parte de la portada a la que lleva. */
  ancla: string;
  /** Su página dentro de la casa, si la tiene (desde la raíz de la casa: `flux`, `sitios/tph`). */
  pagina?: string;
  obra?: boolean;
}

// Todo lo que hace la casa, en el orden de la rueda. Los productos, los sitios hechos y lo que viene
// se intercalan, así al frente y a sus lados siempre hay cosas distintas.
// Los íconos están en public/capturas/iconos/ y salen de: Flux y Menu, `public/iconos/icon-512.png`
// de cada producto en el monorepo; Nuvix, `web/public/icono-512.png`; herreelec y porcorosso, su
// `apple-touch-icon.png`; tph, su logo oficial en blanco (`public/logos/Logo-B-01.png`).
const I = '/capturas/iconos';
export const RUEDA: Pieza[] = [
  { id: 'flux', imagen: `${I}/flux.png`, nombre: 'Flux', que: 'Sistema de gestión', ancla: 'flux', pagina: 'flux' },
  { id: 'sites', imagen: `${I}/herreelec.png`, nombre: 'herreelec.com', que: 'Sitio web hecho por Salix', ancla: 'sitios', pagina: 'sitios/herreelec' },
  { id: 'menu', imagen: `${I}/menu.png`, nombre: 'Menu', que: 'Carta digital con QR', ancla: 'menu', pagina: 'menu' },
  { id: 'obra', icono: 'delivery', nombre: 'Go', que: 'Delivery para tu local · En obra', ancla: 'viene', obra: true },
  { id: 'nuvix', imagen: `${I}/nuvix.png`, nombre: 'Nuvix', que: 'App para iPhone', ancla: 'nuvix', pagina: 'nuvix' },
  { id: 'sites', imagen: `${I}/tph.png`, fondo: '#0a0a0b', nombre: 'tphservice.com', que: 'Sitio web hecho por Salix', ancla: 'sitios', pagina: 'sitios/tph' },
  { id: 'integraciones', icono: 'link', nombre: 'Integraciones', que: 'Sesiones de 45 minutos', ancla: 'integraciones' },
  { id: 'obra', icono: 'cancha', nombre: 'Play', que: 'Turnos y cobros de canchas · En obra', ancla: 'viene', obra: true },
  { id: 'sites', imagen: `${I}/porcorosso.png`, nombre: 'porcorosso.com.ar', que: 'Sitio web hecho por Salix', ancla: 'sitios', pagina: 'sitios/porcorosso' },
  { id: 'obra', icono: 'agenda', nombre: 'Book', que: 'Turnos para consultorios · En obra', ancla: 'viene', obra: true },
];
