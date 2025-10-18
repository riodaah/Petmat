import { motion } from 'framer-motion';
import ProductGrid from '../components/ProductGrid';
import productsData from '../data/products.json';

const Tienda = () => {
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
    </div>
  );
};

export default Tienda;


