const PRODUCT_REVIEW_BANK = [
  {
    matchers: ['alfombra olfativa petmat', 'manta olfativa', 'alfombra olfativa'],
    ratingAverage: 5,
    reviews: [
      { author: 'Camila R.', text: 'Mi perro se enfoca altiro. En 15 minutos queda mucho más tranquilo.' },
      { author: 'Javier M.', text: 'Muy buena calidad. Llegó rápido y se nota resistente.' },
      { author: 'Fernanda P.', text: 'La usamos con pellet y funciona perfecto para que coma más lento.' }
    ]
  },
  {
    matchers: ['alfombra olfativa circular', 'circular petmat'],
    ratingAverage: 5,
    reviews: [
      { author: 'Valentina S.', text: 'La forma circular es súper práctica para espacios chicos.' },
      { author: 'Tomás A.', text: 'Mi perrita la amó desde el primer día, cero complicaciones.' },
      { author: 'Pía C.', text: 'Fácil de limpiar y se mantiene impecable.' }
    ]
  },
  {
    matchers: ['comedero automático wifi', 'comedero automático', 'alimentador automático'],
    ratingAverage: 5,
    reviews: [
      { author: 'Rodrigo L.', text: 'La app es simple y las porciones salen exactas. Muy recomendado.' },
      { author: 'Macarena V.', text: 'Me ordenó la rutina completa. Ya no ando corriendo con los horarios.' },
      { author: 'Daniela G.', text: 'Buenísimo para cuando trabajo fuera. Mi gato se adaptó rápido.' }
    ]
  }
];

const GENERAL_TESTIMONIALS = [
  {
    author: 'Paula, Santiago',
    text: 'Se nota que los productos están pensados para el día a día. Mi perro está mucho más calmado.',
    rating: 5
  },
  {
    author: 'Ignacio, Viña del Mar',
    text: 'Compra fácil, despacho rápido y la calidad súper buena.',
    rating: 5
  },
  {
    author: 'Antonia, Concepción',
    text: 'Partí con una manta olfativa y después compré el comedero. Todo impecable.',
    rating: 5
  }
];

export function getReviewsForProduct(product) {
  const blob = `${product?.name || ''} ${product?.short || ''} ${product?.description || ''}`.toLowerCase();
  const entry = PRODUCT_REVIEW_BANK.find((candidate) =>
    candidate.matchers.some((matcher) => blob.includes(matcher))
  );

  if (!entry) {
    return {
      ratingAverage: 5,
      reviews: [{ author: 'Cliente PetMAT', text: 'Excelente producto, cumplió totalmente.' }]
    };
  }

  return {
    ratingAverage: entry.ratingAverage,
    reviews: entry.reviews
  };
}

export function getGeneralTestimonials() {
  return GENERAL_TESTIMONIALS;
}
