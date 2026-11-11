import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import ProductGallery from './ProductGallery';
import ProductCard from './ProductCard';
import SeoHead from './SeoHead';
import StarRating from './StarRating';
import FAQBlock from './FAQBlock';
import Breadcrumbs from './Breadcrumbs';
import Price from './Price';
import { getPricing } from '../lib/pricing';
import TrustRow from './TrustRow';
import { GiftBox } from './XmasDecor';
import { getProducts } from '../services/productService';
import { getProductContent, getShippingFaqs } from '../data/productContent';
import { trackViewItem } from '../lib/analytics';
import { getChristmasDeadlines, isChristmasSeason } from '../lib/season';
import { buildAbsoluteUrl, buildBreadcrumbSchema } from '../lib/seo';
import { formatCLP } from '../utils/currency';

const LOW_STOCK_LIMIT = 10;

const ProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [otherProducts, setOtherProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;
    setProduct(null);
    setQuantity(1);

    getProducts()
      .then((products) => {
        if (!isMounted) return;
        const found = products.find((p) => p.slug === slug);
        if (!found) {
          navigate('/tienda');
          return;
        }
        setProduct(found);
        setOtherProducts(products.filter((p) => p.id !== found.id).slice(0, 2));
        trackViewItem(found);
        window.scrollTo(0, 0);
      })
      .catch((error) => {
        console.error('Error cargando detalle de producto:', error);
        navigate('/tienda');
      });

    return () => {
      isMounted = false;
    };
  }, [slug, navigate]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary" role="status" aria-label="Cargando producto" />
      </div>
    );
  }

  const content = getProductContent(product.slug);
  const christmas = isChristmasSeason();
  const deadlines = getChristmasDeadlines();
  const { finalPrice } = getPricing(product);
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= LOW_STOCK_LIMIT;
  const highlights = content.highlights.length ? content.highlights : product.features;
  const faqs = [...content.faqs, ...getShippingFaqs(deadlines)];
  const hasReviews = product.reviewsCount > 0 && product.ratingAverage > 0;

  const breadcrumbItems = [
    { label: 'Inicio', path: '/' },
    { label: 'Tienda', path: '/tienda' },
    { label: product.name, path: `/producto/${product.slug}` }
  ];

  const handleAddToCart = () => addToCart(product, quantity);
  const handleBuyNow = () => {
    addToCart(product, quantity, { openDrawer: false });
    navigate('/checkout');
  };

  const schemaProduct = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.short,
    image: (product.images || []).slice(0, 5).map((image) => buildAbsoluteUrl(image)),
    sku: String(product.id),
    brand: { '@type': 'Brand', name: 'PetMAT' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'CLP',
      price: finalPrice,
      availability: outOfStock ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      url: buildAbsoluteUrl(`/producto/${product.slug}`)
    }
  };

  if (hasReviews) {
    schemaProduct.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.ratingAverage,
      reviewCount: product.reviewsCount
    };
  }

  const schemaFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer }
    }))
  };

  return (
    <div className="bg-white pb-24 lg:pb-0">
      <SeoHead
        title={`${product.name} | PetMAT Chile`}
        description={product.short || product.description}
        image={product.images?.[0] ? buildAbsoluteUrl(product.images[0]) : undefined}
        schemas={[schemaProduct, buildBreadcrumbSchema(breadcrumbItems), schemaFaq]}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <ProductGallery images={product.images} productName={product.name} />

          <div className="lg:sticky lg:top-32">
            {christmas && (
              <p className="inline-flex items-center gap-2 text-pine font-bold text-sm mb-2">
                <GiftBox className="w-5 h-5" />
                Precio de Navidad
              </p>
            )}
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-ink leading-tight">
              {product.name}
            </h1>
            {content.headline && <p className="text-lg text-gray-700 mt-2">{content.headline}</p>}
            {hasReviews && (
              <div className="mt-3">
                <StarRating value={product.ratingAverage} count={product.reviewsCount} />
              </div>
            )}

            <div className="mt-5">
              <Price product={product} size="lg" showSavings />
              {lowStock && (
                <p className="text-sm font-semibold text-cta mt-1">
                  {product.stock === 1 ? 'Queda 1 unidad' : `Quedan ${product.stock} unidades`}
                </p>
              )}
            </div>

            {highlights?.length > 0 && (
              <ul className="mt-5 space-y-2">
                {highlights.map((item) => (
                  <li key={item} className="flex gap-2 text-gray-800">
                    <span className="mt-2 w-2 h-2 rounded-full bg-primary flex-shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex items-stretch gap-3 mt-6">
              <div className="flex items-center border border-gray-300 rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-lg font-bold text-ink hover:bg-muted rounded-l-xl"
                  aria-label="Quitar una unidad"
                >
                  −
                </button>
                <span className="w-8 text-center font-bold" aria-live="polite">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  className="px-4 py-3 text-lg font-bold text-ink hover:bg-muted rounded-r-xl"
                  aria-label="Agregar una unidad"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleBuyNow}
                disabled={outOfStock}
                className="flex-1 px-6 py-4 bg-cta text-white text-lg font-bold rounded-xl hover:bg-cta-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {outOfStock ? 'Agotado' : 'Comprar ahora'}
              </button>
            </div>
            {!outOfStock && (
              <button
                onClick={handleAddToCart}
                className="w-full mt-3 px-6 py-3.5 font-bold text-ink border border-gray-300 rounded-xl hover:border-ink transition-colors"
              >
                Agregar al carrito
              </button>
            )}

            <TrustRow deadlines={deadlines} className="mt-6" />
          </div>
        </div>
      </section>

      {content.usage.length > 0 && (
        <section className="py-12 bg-ice">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink">Cómo se usa</h2>
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {content.usage.map((step, index) => (
                <li key={step.title} className="bg-white rounded-2xl p-6">
                  <h3 className="font-heading font-bold text-xl text-ink">
                    <span className="text-primary-dark">{index + 1}.</span> {step.title}
                  </h3>
                  <p className="text-gray-700 mt-1">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">Descripción</h2>
          <p className="text-gray-700 leading-relaxed">{product.description || product.short}</p>
          {product.features?.length > 0 && (
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-gray-700">
              {product.features.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {hasReviews && product.reviews?.length > 0 && (
        <section className="py-12 bg-ice">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-6">Reseñas de clientes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {product.reviews.slice(0, 3).map((review) => (
                <figure key={`${review.author}-${review.text}`} className="bg-white rounded-2xl p-6">
                  <blockquote className="text-gray-800">“{review.text}”</blockquote>
                  <figcaption className="text-sm font-semibold text-ink mt-3">{review.author}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <FAQBlock title="Preguntas frecuentes" items={faqs} className="py-12" />

      {otherProducts.length > 0 && (
        <section className="bg-ice py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-6">
              También te puede interesar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
              {otherProducts.map((other) => (
                <ProductCard key={other.id} product={other} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Barra de compra fija en móvil */}
      {!outOfStock && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-xs text-gray-600 truncate">{product.name}</p>
            <p className="font-heading font-bold text-lg text-ink leading-tight">{formatCLP(finalPrice)}</p>
          </div>
          <button
            onClick={handleBuyNow}
            className="ml-auto whitespace-nowrap px-6 py-3 bg-cta text-white font-bold rounded-xl hover:bg-cta-dark transition-colors"
          >
            Comprar ahora
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
