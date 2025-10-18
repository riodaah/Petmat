import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import ScrollReveal from '../components/ScrollReveal';
import productsData from '../data/products.json';
import config from '../config.json';

const Home = () => {
  // Mostrar todos los productos como destacados (solo hay 3)
  const featuredProducts = productsData;

  const benefits = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Pago seguro',
      description: 'Pagos protegidos con Mercado Pago'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      title: 'Envíos a todo Chile',
      description: 'Llevamos tus productos donde estés'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      title: 'Materiales de calidad',
      description: 'Productos seguros y duraderos'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: 'Soporte rápido',
      description: 'Atención humana y personalizada'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <Hero />

      {/* Productos destacados */}
      <ProductGrid 
        products={featuredProducts}
        title="Productos Destacados"
        subtitle="Descubre nuestros accesorios diseñados para el bienestar de tu mascota"
      />

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

      {/* Video sección (placeholder para futuro) */}
      {/*
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-text text-center mb-8">
                Mira cómo funciona
              </h2>
              <div className="aspect-video rounded-2xl overflow-hidden bg-muted shadow-2xl">
                {/* TODO: Agregar video de uso del producto 
                Specs: 1920x1080px, 6-8 segundos, sin audio
                Ubicación: src/assets/videos/product-usage-1.mp4
                Prompt: "Perro usando alfombra olfativa, plano detalle de la nariz buscando snacks, luz natural"
                
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-500">Video próximamente</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
      */}

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

