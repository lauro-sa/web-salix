// Las capturas de la casa. Todas son reales: las de cada producto son las que ese producto publica en
// su web y las de los sitios se sacan del sitio en línea. Las trae `scripts/capturas-casa.sh`.

/** Una captura. Con `oscura`, se muestra la del tema que se está viendo. */
export interface Toma {
  src: string;
  oscura?: string;
  ancho: number;
  alto: number;
  alt: string;
  /** Una captura de un modo fijo: va primero si es el del tema que se ve. */
  modo?: 'claro' | 'oscuro';
}

/** Lo que muestra la mesa de capturas de una vez: una captura ancha, o uno o varios teléfonos. */
export interface Vista {
  rotulo: string;
  forma: 'ancha' | 'tel';
  tomas: Toma[];
}

const P = '/capturas';

/** La captura de un teléfono (660 × 1434 si no se dice otra cosa). */
export const tel = (archivo: string, alt: string, conOscura = false, ancho = 660, alto = 1434): Toma => ({
  src: `${P}/${archivo}.webp`,
  oscura: conOscura ? `${P}/${archivo}-oscuro.webp` : undefined,
  ancho,
  alto,
  alt,
});

/** La captura de una computadora (1512 × 993 si no se dice otra cosa). */
export const ancha = (archivo: string, alt: string, conOscura = false, ancho = 1512, alto = 993): Toma => ({
  src: `${P}/${archivo}.webp`,
  oscura: conOscura ? `${P}/${archivo}-oscuro.webp` : undefined,
  ancho,
  alto,
  alt,
});

/** Los pósters de Menu miden 600 × 1304 y existen en un solo modo. */
export const telMenu = (archivo: string, alt: string): Toma => tel(archivo, alt, false, 600, 1304);

// Lo que muestra cada producto en la portada y en la cabecera de su página.
export const VISTAS_PORTADA: Record<string, Vista[]> = {
  flux: [
    { rotulo: 'En la computadora', forma: 'ancha', tomas: [ancha('flux-mac', 'La bandeja de mensajes de Flux, con las conversaciones de WhatsApp de una empresa de muestra.', true)] },
    {
      // Los dos modos lado a lado; va primero el del tema que se está viendo (Sal, 2026-11-20).
      rotulo: 'En el teléfono',
      forma: 'tel',
      tomas: [
        { ...tel('flux-tel', 'El inicio de Flux en el teléfono, en modo claro.'), modo: 'claro' },
        { ...tel('flux-tel-oscuro', 'El inicio de Flux en el teléfono, en modo oscuro.'), modo: 'oscuro' },
      ],
    },
  ],
  menu: [
    {
      rotulo: 'La carta',
      forma: 'tel',
      tomas: [
        telMenu('menu-clasica', 'Una carta de Menu en su versión clásica, en un teléfono.'),
        telMenu('menu-visual', 'La misma carta en su versión visual.'),
      ],
    },
    { rotulo: 'El panel', forma: 'ancha', tomas: [ancha('menu-panel', 'El panel de Menu, donde se arma la carta.', false, 1600, 1000)] },
  ],
  nuvix: [
    {
      rotulo: 'El día',
      forma: 'tel',
      tomas: [
        tel('nuvix-dia', 'La pantalla del día en Nuvix.', true),
        tel('nuvix-aplicacion', 'La pantalla de Nuvix que muestra dónde sigue la próxima aplicación.', true),
      ],
    },
    {
      rotulo: 'La historia',
      forma: 'tel',
      tomas: [
        tel('nuvix-historia', 'La historia en Nuvix: lo anotado día por día.', true),
        tel('nuvix-diario', 'El diario de Nuvix: proteínas, agua y cómo se siente la persona.', true),
      ],
    },
  ],
};
