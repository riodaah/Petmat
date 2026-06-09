import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductGrid from '../components/ProductGrid';
import ScrollReveal from '../components/ScrollReveal';
import SeoHead from '../components/SeoHead';
import StarRating from '../components/StarRating';
import Badge from '../components/Badge';
import { BLOG_POSTS, SEO_CATEGORIES, pickRelatedProducts } from '../data/seoContent';
import { getGeneralTestimonials } from '../data/reviews';
import { useProducts } from '../hooks/useProducts';

const Home = () => {
  const { products, loading } = useProducts();
  const featuredProducts = products.slice(0, 6);
  const starProducts = pickRelatedProducts(products, 'manta-olfativa-para-perros', 1);
  const heroProduct = starProducts[0];
  const highlightedPosts = BLOG_POSTS.slice(0, 3);
  const testimonials = getGeneralTestimonials();

  const benefits = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Pago seguro',
      description: 'Pagos protegidos y flujo de compra confiable'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      title: 'Envíos a todo Chile',
      description: 'Despachos a RM y regiones con seguimiento'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      title: 'Soluciones reales',
      description: 'Productos enfocados en problemas cotidianos'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: 'Acompañamiento humano',
      description: 'Te ayudamos a elegir según tu caso'
    }
  ];

  return (
    <div className="min-h-screen">
      <SeoHead
        title="PetMAT Chile | Mantas olfativas, comederos automáticos y juguetes interactivos"
        description="Ayuda a tu perro a relajarse, jugar y comer mejor. En PetMAT encuentras manta olfativa, comedero automático y soluciones para el aburrimiento."
      />

      <section className="bg-gradient-to-br from-primary/15 to-muted py-14 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <Badge type="mas-vendido">Producto estrella</Badge>
              <motion.div
                animate={{ y: [0, -2, 0], opacity: [0.95, 1, 0.95] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex ml-3 px-3 py-1 rounded-full bg-accent text-white text-xs font-bold"
              >
                Liquidación por tiempo limitado
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-text mt-4 mb-4 leading-tight">
                ¿Tu perro está aburrido, ansioso o come demasiado rápido?
              </h1>
              <p className="text-lg text-gray-700 mb-6 max-w-xl">
                En PetMAT te ayudamos a transformar esos problemas en rutinas saludables con juego de olfato,
                alimentación activa y estimulación mental diaria.
              </p>
              <div className="flex flex-wrap gap-3 mb-5">
                <Link to="/manta-olfativa-para-perros" className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-[#5AB5D9]">
                  Ver manta olfativa
                </Link>
                <Link to="/tienda" className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-text hover:border-primary hover:text-primary">
                  Ir a la tienda
                </Link>
              </div>
              <p className="text-sm text-gray-600">Ayuda a tu perro a relajarse jugando. Menos aburrimiento, más estimulación mental.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <p className="text-sm font-semibold text-primary mb-2">Solución destacada</p>
              <h2 className="text-2xl font-heading font-bold text-text mb-2">
                Manta olfativa para perros
              </h2>
              <p className="text-gray-700 mb-3">
                Ideal para perros inquietos o con mucha energía. Convierte la comida en un desafío entretenido.
              </p>
              <StarRating value={heroProduct?.ratingAverage || 0} count={heroProduct?.reviewsCount || 0} />
              <div className="flex flex-wrap gap-2 mt-4 mb-5">
                <Badge type="oferta">Oferta</Badge>
                <Badge type="envio">RM gratis</Badge>
              </div>
              <Link to="/manta-olfativa-para-perros" className="inline-flex items-center text-primary font-semibold hover:underline">
                Ver categoría destacada
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-heading font-bold text-text mb-6">Categorías destacadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SEO_CATEGORIES.map((category) => (
              <Link key={category.slug} to={`/${category.slug}`} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-heading font-semibold text-text mb-2">{category.h1}</h3>
                <p className="text-gray-700 text-sm">{category.intro}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      {loading ? (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        </section>
      ) : (
        <ProductGrid
          products={featuredProducts}
          title="Productos Destacados"
          subtitle="Accesorios pensados para resolver inquietud, aburrimiento y problemas de alimentación"
        />
      )}

      {/* Beneficios */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text text-center mb-12">
              ¿Por qué elegir PetMAT?
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="font-heading font-bold text-lg text-text mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {benefit.description}
                  </p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-text mb-8">
            Guías útiles para dueños de perros
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {highlightedPosts.map((post) => (
              <article key={post.slug} className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-heading font-semibold text-lg mb-2">{post.title}</h3>
                <p className="text-sm text-gray-700 mb-3">{post.description}</p>
                <Link to={`/blog/${post.slug}`} className="text-primary font-semibold hover:underline">
                  Leer artículo
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-text mb-4">Reseñas de clientes</h2>
          <p className="text-gray-700 max-w-2xl mb-6">
            Lo que más nos importa es que la experiencia en casa funcione de verdad. Estas son algunas opiniones que nos llegan seguido.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((testimonial) => (
              <article key={testimonial.author} className="border border-gray-200 rounded-xl p-5 bg-white">
                <StarRating value={testimonial.rating} count={1} showText={false} />
                <p className="text-gray-700 mt-3 mb-3">{testimonial.text}</p>
                <p className="text-sm font-semibold text-text">{testimonial.author}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-primary to-[#5AB5D9]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
              Feliz, activo y estimulado
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Así queremos a tu compañero. Descubre nuestros productos pensados para su bienestar.
            </p>
            <motion.a
              href="/tienda"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-4 bg-white text-primary font-heading font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Ver todos los productos
            </motion.a>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Home;

