// La página de cada producto dentro de la web de Salix: todo lo que el producto ya cuenta en su propia
// web, con la estética de la casa. No es donde se contrata: de acá se va a la web del producto.
// Cada texto está tomado de lo que el producto publica (2026-11-20): Flux, de su portada y de
// /funciones y /planes; Menu, de su portada, /funciones y /planes; Nuvix, de su portada, /funciones y
// /preguntas. Si el producto cambia un texto, se cambia acá. Los precios no se copian: se enlazan.
import { ancha, tel, telMenu, type Toma, type Vista } from './capturas';

export interface Hecho {
  titulo: string;
  texto: string;
}

/** Una parada de la línea del producto: una parte de lo que hace, con sus capturas. */
export interface Bloque {
  id: string;
  /** El nombre de la parada, corto: va sobre la línea. */
  parada: string;
  /** El título, en dos voces: un renglón liviano (puede faltar) y el que manda. */
  liviana: string | null;
  tinta: string;
  bajada?: string;
  hechos: Hecho[];
  /** Sin capturas, los hechos se reparten a lo ancho. */
  vistas: Vista[];
  /** Cada hecho elige su captura: tiene que haber tantas vistas como hechos. */
  enlazadas?: boolean;
  nota?: string;
}

export interface Grupo {
  nombre: string;
  que: string;
  modulos: string[];
}

export interface DetalleProducto {
  /** Para quién es, sobre el título. */
  antetitulo?: string;
  liviana: string | null;
  tinta: string;
  bajada: string;
  nota?: string;
  bloques: Bloque[];
  /** El índice de módulos (solo Flux). */
  modulos?: { parada: string; liviana: string; tinta: string; bajada: string; grupos: Grupo[] };
  donde: { liviana: string | null; tinta: string; bajada?: string; hechos: Hecho[] };
  planes: { parada: string; liviana: string | null; tinta: string; textos: string[]; enlace?: { href: string; texto: string } };
}

/** Una pantalla del teléfono de Flux en sus dos modos: va primero el del tema que se está viendo. */
const dosModos = (archivo: string, alt: string): Toma[] => [
  { ...tel(archivo, `${alt} En modo claro.`), modo: 'claro' },
  { ...tel(`${archivo}-oscuro`, `${alt} En modo oscuro.`), modo: 'oscuro' },
];

export const DETALLES: Record<string, DetalleProducto> = {
  flux: {
    liviana: 'Todo tu negocio.',
    tinta: 'En un solo lugar.',
    bajada: 'Los mensajes, los presupuestos, las visitas, las facturas y el equipo, en un mismo sistema. En la computadora y en el teléfono.',
    nota: '30 días de prueba, sin tarjeta.',
    bloques: [
      {
        id: 'recorrido',
        parada: 'El recorrido',
        liviana: 'Del primer mensaje',
        tinta: 'al cobro.',
        enlazadas: true,
        hechos: [
          { titulo: 'Llega la consulta', texto: 'WhatsApp, Instagram, Messenger y el correo de la empresa se atienden desde Flux. Se ve quién tiene cada conversación y cuál falta contestar.' },
          { titulo: 'Sale el presupuesto', texto: 'Con tus productos y tus precios. El cliente lo recibe por un enlace y lo acepta desde su teléfono, con firma.' },
          { titulo: 'Se hace el trabajo', texto: 'Del presupuesto aceptado sale la orden de trabajo. Quien va la ve en su día, avisa que está en camino, saca fotos y anota lo que hizo.' },
          { titulo: 'Se factura y se cobra', texto: 'La factura electrónica de ARCA sale del mismo presupuesto, entero o de a pagos. Lo cobrado queda anotado y el saldo, a la vista.' },
        ],
        vistas: [
          { rotulo: 'Mensajes', forma: 'ancha', tomas: [ancha('flux-mac', 'La mensajería de Flux en la computadora: la lista de conversaciones a un lado y un chat de WhatsApp abierto.', true)] },
          { rotulo: 'Presupuesto', forma: 'ancha', tomas: [ancha('flux-presupuesto', 'La ficha de un presupuesto en Flux: los renglones, las condiciones, el total y el estado.', true)] },
          { rotulo: 'Orden', forma: 'ancha', tomas: [ancha('flux-orden', 'Una orden de trabajo en Flux: las tareas, quién las tiene y el avance.', true)] },
          { rotulo: 'Facturas', forma: 'ancha', tomas: [ancha('flux-facturacion', 'El listado de facturas de Flux, con el estado de cobro de cada una.', true)] },
        ],
      },
      {
        id: 'dia',
        parada: 'El día',
        liviana: 'El resto del día,',
        tinta: 'también está adentro.',
        bajada: 'Lo que hoy vive en otras aplicaciones, en una planilla o en la memoria de alguien.',
        enlazadas: true,
        hechos: [
          { titulo: 'Calendario', texto: 'Reuniones, visitas y vencimientos del equipo. Si se reprograma un evento, se mueve la visita o la orden.' },
          { titulo: 'Embudo', texto: 'Cada negociación en su etapa, con su monto y su responsable. Varios trabajos de un mismo cliente no se mezclan.' },
          { titulo: 'Presupuestos', texto: 'Todos los presupuestos con su estado: cuál se envió, cuál se confirmó y cuánto falta cobrar de cada uno.' },
          { titulo: 'Actividades', texto: 'Qué hay que hacer, quién y para cuándo. Las atrasadas no se pierden.' },
          { titulo: 'Métricas', texto: 'Cómo viene el negocio: lo cobrado en el mes, lo que está abierto y lo ganado en el año.' },
          { titulo: 'Asistencias', texto: 'Quién fichó, a qué hora y desde dónde. Sobre esos registros se liquidan los sueldos.' },
        ],
        vistas: [
          { rotulo: 'Calendario', forma: 'ancha', tomas: [ancha('flux-calendario', 'El calendario de Flux en la computadora, en vista de semana.', true)] },
          { rotulo: 'Embudo', forma: 'ancha', tomas: [ancha('flux-oportunidades', 'El embudo de ventas de Flux en tablero, con cada oportunidad en su etapa.', true)] },
          { rotulo: 'Presupuestos', forma: 'ancha', tomas: [ancha('flux-presupuestos', 'El listado de presupuestos de Flux, con el estado y lo cobrado de cada uno.', true)] },
          { rotulo: 'Actividades', forma: 'ancha', tomas: [ancha('flux-actividades', 'Las actividades del equipo en Flux, con su vencimiento y su responsable.', true)] },
          { rotulo: 'Métricas', forma: 'ancha', tomas: [ancha('flux-metricas', 'Las métricas de Flux: lo cobrado en el mes, los presupuestos abiertos y lo ganado en el año.', true)] },
          { rotulo: 'Asistencias', forma: 'ancha', tomas: [ancha('flux-asistencias', 'Las asistencias del equipo en Flux, en su vista de matriz.', true)] },
        ],
      },
      {
        id: 'calle',
        parada: 'En la calle',
        liviana: 'Y en la calle,',
        tinta: 'va en el bolsillo.',
        bajada: 'Quien visita, instala o entrega trabaja desde el teléfono, con lo mismo que ve la oficina.',
        enlazadas: true,
        hechos: [
          { titulo: 'El recorrido del día', texto: 'Las paradas en orden y el aviso al cliente de que están en camino.' },
          { titulo: 'La orden de trabajo', texto: 'Las tareas, las fotos y lo que se hizo, anotado en el momento.' },
          { titulo: 'Los mensajes', texto: 'El mismo chat que ve la oficina, con la ficha del cliente a un toque.' },
        ],
        vistas: [
          { rotulo: 'Recorrido', forma: 'tel', tomas: dosModos('flux-tel-recorrido', 'El recorrido del día en Flux, en el iPhone, con las paradas sobre el mapa.') },
          { rotulo: 'Orden', forma: 'tel', tomas: dosModos('flux-tel-orden', 'Una orden de trabajo en Flux, en el iPhone: las tareas hechas y las que faltan.') },
          { rotulo: 'Mensajes', forma: 'tel', tomas: dosModos('flux-tel-chat', 'Una conversación de WhatsApp atendida desde Flux en el iPhone.') },
        ],
      },
    ],
    modulos: {
      parada: 'Módulos',
      liviana: 'El sistema completo,',
      tinta: 'módulo por módulo.',
      bajada: 'Cada bloque corresponde a un área de la operación. Se activa únicamente lo que el plan habilita y la empresa instala.',
      grupos: [
        { nombre: 'Base del producto', que: 'Incluido en todos los planes', modulos: ['Aplicación web (PWA)', 'App nativa para iPhone', 'Inbox y mensajería interna', 'Calendario y actividades'] },
        { nombre: 'Ventas y clientes', que: 'Del primer contacto a la aceptación', modulos: ['WhatsApp', 'Contactos', 'Oportunidades', 'Presupuestos y productos'] },
        { nombre: 'Operaciones en campo', que: 'El equipo en terreno, visible en el sistema', modulos: ['Visitas y recorrido', 'Órdenes de trabajo', 'Biblioteca'] },
        { nombre: 'Facturación y finanzas', que: 'Comprobantes, tesorería e indicadores', modulos: ['Facturación ARCA', 'Finanzas', 'Métricas'] },
        { nombre: 'Personas', que: 'Asistencia, liquidación y accesos', modulos: ['Asistencias y kiosco', 'Nóminas', 'Usuarios y permisos'] },
        { nombre: 'Automatización', que: 'IA, flujos y presencia digital', modulos: ['Salix IA', 'Flujos', 'Mi Web', 'Marketing'] },
      ],
    },
    donde: {
      liviana: 'En la computadora se arma.',
      tinta: 'En el teléfono se trabaja.',
      bajada: 'Es el mismo Flux en las dos. Lo que cambia en una se ve en la otra en el momento.',
      hechos: [
        { titulo: 'Se instala desde el navegador', texto: 'La aplicación web se instala en Windows, Mac, iPhone, iPad y Android, y queda como una aplicación más, con sus avisos.' },
        { titulo: 'App nativa para iPhone', texto: 'Muy pronto en App Store, independiente de la aplicación web.' },
        { titulo: 'Claro y oscuro', texto: 'Sigue al aparato, o lo elegís vos.' },
        { titulo: 'Tres idiomas', texto: 'Español, inglés y portugués.' },
      ],
    },
    planes: {
      parada: 'Planes',
      liviana: 'Tres planes.',
      tinta: '30 días de prueba, sin tarjeta.',
      textos: [
        'Después de la prueba elegís mensual o anual. Cambiás o cancelás cuando quieras.',
        'Precios en dólares. Se paga en pesos con Mercado Pago, al cambio del día de cada cobro.',
      ],
      enlace: { href: 'https://flux.salixweb.com/planes', texto: 'Ver los planes' },
    },
  },

  menu: {
    antetitulo: 'Para bares, cafés, restaurantes y casas de comida',
    liviana: 'Que tu carta se vea tan bien',
    tinta: 'como tu comida.',
    bajada: 'Clásica o tipo redes, en el idioma de tu cliente, con el Wi-Fi y tus reseñas en el mismo QR. Y el QR no cambia nunca.',
    nota: 'Armá tu carta sin tarjeta. Al publicarla, 30 días gratis.',
    bloques: [
      {
        id: 'cartas',
        parada: 'Dos cartas',
        liviana: 'Dos cartas,',
        tinta: 'la que va con tu lugar.',
        bajada: 'Clásica, como una carta impresa bien diseñada. O visual, con cada plato a pantalla completa, como en tus redes. La cambiás cuando quieras, sin perder nada.',
        hechos: [
          { titulo: 'Clásica: como una carta impresa', texto: 'Para el restaurante, la parrilla o el bodegón: se lee de arriba abajo.' },
          { titulo: 'Visual: como tus redes', texto: 'Para el café, la hamburguesería o el bar: se elige con los ojos.' },
        ],
        vistas: [
          {
            rotulo: 'Las dos cartas',
            forma: 'tel',
            tomas: [
              telMenu('menu-clasica', 'Una carta de Menu en su versión clásica, en un teléfono.'),
              telMenu('menu-visual', 'La misma carta en su versión visual.'),
            ],
          },
        ],
      },
      {
        id: 'cliente',
        parada: 'Tu cliente, en la mesa',
        liviana: 'Todo lo que busca,',
        tinta: 'en un solo QR.',
        hechos: [
          { titulo: 'En su idioma, sin tocar nada', texto: 'Si su teléfono está en inglés, la carta abre en inglés. Tu idioma queda abajo, en chico, para el mozo.' },
          { titulo: 'El Wi-Fi de un toque', texto: 'Copian la clave o escanean para conectarse. Si cambiás la clave, el cartel sigue sirviendo.' },
          { titulo: 'Tus reseñas y tus redes', texto: 'Un botón para calificarte en Google y tus redes a mano. Los prendés cuando quieras.' },
        ],
        vistas: [
          { rotulo: 'En inglés', forma: 'tel', tomas: [telMenu('menu-comensal', 'La carta de una cafetería de muestra abierta en inglés, con el nombre de cada plato en español debajo, en chico.')] },
        ],
      },
      {
        id: 'celular',
        parada: 'Vos, desde el celular',
        liviana: 'Tu carta cambia',
        tinta: 'cuando cambia tu día.',
        hechos: [
          { titulo: 'Cambiás un precio y publicás', texto: 'El próximo que abre la carta ya lo ve. El QR impreso no cambia.' },
          { titulo: 'Marcás lo que se terminó', texto: 'No lo borrás: queda «Agotado» hasta que vuelva.' },
          { titulo: 'El menú de hoy, arriba de todo', texto: 'Cargás la semana una vez y cada día aparece solo el suyo, destacado como «Hoy».' },
          { titulo: 'Tus promos, a la vista', texto: 'Combos y ofertas con foto, destacados en la portada de tu carta y como historia en la visual.' },
        ],
        vistas: [
          {
            rotulo: 'Agotado',
            forma: 'tel',
            tomas: [
              telMenu('menu-agotado-panel', 'El panel de Menu en el teléfono: un plato recién marcado como agotado, con el botón para reponerlo.'),
              telMenu('menu-agotado-carta', 'La carta que ve el cliente: el mismo plato con el rótulo «Agotado» y el precio tachado.'),
            ],
          },
        ],
        nota: 'Todo se prende si lo usás. Si no, no aparece.',
      },
      {
        id: 'pedidos',
        parada: 'Planes Pro y Max',
        liviana: 'Te piden',
        tinta: 'desde la carta.',
        bajada: 'Tu cliente arma su pedido en «Mi selección» y lo manda. Te llega por WhatsApp con el total y queda en tu panel.',
        hechos: [
          { titulo: 'En la mesa o para llevar', texto: 'Con el QR de cada mesa, el pedido ya dice de qué mesa es. Desde la casa, eligen retiro o envío.' },
          { titulo: 'Te llega por WhatsApp', texto: 'Con el detalle, las notas y el total calculado con tu carta. Y queda en el historial de tu panel.' },
          { titulo: 'Te pagan como vos elegís', texto: 'Alias, CBU, tu link de Mercado Pago o en el local. La plata va directo a vos.' },
        ],
        vistas: [],
      },
      {
        id: 'ademas',
        parada: 'Y además',
        liviana: 'Salix hace',
        tinta: 'la parte pesada.',
        enlazadas: true,
        hechos: [
          { titulo: 'Lee tu carta de papel', texto: 'Le sacás una foto a tu carta de papel y Salix la lee; después la traduce. Vos revisás todo antes de publicar.' },
          { titulo: 'Sabé cuánta gente te mira', texto: 'Con el plan Max: cuánta gente abre tu carta y tu Wi-Fi, día por día y mes a mes. Sin datos personales.' },
          { titulo: 'También desde la computadora', texto: 'El mismo panel, en el navegador y con la misma cuenta. Cambiás algo y al lado ves cómo le queda a tu cliente.' },
        ],
        vistas: [
          { rotulo: 'Salix', forma: 'tel', tomas: [telMenu('menu-ia', 'El panel de Menu leyendo la foto de una carta de papel para armar las secciones y los productos.')] },
          { rotulo: 'Visitas', forma: 'tel', tomas: [telMenu('menu-visitas', 'La tarjeta «Visitas a tu carta» del panel de Menu: las visitas del mes, día por día, y cuántos usaron el Wi-Fi.')] },
          { rotulo: 'El panel', forma: 'ancha', tomas: [ancha('menu-panel', 'El panel de Menu en una computadora: la pantalla de diseño de la carta y, al lado, la vista previa en un teléfono.', false, 1600, 1000)] },
        ],
      },
    ],
    donde: {
      liviana: 'Sin descargar nada.',
      tinta: 'En el idioma de quien la abre.',
      hechos: [
        { titulo: 'Tus clientes', texto: 'Escanean el QR y ven la carta en el navegador del celular, sin descargar nada.' },
        { titulo: 'Vos', texto: 'La manejás desde cualquier dispositivo. La instalás como app, sin tienda.' },
        { titulo: 'Hasta seis idiomas', texto: 'Español, inglés, portugués, francés, italiano y alemán. Pro trae tu idioma y uno más; Max, los seis.' },
      ],
    },
    planes: {
      parada: 'Planes',
      liviana: 'Armá tu carta gratis y sin tarjeta.',
      tinta: 'Al publicarla, 30 días gratis.',
      textos: [
        'Elegís Pro o Max, mensual o anual. Cancelás cuando quieras.',
        'Por Mercado Pago, en pesos. El precio está en dólares y se cobra en pesos con la cotización del día.',
      ],
      enlace: { href: 'https://menu.salixweb.com/planes', texto: 'Ver los planes' },
    },
  },

  nuvix: {
    liviana: 'Cuándo te toca.',
    tinta: 'Dónde sigue.',
    bajada: 'Nuvix es un registro personal para quien lleva un tratamiento inyectable semanal o diario. Anotás cada aplicación y la app te muestra cuándo vuelve a tocar y en qué lugar sigue.',
    nota: 'Para iPhone, en español y en inglés. Próximamente en el App Store.',
    bloques: [
      {
        id: 'tratamiento',
        parada: 'Tratamiento y lugares',
        liviana: 'Cuándo toca',
        tinta: 'y dónde sigue.',
        bajada: 'El inicio lo manda el tratamiento: cuántos días faltan, cuándo fue la última aplicación y en qué lugar sigue.',
        hechos: [
          { titulo: 'Registrar en un toque', texto: 'La dosis ya viene puesta: es la que anotaste como indicada por tu médico. Si usaste otro punto, lo marcás y el recorrido sigue desde ahí.' },
          { titulo: 'El reloj del abdomen', texto: 'Cuatro, seis u ocho puntos alrededor del ombligo. Con cuatro puntos y una aplicación por semana, cada punto vuelve a tocar cada 28 días.' },
          { titulo: 'Muslos y brazos', texto: 'Dos lugares de cada lado, arriba y abajo. Sigue el que hace más tiempo que no usás.' },
          { titulo: 'Dosis indicada y dosis aplicada', texto: 'Se guardan por separado. Un cambio de dosis lo anotás vos cuando tu médico lo indica: la app no lo sugiere.' },
          { titulo: 'Calendario de puntos', texto: 'Un punto por aplicación, con el color de su dosis. La meta la ponés vos: en aplicaciones, en días o sin fecha de fin.' },
          { titulo: 'Un aviso, el día que toca', texto: 'A la hora que elegís y sin nombrar el medicamento ni la dosis.' },
        ],
        vistas: [
          {
            rotulo: 'El abdomen',
            forma: 'tel',
            tomas: [
              tel('nuvix-aplicacion', 'Anotar una aplicación en Nuvix: el reloj del abdomen marca dónde fue la última y dónde sigue, con la dosis de siempre y el día.', true),
              tel('nuvix-recorrido', 'El recorrido del abdomen: cuatro puntos alrededor del ombligo, y cada punto vuelve a tocar cada 28 días.', true),
            ],
          },
          {
            rotulo: 'Muslos y brazos',
            forma: 'tel',
            tomas: [
              tel('nuvix-aplicacion-muslos', 'Anotar una aplicación en el muslo: la figura muestra los cuatro lugares y cuál sigue.', true),
              tel('nuvix-aplicacion-brazos', 'Anotar una aplicación en el brazo: el dibujo de espaldas muestra los cuatro lugares y cuál sigue.', true),
            ],
          },
          { rotulo: 'Avisos', forma: 'tel', tomas: [tel('nuvix-avisos', 'Los avisos de Nuvix: el día que toca, a la hora elegida, sin nombrar el medicamento ni la dosis.', true)] },
        ],
        nota: 'Los lugares son una ayuda para no repetir el punto. Dónde y cómo aplicarte lo indican tu médico y el prospecto.',
      },
      {
        id: 'peso',
        parada: 'Peso y progreso',
        liviana: 'Tu peso y tus medidas,',
        tinta: 'solo los hechos.',
        bajada: 'Anotás cuando querés. La app muestra los números y su variación, sin opinar sobre el avance.',
        hechos: [
          { titulo: 'Una regla, no un teclado', texto: 'El peso se elige deslizando, de a 100 gramos. Un pesaje por día.' },
          { titulo: 'Salud de Apple, si querés', texto: 'Nuvix puede leer el peso que tu balanza escribe en Salud y guardar ahí el que anotás. Arranca apagado y ningún peso entra sin que lo veas.' },
          { titulo: 'Medidas opcionales', texto: 'Cintura y cadera, con el dibujo de cómo medir.' },
          { titulo: 'Ocultar el número', texto: 'Un toque esconde los kilos y los centímetros en toda la app.' },
          { titulo: 'La meta es tuya', texto: 'Si querés una, la ponés vos. La app no la sugiere.' },
        ],
        vistas: [
          {
            rotulo: 'Peso y medidas',
            forma: 'tel',
            tomas: [
              tel('nuvix-peso', 'Anotar el peso en Nuvix deslizando una regla, de a 100 gramos.', true),
              tel('nuvix-medidas', 'Cómo medir la cintura, dibujado sobre la figura, con los pasos escritos.', true),
            ],
          },
        ],
      },
      {
        id: 'diario',
        parada: 'Diario',
        liviana: 'Lo de todos los días,',
        tinta: 'en segundos.',
        bajada: 'Comidas, agua, actividad y cómo te sentís, al lado del día de aplicación.',
        hechos: [
          { titulo: 'Comidas y proteínas', texto: 'Anotás lo que comiste y las proteínas se suman contra tu meta. Las elegís de una tabla de alimentos o las ponés a mano.' },
          { titulo: 'Agua', texto: 'Vaso, botella o tus propios botones rápidos. Se puede deshacer.' },
          { titulo: 'Actividad y rutinas', texto: 'Una rutina se carga una vez («los martes, pádel a las 19») y después solo se confirma.' },
          { titulo: 'Cómo me siento', texto: 'Energía, hambre, náuseas, saciedad y ganas de picotear en escalas, y síntomas para marcar. Son para anotar: la app no los interpreta.' },
          { titulo: 'Tu historia', texto: 'Lo anotado por mes, por semana y por día, contra las metas que pusiste vos. La ficha de cada día se puede completar y corregir.' },
        ],
        vistas: [
          {
            rotulo: 'Comidas y agua',
            forma: 'tel',
            tomas: [
              tel('nuvix-diario', 'El diario de Nuvix: proteínas contra la meta propia, agua con botones rápidos y cómo me siento.', true),
              tel('nuvix-agua', 'Anotar agua con una regla y con los botones rápidos del vaso y la botella.', true),
            ],
          },
          {
            rotulo: 'Cómo me siento',
            forma: 'tel',
            tomas: [
              tel('nuvix-bienestar', '«Cómo me siento»: energía, hambre, náuseas, saciedad y ganas de picotear en escalas, y síntomas para marcar.', true),
              tel('nuvix-rutinas', 'Mis rutinas: lo que se hace siempre los mismos días, para confirmar con un toque.', true),
            ],
          },
          {
            rotulo: 'Tu historia',
            forma: 'tel',
            tomas: [
              tel('nuvix-historia', '«Tu historia» día por día: lo anotado contra la meta propia, con el día de aplicación marcado.', true),
              tel('nuvix-dia', 'La ficha de un día: la aplicación, el peso, las comidas y el agua, en orden de hora.', true),
            ],
          },
        ],
      },
      {
        id: 'estudios',
        parada: 'Estudios',
        liviana: 'Tus análisis,',
        tinta: 'con su propio rango.',
        bajada: 'Una ficha con tus estudios de laboratorio y cada valor a lo largo del tiempo.',
        hechos: [
          { titulo: 'El rango es el del informe', texto: 'Nuvix guarda el valor, la unidad y el rango de referencia que imprime tu laboratorio, y dice si está en rango, por encima o por debajo de ese rango.' },
          { titulo: 'No interpreta', texto: 'Son datos que guardás vos. La app no dice qué significan ni qué hacer con ellos.' },
          { titulo: 'El informe, adjunto', texto: 'Podés guardar el PDF o la foto junto a sus valores, en un espacio privado de tu cuenta.' },
        ],
        vistas: [
          {
            rotulo: 'Estudios',
            forma: 'tel',
            tomas: [
              tel('nuvix-estudios', 'La ficha de estudios: cada valor comparado con el rango que trae su propio informe.', true),
              tel('nuvix-estudio-valor', 'Un valor de laboratorio a lo largo del tiempo, con la franja del rango de cada informe.', true),
            ],
          },
        ],
      },
      {
        id: 'salix-ia',
        parada: 'Salix IA',
        liviana: 'Contale tu día.',
        tinta: 'Vos confirmás.',
        bajada: 'El asistente de Nuvix arma los registros a partir de lo que le contás. Es opcional y viene apagado.',
        hechos: [
          { titulo: 'Texto o voz', texto: 'Escribís o dictás. El dictado usa el reconocimiento de voz de Apple y el audio no se guarda.' },
          { titulo: 'Propone, no decide', texto: 'Cada propuesta llega en una tarjeta para guardar, corregir o descartar. Lo que no dijiste va marcado como estimado.' },
          { titulo: 'Límites que no se negocian', texto: 'No calcula ni sugiere dosis, no interpreta síntomas ni estudios y no da consejos de salud. Ante esas preguntas, te deriva a tu médico.' },
          { titulo: 'Con un proveedor que se nombra', texto: 'Usa Claude, de Anthropic. Se envía tu mensaje y lo mínimo para entenderlo; nunca tu nombre ni tu correo.' },
        ],
        vistas: [
          {
            rotulo: 'Salix IA',
            forma: 'tel',
            tomas: [
              tel('nuvix-ia-dia', 'Salix IA: la persona cuenta su día y el asistente propone tres registros para corregir o guardar.', true),
              tel('nuvix-ia-limites', 'Salix IA ante una pregunta de dosis: «Eso lo define tu médico: yo no calculo ni sugiero dosis».', true),
            ],
          },
        ],
      },
      {
        id: 'informe',
        parada: 'Informe para el médico',
        liviana: 'Un PDF',
        tinta: 'para la consulta.',
        bajada: 'Se llama «Registro del tratamiento» y junta los hechos del período que elijas.',
        hechos: [
          { titulo: 'Dosis', texto: 'La indicada y la aplicada.' },
          { titulo: 'Aplicaciones', texto: 'Cada una con su fecha y su lugar.' },
          { titulo: 'Peso y medidas', texto: 'Con su gráfico. Si tenés el peso oculto, el informe arranca sin peso.' },
          { titulo: 'Diario', texto: 'Conteos de lo anotado y el agua.' },
          { titulo: 'Antes de compartir', texto: 'Lo ves entero. Se arma en tu teléfono y no sale de ahí hasta que lo compartís.' },
        ],
        vistas: [],
        nota: 'Son datos cargados por vos, y el informe lo dice. No es un documento médico.',
      },
    ],
    donde: {
      liviana: 'Para iPhone,',
      tinta: 'en español y en inglés.',
      hechos: [
        { titulo: '¿Ya se puede descargar?', texto: 'Todavía no. Va a estar disponible en el App Store.' },
        { titulo: '¿En qué idiomas está?', texto: 'En español y en inglés.' },
        { titulo: '¿Hay versión para Android?', texto: 'Por ahora Nuvix es solo para iPhone.' },
      ],
    },
    planes: {
      parada: 'Precio',
      liviana: '¿Cuánto cuesta?',
      tinta: 'Todavía no está definido.',
      textos: ['Los precios se van a publicar en la web de Nuvix antes de que la app salga.'],
      enlace: { href: 'https://nuvix.salixweb.com/preguntas', texto: 'Ver las preguntas' },
    },
  },
};
