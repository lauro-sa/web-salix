// Los sitios hechos por Salix: los de sus clientes y las webs de sus propios productos. Un sitio es
// una cosa y un producto es otra: la web de Flux es un sitio que hizo Salix, igual que el de un
// cliente, y tiene su página acá; Flux, el software, tiene la suya en src/casa/productos.ts
// (Sal, 2026-11-20). De esta lista salen las tarjetas de «Sitios» y la página de cada sitio.
// Lo que se dice de cada sitio es lo que se ve en el sitio en línea (mirado el 2026-11-20); nada de
// cifras del negocio del cliente.
// Las capturas las saca `pruebas/sitios-largo.mjs` y `pruebas/sitios-temas.mjs` (carpeta de pruebas)
// a 1440 de ancho y a 390 en el teléfono, y las trae `scripts/capturas-casa.sh`.
import type { Toma } from './capturas';
import type { Hecho } from './productos';

export interface DetalleSitio {
  id: string;
  dominio: string;
  /** De quién es el sitio: el cliente, o el producto de Salix. */
  cliente: string;
  /** Qué es, en dos o tres palabras: va bajo el nombre en la tarjeta. */
  rubro: string;
  /** Si es la web de un producto de Salix, cuál (su página está en productos.ts). */
  producto?: string;
  /** El ícono oficial de la marca (public/capturas/iconos/). */
  icono: string;
  /** Un logo con fondo transparente va centrado sobre este color, que es el de su marca. */
  fondo?: string;
  bajada: string;
  /** Lo que tiene el sitio, parte por parte. */
  incluye: Hecho[];
  /** La primera pantalla en una computadora (1440 × 900): la de la tarjeta. */
  portada: Toma;
  /** El sitio entero. */
  larga: Toma;
  /** La primera pantalla en un teléfono. */
  telefono: Toma;
  /** Con qué está hecho. */
  hechoCon: string;
  /** Si el sitio cambia con el tema del aparato. */
  dosTemas: boolean;
}

const P = '/capturas';
const portada = (archivo: string, dominio: string, conOscura: boolean): Toma => ({
  src: `${P}/${archivo}.jpg`,
  oscura: conOscura ? `${P}/${archivo}-oscuro.jpg` : undefined,
  ancho: 1440,
  alto: 900,
  alt: `Portada de ${dominio}`,
});
const larga = (id: string, alto: number, alt: string, conOscura: boolean): Toma => ({
  src: `${P}/sitio-${id}-largo.webp`,
  oscura: conOscura ? `${P}/sitio-${id}-largo-oscuro.webp` : undefined,
  ancho: 1440,
  alto,
  alt,
});
const telefono = (id: string, alt: string, conOscura: boolean): Toma => ({
  src: `${P}/sitio-${id}-tel.webp`,
  oscura: conOscura ? `${P}/sitio-${id}-tel-oscuro.webp` : undefined,
  ancho: 780,
  alto: 1688,
  alt,
});

// El orden es el que se muestra: primero los sitios de clientes y después las webs de los productos;
// en cada grupo, el más nuevo arriba (Sal, 2026-11-20). Un sitio nuevo entra primero en su grupo.
export const SITIOS_HECHOS: DetalleSitio[] = [
  {
    id: 'porcorosso',
    dominio: 'b2b.porcorosso.com.ar',
    cliente: 'Porco Rosso',
    rubro: 'Mayorista de carne porcina',
    icono: `${P}/iconos/porcorosso.png`,
    bajada:
      'Porco Rosso es una empresa familiar que cría, produce y entrega carne porcina en CABA y GBA. El sitio es su puerta para sumar clientes mayoristas y gastronómicos.',
    incluye: [
      { titulo: 'Una entrada por tipo de cliente', texto: 'Mayoristas y gastronómicos tienen cada uno su página, con su propuesta.' },
      { titulo: 'Los productos', texto: 'Piezas enteras, fraccionadas al vacío y productos elaborados, con sus cortes.' },
      { titulo: 'Un formulario en cuatro pasos', texto: 'El pedido de contacto se arma paso a paso, según el tipo de negocio.' },
      { titulo: 'Preguntas frecuentes', texto: 'Zonas de entrega, cortes a medida, trazabilidad y cómo pedir un presupuesto.' },
      { titulo: 'WhatsApp mayorista', texto: 'En la primera pantalla y siempre a la vista.' },
    ],
    portada: portada('sitio-porcorosso', 'b2b.porcorosso.com.ar', false),
    larga: larga('porcorosso', 9148, 'El sitio b2b.porcorosso.com.ar de punta a punta: la portada, los dos tipos de cliente, la cadena completa, los productos, las ventajas, las preguntas frecuentes y el formulario.', false),
    telefono: telefono('porcorosso', 'La primera pantalla de b2b.porcorosso.com.ar en un teléfono: «Criamos, producimos y entregamos», con los botones para ser cliente y de WhatsApp.', false),
    hechoCon: 'Astro',
    dosTemas: false,
  },
  {
    id: 'tph',
    dominio: 'tphservice.com',
    cliente: 'TPH',
    rubro: 'Servicio técnico',
    icono: `${P}/iconos/tph.png`,
    fondo: '#0a0a0b',
    bajada:
      'TPH repara portones y hace herrería de obra. El sitio muestra los servicios y los trabajos hechos, y deja el contacto a un toque en toda la página.',
    incluye: [
      { titulo: 'Trabajos con filtros', texto: 'La galería se filtra por tipo de portón y por tipo de reparación.' },
      { titulo: 'Los servicios, uno por uno', texto: 'Reparación mecánica, motores, placas, automatización y estructura, cada uno con su ficha.' },
      { titulo: 'Casos de éxito', texto: 'Un trabajo contado con su foto y lo que se hizo.' },
      { titulo: 'Preguntas frecuentes', texto: 'Qué portones se reparan, horarios, presupuestos y garantía.' },
      { titulo: 'WhatsApp y pedido de presupuesto', texto: 'En la primera pantalla y siempre a la vista, con un botón que acompaña.' },
      { titulo: 'Claro y oscuro', texto: 'El sitio sigue el tema del aparato.' },
    ],
    portada: portada('sitio-tph', 'tphservice.com', true),
    larga: larga('tph', 6078, 'El sitio tphservice.com de punta a punta: la portada, los servicios, un caso de éxito, la galería de trabajos, las preguntas frecuentes y las marcas.', true),
    telefono: telefono('tph', 'La primera pantalla de tphservice.com en un teléfono: «Reparación de portones», con los botones de WhatsApp y de pedir presupuesto.', true),
    hechoCon: 'Next.js',
    dosTemas: true,
  },
  {
    id: 'herreelec',
    dominio: 'herreelec.com',
    cliente: 'HERREELEC',
    rubro: 'Reparación de portones',
    icono: `${P}/iconos/herreelec.png`,
    bajada:
      'El taller repara, mantiene y automatiza portones a domicilio, en CABA y el Gran Buenos Aires. El sitio le contesta a quien llega con el portón roto: qué se arregla, cómo se trabaja y cómo pedir la visita.',
    incluye: [
      { titulo: 'Una página por tipo de portón', texto: 'Levadizos, corredizos, automatización y restauración de portones antiguos, cada uno con sus fallas más comunes y sus arreglos.' },
      { titulo: 'Trabajos con fotos propias', texto: 'Una galería de trabajos hechos por el taller, cada foto con su descripción.' },
      { titulo: 'Las reseñas de Google', texto: 'Las opiniones de los clientes, con su calificación y el enlace a cada una.' },
      { titulo: 'WhatsApp y pedido de visita', texto: 'Los dos caminos para llegar al taller, a mano desde la primera pantalla.' },
      { titulo: 'Claro y oscuro', texto: 'El sitio sigue el tema del aparato.' },
    ],
    portada: portada('sitio-herreelec', 'herreelec.com', true),
    larga: larga('herreelec', 6200, 'El sitio herreelec.com de punta a punta: la portada, los tipos de portón, los servicios, las fotos de trabajos, las reseñas y el contacto.', true),
    telefono: telefono('herreelec', 'La primera pantalla de herreelec.com en un teléfono: «¿Se te rompió el portón?», con los botones de WhatsApp y de pedir una visita.', true),
    hechoCon: 'Next.js',
    dosTemas: true,
  },
  {
    id: 'nuvix',
    dominio: 'nuvix.salixweb.com',
    cliente: 'Nuvix',
    rubro: 'La web de Nuvix',
    producto: 'nuvix',
    icono: `${P}/iconos/nuvix.png`,
    bajada:
      'Nuvix es la app para iPhone de Salix, todavía sin publicar. Su web la presenta con capturas reales y explica con cuidado qué hace y qué no.',
    incluye: [
      { titulo: 'La app, pantalla por pantalla', texto: 'Capturas reales dentro de un iPhone, que cambian con el tema y con el idioma de quien visita.' },
      { titulo: 'Una escena que acompaña', texto: 'Al bajar, el teléfono queda quieto y va mostrando cada paso de anotar una aplicación.' },
      { titulo: 'Una página para los datos', texto: '«Tus datos» cuenta qué se hace con lo que se anota y cómo borrarlo.' },
      { titulo: 'Funciones, preguntas y soporte', texto: 'Cada parte de la app, las dudas más comunes y cómo pedir ayuda, cada una en su página.' },
      { titulo: 'En español y en inglés', texto: 'El sitio entero, capturas incluidas.' },
      { titulo: 'Claro y oscuro', texto: 'El sitio sigue el tema del aparato.' },
    ],
    portada: portada('sitio-web-nuvix', 'nuvix.salixweb.com', true),
    larga: larga('nuvix', 9700, 'El sitio nuvix.salixweb.com de punta a punta: la portada con la app en un iPhone, la escena de anotar una aplicación, los registros de la semana, Salix IA, el informe, los datos y el cierre.', true),
    telefono: telefono('nuvix', 'La primera pantalla de nuvix.salixweb.com en un teléfono: «Cuándo te toca. Dónde sigue.».', true),
    hechoCon: 'Astro',
    dosTemas: true,
  },
  {
    id: 'menu',
    dominio: 'menu.salixweb.com',
    cliente: 'Menu',
    rubro: 'La web de Menu',
    producto: 'menu',
    icono: `${P}/iconos/menu.png`,
    bajada:
      'Menu es la carta digital con QR de Salix. Su web la muestra funcionando, con videos de la app real, y es donde se arma la carta.',
    incluye: [
      { titulo: 'Videos de la app real', texto: 'Cada función se muestra con un video grabado sobre una carta de muestra.' },
      { titulo: 'Una entrada por rubro', texto: 'Cafés, parrillas y sushi tienen cada uno su versión de la portada.' },
      { titulo: 'La carta, para probarla', texto: 'Un botón invita a probar una carta de muestra, como la vería un cliente.' },
      { titulo: 'Funciones, planes y preguntas', texto: 'Qué hace, cuánto sale y las dudas más comunes.' },
      { titulo: 'En tres idiomas', texto: 'Español, inglés y portugués.' },
    ],
    portada: portada('sitio-web-menu', 'menu.salixweb.com', false),
    larga: larga('menu', 6610, 'El sitio menu.salixweb.com de punta a punta: la portada con la carta en un teléfono, las dos cartas, lo que encuentra el cliente y lo que cambia el dueño, el panel, los pedidos, las visitas, los pasos y las preguntas.', false),
    telefono: telefono('menu', 'La primera pantalla de menu.salixweb.com en un teléfono: «Que tu carta se vea tan bien como tu comida.».', false),
    hechoCon: 'Next.js',
    dosTemas: false,
  },
  {
    id: 'flux',
    dominio: 'flux.salixweb.com',
    cliente: 'Flux',
    rubro: 'La web de Flux',
    producto: 'flux',
    icono: `${P}/iconos/flux.png`,
    bajada:
      'Flux es el sistema de gestión de Salix. Su web cuenta qué hace, muestra el sistema con capturas reales y es la puerta para probarlo.',
    incluye: [
      { titulo: 'Un recorrido paso a paso', texto: 'El camino del primer mensaje al cobro, contado con capturas reales del sistema que cambian al bajar.' },
      { titulo: 'Capturas reales, en claro y en oscuro', texto: 'Cada pantalla del sistema se muestra en el tema que está viendo quien visita.' },
      { titulo: 'Funciones y planes', texto: 'Una página con cada módulo y otra con los planes y sus precios.' },
      { titulo: 'Preguntas frecuentes', texto: 'Las dudas más comunes antes de probarlo.' },
      { titulo: 'La puerta al sistema', texto: 'Desde la web se crea la cuenta y se entra a Flux.' },
    ],
    portada: portada('sitio-web-flux', 'flux.salixweb.com', true),
    larga: larga('flux', 11560, 'El sitio flux.salixweb.com de punta a punta: la portada, el recorrido del primer mensaje al cobro, la computadora y el teléfono, las pantallas del sistema, Salix IA, las áreas, los planes y las preguntas.', true),
    telefono: telefono('flux', 'La primera pantalla de flux.salixweb.com en un teléfono: «Todo tu negocio. En un solo lugar.».', true),
    hechoCon: 'Next.js',
    dosTemas: true,
  },
];
