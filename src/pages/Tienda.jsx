import { motion } from 'framer-motion';
import ProductGrid from '../components/ProductGrid';
import ScrollReveal from '../components/ScrollReveal';
import productsData from '../data/products.json';
import config from '../config.json';

const Tienda = () => {
  const benefits = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Materiales Premium',
      description: 'Productos fabricados con materiales de alta calidad y durabilidad'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: 'Diseñado con Amor',
      description: 'Cada producto está pensado para el bienestar y felicidad de tu mascota'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      title: 'Envíos a Todo Chile',
      description: 'Llevamos nuestros productos hasta tu hogar, sin importar dónde estés'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: 'Soporte Personalizado',
      description: 'Atención humana y personalizada para resolver todas tus dudas'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero pequeño */}
      <section className="bg-gradient-to-br from-primary/10 to-muted py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-text mb-4">
              Nuestra Tienda
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Productos de calidad diseñados para el bienestar y felicidad de tu mascota
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid de productos */}
      <ProductGrid products={productsData} />

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

      {/* Información de envíos */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-heading font-bold text-text text-center mb-8">
                Información de Envíos
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-primary/5 rounded-xl p-6">
                  <h3 className="font-heading font-semibold text-xl text-text mb-4">
                    Región Metropolitana
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-semibold">Costo:</span> ${config.shipping.rm.toLocaleString('es-CL')}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Tiempo de preparación:</span> {config.shipping.prep_days_min} a {config.shipping.prep_days_max} días hábiles
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Tiempo de envío:</span> 1-2 días hábiles
                    </p>
                  </div>
                </div>

                <div className="bg-accent/5 rounded-xl p-6">
                  <h3 className="font-heading font-semibold text-xl text-text mb-4">
                    Regiones
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-semibold">Costo:</span> ${config.shipping.regions.toLocaleString('es-CL')}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Tiempo de preparación:</span> {config.shipping.prep_days_min} a {config.shipping.prep_days_max} días hábiles
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Tiempo de envío:</span> 2-4 días hábiles
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-muted rounded-xl text-center">
                <p className="text-gray-700">
                  <strong>Importante:</strong> No ofrecemos retiro a domicilio. Todos nuestros productos se envían a través de empresas de courier confiables.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-primary to-[#5AB5D9]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
              ¿Tienes alguna pregunta?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Nuestro equipo está aquí para ayudarte a elegir el mejor producto para tu mascota.
            </p>
            <motion.a
              href="/contacto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-4 bg-white text-primary font-heading font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Contáctanos
            </motion.a>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Tienda;


