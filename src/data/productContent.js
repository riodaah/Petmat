import config from '../config.json';
import { formatCLP } from '../utils/currency';

// Texto de venta por producto. Todo sale de la ficha y las fotos de cada
// producto; si cambias el producto en el admin, revisa que esto siga siendo cierto.
const MAT_USAGE = [
  { title: 'Esconde', text: 'Reparte pellet o premios entre las telas y bolsillos.' },
  { title: 'Olfatea', text: 'Tu perro los busca con la nariz, a su ritmo.' },
  { title: 'Descansa', text: 'Con 10 a 20 minutos por sesión termina más tranquilo.' }
];

const PRODUCT_CONTENT = {
  'alfombra-olfativa': {
    headline: 'Convierte su comida en un juego de olfato',
    highlights: [
      'Varios escondites distintos: tiras, bolsillos, conos y una bolsa con cordón',
      'Sirve con su pellet de siempre, así come más lento',
      'Base antideslizante: no se corre mientras busca',
      'Tela lavable y resistente al uso diario'
    ],
    usage: MAT_USAGE,
    faqs: [
      {
        question: '¿Sirve para cualquier perro?',
        answer: 'Sí. La usan cachorros, adultos y perros mayores. Las primeras veces acompáñalo y deja los premios a la vista para que entienda el juego.'
      },
      {
        question: '¿Puedo usarla con su comida normal?',
        answer: 'Sí. Puedes repartir parte de su ración de pellet en la alfombra para que coma más lento y se entretenga.'
      }
    ]
  },
  'alfombra-olfativa-circular': {
    headline: 'Felpa larga para esconder premios en segundos',
    highlights: [
      'Felpa larga y tupida donde los premios quedan bien escondidos',
      'Formato circular que ocupa poco espacio',
      'Cordón ajustable en el borde',
      'Fácil de limpiar'
    ],
    usage: MAT_USAGE,
    faqs: [
      {
        question: '¿En qué se diferencia de la alfombra rectangular?',
        answer: 'La circular es más simple: una sola superficie de felpa larga. La rectangular trae varios tipos de escondite y da más desafío.'
      }
    ]
  },
  'comedero-automatico': {
    headline: 'Su comida a la hora, aunque no estés en casa',
    highlights: [
      'Programa horarios y porciones desde la app del celular',
      'Cámara para verlo comer y audio para hablarle',
      'Estanque de 4 litros y plato metálico',
      'Batería de respaldo por si se corta la luz'
    ],
    usage: [
      { title: 'Conecta', text: 'Enchúfalo y vincúlalo a tu WiFi de 2.4 GHz desde la app.' },
      { title: 'Programa', text: 'Define a qué hora come y cuántas porciones.' },
      { title: 'Revisa', text: 'Mira por la cámara que comió, estés donde estés.' }
    ],
    faqs: [
      {
        question: '¿Sirve para perros y gatos?',
        answer: 'Sí. Funciona con alimento seco de 2 a 15 mm, el tamaño habitual del pellet para gatos y perros pequeños o medianos.'
      },
      {
        question: '¿Qué WiFi necesita?',
        answer: 'Una red de 2.4 GHz, la que traen casi todos los routers de casa. No se conecta a redes de 5 GHz.'
      }
    ]
  }
};

const DEFAULT_CONTENT = { headline: '', highlights: [], usage: [], faqs: [] };

export function getProductContent(slug) {
  return PRODUCT_CONTENT[slug] || DEFAULT_CONTENT;
}

const { prep_days_min: prepMin, prep_days_max: prepMax, regions: regionsCost } = config.shipping;

export function getShippingFaqs(deadlines) {
  const faqs = [
    {
      question: '¿Cuánto cuesta y cuánto demora el envío?',
      answer: `En la Región Metropolitana el envío es gratis; a regiones cuesta ${formatCLP(regionsCost)}. Preparamos tu pedido en ${prepMin} a ${prepMax} días hábiles y el despacho tarda 1 a 2 días hábiles en la RM y 2 a 4 en regiones.`
    },
    {
      question: '¿Cómo puedo pagar?',
      answer: 'Con Mercado Pago: tarjetas de débito y crédito. No necesitas tener cuenta en Mercado Pago.'
    },
    {
      question: '¿Y si no me sirve?',
      answer: 'Tienes 30 días desde que lo recibes para devolverlo, sin uso y en su embalaje original. Si llega con una falla, lo cambiamos o te devolvemos el dinero.'
    }
  ];

  if (deadlines) {
    const parts = [];
    if (deadlines.rm) parts.push(`hasta el ${deadlines.rm} si vives en la Región Metropolitana`);
    if (deadlines.regions) parts.push(`hasta el ${deadlines.regions} si vives en regiones`);
    faqs.unshift({
      question: '¿Alcanza a llegar antes de Navidad?',
      answer: `Sí, si haces tu pedido ${parts.join(' y ')}.`
    });
  }

  return faqs;
}
