// Los enlaces de la barra y del pie de la web nueva. Una sola lista: la barra, el menú del teléfono y
// el pie salen de acá. `base` es '' en la portada (los saltos son de la misma página) y '/' en el resto.
export interface Enlace { href: string; texto: string }

export interface Columna { titulo: string; enlaces: Enlace[] }

/** Dónde vive la casa mientras es una propuesta. Al publicarla pasa a '/', y las rutas de abajo con ella. */
export const RAIZ_CASA = '/propuestas/salix/';
/** La página de un producto dentro de la web de Salix. */
export const rutaProducto = (id: string) => `${RAIZ_CASA}${id}/`;
/** La página de un sitio hecho por Salix. */
export const rutaSitio = (id: string) => `${RAIZ_CASA}sitios/${id}/`;

export function enlacesBarra(base = ''): Enlace[] {
  return [
    { href: `${base}#inicio`, texto: 'Inicio' },
    { href: `${base}#casa`, texto: 'La casa' },
    { href: `${base}#productos`, texto: 'Productos' },
    { href: `${base}#sitios`, texto: 'Sitios' },
    { href: `${base}#clientes`, texto: 'Clientes' },
  ];
}

export function ctaBarra(base = ''): Enlace {
  return { href: `${base}#contacto`, texto: 'Hablemos' };
}

export function columnasPie(base = ''): Columna[] {
  return [
    {
      titulo: 'Productos',
      enlaces: [
        { href: 'https://flux.salixweb.com', texto: 'Flux' },
        { href: 'https://menu.salixweb.com', texto: 'Menu' },
        { href: 'https://nuvix.salixweb.com', texto: 'Nuvix' },
      ],
    },
    {
      titulo: 'Servicios',
      enlaces: [
        { href: `${base}#sitios`, texto: 'Sitios web' },
        { href: `${base}#integraciones`, texto: 'Integraciones' },
      ],
    },
    {
      titulo: 'Salix',
      enlaces: [
        { href: `${base}#casa`, texto: 'La casa' },
        { href: `${base}#clientes`, texto: 'Clientes' },
        { href: `${base}#contacto`, texto: 'Contacto' },
      ],
    },
    {
      titulo: 'Legal',
      enlaces: [
        { href: '/privacidad', texto: 'Privacidad' },
        { href: '/terminos', texto: 'Términos' },
      ],
    },
  ];
}
