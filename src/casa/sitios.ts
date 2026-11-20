// La página de cada sitio hecho por Salix para un cliente: qué es el cliente, qué tiene su sitio y el
// sitio entero, de punta a punta, en capturas reales. Lo que se dice de cada sitio es lo que se ve en
// el sitio en línea (mirado el 2026-11-20); nada de cifras del negocio del cliente.
// Las capturas las saca `pruebas/sitios-largo.mjs` (carpeta de pruebas) a 1440 de ancho y a 390 en el
// teléfono, y las trae `scripts/capturas-casa.sh`.
import type { Toma } from './capturas';
import type { Hecho } from './productos';

export interface DetalleSitio {
  id: string;
  dominio: string;
  cliente: string;
  rubro: string;
  /** El ícono oficial de la marca (public/propuestas/iconos/). */
  icono: string;
  /** Un logo con fondo transparente va centrado sobre este color, que es el de su marca. */
  fondo?: string;
  bajada: string;
  /** Lo que tiene el sitio, parte por parte. */
  incluye: Hecho[];
  /** El sitio entero. */
  larga: Toma;
  /** La primera pantalla en un teléfono. */
  telefono: Toma;
  /** Con qué está hecho. */
  hechoCon: string;
  /** Si el sitio cambia con el tema del aparato. */
  dosTemas: boolean;
}

const P = '/propuestas';
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

export const SITIOS_HECHOS: DetalleSitio[] = [
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
    larga: larga('herreelec', 6200, 'El sitio herreelec.com de punta a punta: la portada, los tipos de portón, los servicios, las fotos de trabajos, las reseñas y el contacto.', true),
    telefono: telefono('herreelec', 'La primera pantalla de herreelec.com en un teléfono: «¿Se te rompió el portón?», con los botones de WhatsApp y de pedir una visita.', true),
    hechoCon: 'Next.js',
    dosTemas: true,
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
    larga: larga('tph', 6078, 'El sitio tphservice.com de punta a punta: la portada, los servicios, un caso de éxito, la galería de trabajos, las preguntas frecuentes y las marcas.', true),
    telefono: telefono('tph', 'La primera pantalla de tphservice.com en un teléfono: «Reparación de portones», con los botones de WhatsApp y de pedir presupuesto.', true),
    hechoCon: 'Next.js',
    dosTemas: true,
  },
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
    larga: larga('porcorosso', 9148, 'El sitio b2b.porcorosso.com.ar de punta a punta: la portada, los dos tipos de cliente, la cadena completa, los productos, las ventajas, las preguntas frecuentes y el formulario.', false),
    telefono: telefono('porcorosso', 'La primera pantalla de b2b.porcorosso.com.ar en un teléfono: «Criamos, producimos y entregamos», con los botones para ser cliente y de WhatsApp.', false),
    hechoCon: 'Astro',
    dosTemas: false,
  },
];
