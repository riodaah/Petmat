import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatCLP } from '../utils/currency';
import { useCart } from '../hooks/useCart';
import ProductGallery from './ProductGallery';
import ProductCard from './ProductCard';
import ScrollReveal from './ScrollReveal';
import SeoHead from './SeoHead';
import Badge from './Badge';
import StarRating from './StarRating';
import FAQBlock from './FAQBlock';
import Breadcrumbs from './Breadcrumbs';
import config from '../config.json';
import { getProducts } from '../services/productService';
import { BLOG_POSTS } from '../data/seoContent';
import { buildAbsoluteUrl, buildBreadcrumbSchema } from '../lib/seo';

const ProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  const inferCategory = (item) => {
    const blob = `${item.name} ${item.short} ${item.description}`.toLowerCase();
    if (blob.includes('manta') || blob.includes('alfombra') || blob.includes('olfativa')) {
      return { label: 'Manta olfativa para perros', path: '/manta-olfativa-para-perros' };
    }
    if (blob.includes('gato') && (blob.includes('comedero') || blob.includes('alimentador'))) {
      return { label: 'Comedero automático para gatos', path: '/comedero-automatico-para-gatos' };
    }
    if (blob.includes('comedero') || blob.includes('alimentador')) {
      return { label: 'Comedero automático para perros', path: '/comedero-automatico-para-perros' };
    }
    if (blob.includes('slow feeder') || blob.includes('come rápido') || blob.includes('alimentación lenta')) {
      return { label: 'Alimentación lenta para perros', path: '/alimentacion-lenta-para-perros' };
    }
    return { label: 'Juguetes interactivos para perros', path: '/juguetes-interactivos-para-perros' };
  };

  const inferBlogLinks = (item) => {
    const blob = `${item.name} ${item.short} ${item.description}`.toLowerCase();
    if (blob.includes('manta') || blob.includes('olfativa')) {
      return BLOG_POSTS.filter((post) =>
        ['que-es-una-manta-olfativa-para-perros', 'juegos-de-olfato-para-perros-en-casa'].includes(post.slug)
      );
    }
    if (blob.includes('come rápido') || blob.includes('slow feeder')) {
      return BLOG_POSTS.filter((post) => post.slug === 'mi-perro-come-muy-rapido-riesgos-y-soluciones');
    }
    if (blob.includes('comedero') || blob.includes('alimentador')) {
      return BLOG_POSTS.filter((post) => post.slug === 'comedero-automatico-para-perros-cuando-conviene');
    }
    return BLOG_POSTS.filter((post) =>
      ['mi-perro-esta-inquieto-causas-y-como-ayudarlo', 'enriquecimiento-mental-para-perros-ideas-simples'].includes(post.slug)
    );
  };

  useEffect(() => {
    const load = async () => {
      const products = await getProducts();
      const foundProduct = products.find((p) => p.slug === slug);

      if (!foundProduct) {
        navigate('/tienda');
        return;
      }

      setProduct(foundProduct);

      // Productos recomendados (otros productos excepto el actual)
      const recommended = products
        .filter((p) => p.id !== foundProduct.id)
        .slice(0, 2);
      setRecommendedProducts(recommended);

      // Scroll to top
      window.scrollTo(0, 0);
    };

    load().catch((error) => {
      console.error('Error cargando detalle de producto:', error);
      navigate('/tienda');
    });
  }, [slug, navigate]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  const productCategory = inferCategory(product);
  const relatedPosts = inferBlogLinks(product).slice(0, 2);
  const breadcrumbItems = [
    { label: 'Inicio', path: '/' },
    { label: productCategory.label, path: productCategory.path },
    { label: product.name, path: `/producto/${product.slug}` }
  ];

  const isStarProduct = productCategory.path === '/manta-olfativa-para-perros';
  const showAggregateRating = product.reviewsCount > 0 && product.ratingAverage > 0;

  const productFaqs = [
    {
      question: '¿Para qué tipo de mascota sirve este producto?',
      answer:
        'Depende del modelo, pero en general está pensado para perros y gatos según la descripción. Si tienes dudas, escríbenos y te orientamos.'
    },
    {
      question: '¿Cuánto tarda el despacho?',
      answer: `Preparamos pedidos en ${config.shipping.prep_days_min} a ${config.shipping.prep_days_max} días hábiles. Enviamos a todo Chile.`
    },
    {
      question: '¿Este producto tiene garantía?',
      answer:
        'Sí, todos nuestros productos están respaldados por políticas claras de cambios y devoluciones para compras online.'
    }
  ];

  const schemaProduct = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.short,
    image: (product.images || []).slice(0, 5),
    sku: String(product.id),
    brand: {
      '@type': 'Brand',
      name: 'PetMAT'
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'CLP',
      price: product.offerPrice || product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: buildAbsoluteUrl(`/producto/${product.slug}`)
    }
  };

  if (showAggregateRating) {
    schemaProduct.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.ratingAverage,
      reviewCount: product.reviewsCount
    };
  }

  const schemaFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: productFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-white">
      <SeoHead
        title={`${product.name} | PetMAT Chile`}
        description={product.short || product.description}
        image={product.images?.[0]}
        schemas={[schemaProduct, buildBreadcrumbSchema(breadcrumbItems), schemaFaq]}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Contenido principal */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galería */}
          <ScrollReveal>
            <ProductGallery images={product.images} productName={product.name} />
          </ScrollReveal>

          {/* Información del producto */}
          <ScrollReveal delay={0.2}>
            <div className="space-y-6">
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.hasOffer && <Badge type="oferta">Oferta</Badge>}
                  {isStarProduct && <Badge type="mas-vendido">Más vendido</Badge>}
                  {product.isNew && <Badge type="nuevo">Nuevo</Badge>}
                  <Badge type="envio">Envíos a todo Chile</Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-text mb-4">
                  {product.name}
                </h1>
                <p className="text-xl text-gray-600">
                  {product.short}
                </p>
                <div className="mt-3">
                  <StarRating value={product.ratingAverage} count={product.reviewsCount} />
                </div>
              </div>

              {/* Precio */}
              <div className="py-6 border-y border-gray-200">
                {product.hasOffer && product.offerPrice ? (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl text-gray-400 line-through">{formatCLP(product.price)}</span>
                    <span className="text-4xl font-heading font-bold text-primary">{formatCLP(product.offerPrice)}</span>
                  </div>
                ) : (
                  <span className="text-4xl font-heading font-bold text-primary">{formatCLP(product.price)}</span>
                )}
              </div>

              {/* Beneficios rápidos */}
              <div>
                <h2 className="font-heading font-semibold text-lg text-text mb-3">Beneficios rápidos</h2>
                <ul className="space-y-2">
                  <li className="text-gray-700">- Menos aburrimiento, más estimulación mental</li>
                  <li className="text-gray-700">- Uso simple en casa y rutina diaria</li>
                  <li className="text-gray-700">- Materiales diseñados para uso frecuente</li>
                  <li className="text-gray-700">- Ideal para perros inquietos o con mucha energía</li>
                </ul>
              </div>

              {/* Características */}
              {product.features && product.features.length > 0 && (
                <div>
                  <h3 className="font-heading font-semibold text-lg text-text mb-3">
                    Características
                  </h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Selector de cantidad */}
              <div>
                <label className="block font-heading font-semibold text-text mb-2">
                  Cantidad
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-muted transition-colors"
                    >
                      -
                    </button>
                    <span className="px-6 py-2 font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-muted transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="w-full px-6 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-[#5AB5D9] transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Agregar al carrito
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  className="w-full px-6 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors duration-200"
                >
                  Comprar ahora
                </motion.button>
              </div>

              {/* Información de envío */}
              <div className="bg-muted rounded-lg p-6 space-y-3">
                <h2 className="font-heading font-semibold text-text mb-3">Compra con confianza</h2>
                <div className="space-y-2 text-sm text-gray-700">
                  <p className="flex items-start">
                    <svg className="w-5 h-5 text-primary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Envíos a todo Chile</span>
                  </p>
                  <p className="flex items-start">
                    <svg className="w-5 h-5 text-primary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>RM: Gratis | Regiones: {formatCLP(config.shipping.regions)}</span>
                  </p>
                  <p className="flex items-start">
                    <svg className="w-5 h-5 text-primary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Preparación: {config.shipping.prep_days_min} a {config.shipping.prep_days_max} días hábiles</span>
                  </p>
                  <p className="flex items-start">
                    <svg className="w-5 h-5 text-primary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>No se ofrece retiro a domicilio. Solo envíos.</span>
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-14 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-text mb-4">Descripción emocional y funcional</h2>
            <p className="text-gray-700 leading-relaxed">
              {product.description || product.short}. Este producto está pensado para que la rutina diaria sea más simple para ti y más entretenida para tu mascota. En PetMAT trabajamos con soluciones que responden a problemas reales del día a día: inquietud, aburrimiento y alimentación desordenada.
            </p>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-text mb-4">¿Para qué sirve?</h2>
            <p className="text-gray-700 leading-relaxed">
              Sirve para transformar momentos cotidianos en experiencias más saludables y estimulantes. Dependiendo del tipo de producto, puede ayudar a bajar ansiedad, aumentar el foco mental, hacer la comida más entretenida o mantener una rutina más ordenada.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6">
            <h3 className="text-xl font-heading font-bold mb-3">Beneficios</h3>
            <ul className="space-y-2 text-gray-700">
              <li>- Más calma en casa</li>
              <li>- Mejor estímulo mental</li>
              <li>- Rutina diaria más predecible</li>
              <li>- Enfoque en bienestar real</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl p-6">
            <h3 className="text-xl font-heading font-bold mb-3">Cómo usar</h3>
            <ul className="space-y-2 text-gray-700">
              <li>- Preséntalo de forma gradual</li>
              <li>- Usa sesiones cortas al inicio</li>
              <li>- Ajusta dificultad según avance</li>
              <li>- Mantén una rutina constante</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl p-6">
            <h3 className="text-xl font-heading font-bold mb-3">Ideal para...</h3>
            <ul className="space-y-2 text-gray-700">
              <li>- Perros inquietos en casa</li>
              <li>- Mascotas con alta energía</li>
              <li>- Familias con horarios variables</li>
              <li>- Dueños que buscan soluciones simples</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-text mb-4">Sigue aprendiendo</h2>
          <p className="text-gray-700 mb-6">Te puede ayudar revisar estas guías para aprovechar mejor este producto.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            {relatedPosts.map((post) => (
              <article key={post.slug} className="border border-gray-200 rounded-xl p-5">
                <h3 className="text-lg font-heading font-semibold mb-2">{post.title}</h3>
                <p className="text-sm text-gray-700 mb-3">{post.description}</p>
                <Link to={`/blog/${post.slug}`} className="text-primary font-semibold hover:underline">
                  Leer guía
                </Link>
              </article>
            ))}
          </div>
          <Link to={productCategory.path} className="font-semibold text-primary hover:underline">
            Ver más en {productCategory.label.toLowerCase()}
          </Link>
        </div>
      </section>

      <FAQBlock title="Preguntas frecuentes de este producto" items={productFaqs} />

      {product.reviews?.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-text mb-4">Reseñas de clientes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {product.reviews.slice(0, 3).map((review) => (
                <article key={`${review.author}-${review.text}`} className="border border-gray-200 rounded-xl p-5">
                  <StarRating value={5} count={1} showText={false} />
                  <p className="text-gray-700 mt-3 mb-3">{review.text}</p>
                  <p className="text-sm font-semibold text-text">{review.author}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Productos recomendados */}
      {recommendedProducts.length > 0 && (
        <section className="bg-muted py-16 mt-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <h2 className="text-3xl font-heading font-bold text-text text-center mb-12">
                También te puede interesar
              </h2>
            </ScrollReveal>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {recommendedProducts.map((rec, index) => (
                <ScrollReveal key={rec.id} delay={index * 0.1}>
                  <ProductCard product={rec} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;







