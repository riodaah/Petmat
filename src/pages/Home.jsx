import { Link } from 'react-router-dom';
import FAQBlock from '../components/FAQBlock';
import Price from '../components/Price';
import { getPricing } from '../lib/pricing';
import ProductGrid from '../components/ProductGrid';
import SeoHead from '../components/SeoHead';
import TrustRow from '../components/TrustRow';
import { GiftBox, LightString, Ornament, SantaHat } from '../components/XmasDecor';
import { getProductContent, getShippingFaqs } from '../data/productContent';
import { getGeneralTestimonials } from '../data/reviews';
import config from '../config.json';
import { useCart } from '../hooks/useCart';
import { useProducts } from '../hooks/useProducts';
import { fallbackToOriginal, optimizedImage } from '../lib/images';
import { getChristmasDeadlines, isChristmasSeason } from '../lib/season';
import { formatCLP } from '../utils/currency';

const HERO_IMAGE = '/assets/products/p1/sam-y-alfombra.png';
const FEEDER_IMAGE = '/assets/products/p3/portada-profesional.png';
const STEP_IMAGES = [
  '/assets/products/p1/escondite.png',
  '/assets/products/p1/sam-y-alfombra-2.png',
  '/assets/products/p2/pata-de-sam.png'
];

const Home = () => {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const christmas = isChristmasSeason();
  const deadlines = getChristmasDeadlines();

  const mat = products.find((p) => p.slug === 'alfombra-olfativa');
  const feeder = products.find((p) => p.slug === 'comedero-automatico');
  const matContent = getProductContent('alfombra-olfativa');
  const feederContent = getProductContent('comedero-automatico');
  const testimonials = config.reviews?.showUnverified ? getGeneralTestimonials() : [];

  return (
    <div>
      <SeoHead
        title="PetMAT Chile | Alfombra olfativa y comedero automático para tu mascota"
        description="Alfombra olfativa para perros y comedero automático con cámara. Envío gratis en la Región Metropolitana y despacho a todo Chile."
      />

      {/* Hero: un producto, un precio, un botón */}
      <section className="bg-ice">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              {christmas && (
                <p className="inline-flex items-center gap-2 text-pine font-bold mb-4">
                  <GiftBox className="w-6 h-6" />
                  Navidad PetMAT
                </p>
              )}
              <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-heading font-bold text-ink leading-[1.08] tracking-tight">
                {christmas
                  ? 'Este año, un regalo que tu perro sí va a usar'
                  : 'Un perro que olfatea es un perro tranquilo'}
              </h1>
              <p className="text-lg text-gray-700 mt-5 max-w-lg">
                Esconde sus premios en la alfombra olfativa y deja que su nariz haga el resto.
                Con 10 a 20 minutos de búsqueda queda entretenido y más calmado.
              </p>

              {mat && (
                <div className="mt-6">
                  <Price product={mat} size="lg" showSavings />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={() => mat && addToCart(mat, 1)}
                  disabled={!mat || mat.stock <= 0}
                  className="px-8 py-4 bg-cta text-white text-lg font-bold rounded-xl hover:bg-cta-dark transition-colors disabled:opacity-60"
                >
                  Agregar al carrito
                </button>
                <Link
                  to="/producto/alfombra-olfativa"
                  className="px-8 py-4 text-center text-lg font-bold text-ink bg-white border border-gray-300 rounded-xl hover:border-ink transition-colors"
                >
                  Ver la alfombra
                </Link>
              </div>

              <TrustRow deadlines={deadlines} className="mt-6" />
            </div>

            <div className="relative max-w-md lg:max-w-none mx-auto w-full pt-8 lg:pt-10">
              <div className="relative">
                <img
                  src={optimizedImage(HERO_IMAGE)}
                  onError={fallbackToOriginal(HERO_IMAGE)}
                  alt="Sam, un perro de pelo largo, sentado junto a su alfombra olfativa PetMAT"
                  width="1200"
                  height="1200"
                  fetchPriority="high"
                  className="w-full h-auto rounded-[2rem] bg-white"
                />
                {christmas && (
                  <>
                    <SantaHat className="absolute w-[21%] left-[38%] -top-[7%] -rotate-6 drop-shadow-md" />
                    <GiftBox className="absolute w-[17%] right-[5%] bottom-[5%] rotate-6 drop-shadow-md" />
                    <GiftBox className="absolute w-[11%] right-[20%] bottom-[4%] -rotate-6 drop-shadow-md" box="#1E5B4A" />
                  </>
                )}
                {mat && getPricing(mat).hasDiscount && (
                  <div className="absolute left-[4%] top-[6%] w-[23%] aspect-square rounded-full bg-cta text-white flex flex-col items-center justify-center -rotate-12 shadow-lg">
                    <span className="font-heading font-bold text-[clamp(1.1rem,3.2vw,2rem)] leading-none">-{getPricing(mat).discountPercent}%</span>
                    <span className="text-[clamp(.6rem,1.2vw,.8rem)] font-semibold">{christmas ? 'Navidad' : 'Oferta'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Productos */}
      {loading ? (
        <section className="py-16 bg-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" role="status" aria-label="Cargando productos" />
        </section>
      ) : (
        <div className="relative">
          {christmas && <LightString className="hidden md:block absolute top-0 left-0 w-full h-8" />}
          <ProductGrid
            id="productos"
            products={products.slice(0, 6)}
            title={christmas ? 'Regalos para el consentido de la casa' : 'Nuestros productos'}
            subtitle={christmas ? 'Precios de Navidad mientras dure el stock.' : undefined}
          />
        </div>
      )}

      {/* Cómo funciona la alfombra */}
      <section className="py-14 bg-ice">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-ink max-w-xl">
            Así funciona la alfombra olfativa
          </h2>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {matContent.usage.map((step, index) => (
              <li key={step.title}>
                <img
                  src={optimizedImage(STEP_IMAGES[index], 'thumb')}
                  onError={fallbackToOriginal(STEP_IMAGES[index])}
                  alt=""
                  width="600"
                  height="600"
                  loading="lazy"
                  className="w-full aspect-[4/3] object-cover rounded-2xl"
                />
                <h3 className="font-heading font-bold text-xl text-ink mt-4">
                  <span className="text-primary-dark">{index + 1}.</span> {step.title}
                </h3>
                <p className="text-gray-700 mt-1">{step.text}</p>
              </li>
            ))}
          </ol>
          <Link
            to="/producto/alfombra-olfativa"
            className="inline-block mt-8 px-7 py-3.5 bg-cta text-white font-bold rounded-xl hover:bg-cta-dark transition-colors"
          >
            Comprar alfombra olfativa{mat ? ` por ${formatCLP(getPricing(mat).finalPrice)}` : ''}
          </Link>
        </div>
      </section>

      {/* Comedero automático */}
      {feeder && (
        <section className="py-14 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <img
                src={optimizedImage(FEEDER_IMAGE)}
                onError={fallbackToOriginal(FEEDER_IMAGE)}
                alt="Comedero automático PetMAT junto a un celular con la app"
                width="1200"
                height="1200"
                loading="lazy"
                className="w-full max-w-lg mx-auto rounded-[2rem]"
              />
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-ink">
                  {feederContent.headline}
                </h2>
                <p className="text-lg text-gray-700 mt-3">
                  Comedero automático con WiFi y cámara, para perros y gatos.
                </p>
                <ul className="mt-5 space-y-2">
                  {feederContent.highlights.map((item) => (
                    <li key={item} className="flex gap-2 text-gray-800">
                      <span className="mt-2 w-2 h-2 rounded-full bg-primary flex-shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Price product={feeder} size="lg" showSavings />
                  {feeder.stock > 0 && feeder.stock <= 10 && (
                    <p className="text-sm font-semibold text-cta mt-1">Quedan {feeder.stock} unidades</p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    onClick={() => addToCart(feeder, 1)}
                    disabled={feeder.stock <= 0}
                    className="px-8 py-4 bg-cta text-white text-lg font-bold rounded-xl hover:bg-cta-dark transition-colors disabled:opacity-60"
                  >
                    Agregar al carrito
                  </button>
                  <Link
                    to="/producto/comedero-automatico"
                    className="px-8 py-4 text-center text-lg font-bold text-ink border border-gray-300 rounded-xl hover:border-ink transition-colors"
                  >
                    Ver el comedero
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="py-14 bg-ice">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-heading font-bold text-ink mb-6">Lo que dicen quienes ya compraron</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {testimonials.map((testimonial) => (
                <figure key={testimonial.author} className="bg-white rounded-2xl p-6">
                  <blockquote className="text-gray-800">“{testimonial.text}”</blockquote>
                  <figcaption className="text-sm font-semibold text-ink mt-3">{testimonial.author}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <FAQBlock title="Antes de comprar" items={getShippingFaqs(deadlines)} className="py-14 bg-white" />

      {/* Cierre */}
      <section className={`relative overflow-hidden py-14 ${christmas ? 'bg-pine' : 'bg-accent'}`}>
        {christmas && (
          <>
            <Ornament className="absolute w-12 left-[6%] top-0 hidden sm:block" color="#C8322B" />
            <Ornament className="absolute w-9 left-[13%] -top-4 hidden sm:block" color="#F0B840" />
            <Ornament className="absolute w-12 right-[7%] -top-2 hidden sm:block" color="#6CC5E9" />
          </>
        )}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">
            {christmas ? 'Que este año también haya un regalo para él' : 'Feliz, activo y estimulado'}
          </h2>
          {deadlines?.rm && (
            <p className="text-lg text-white/90 mt-3">
              Pide hasta el {deadlines.rm} y llega antes de Navidad en la Región Metropolitana
              {deadlines.regions ? `, o hasta el ${deadlines.regions} en regiones` : ''}.
            </p>
          )}
          <Link
            to="/tienda"
            className="inline-block mt-7 px-8 py-4 bg-white text-ink text-lg font-bold rounded-xl hover:bg-ice transition-colors"
          >
            Ver los productos
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
