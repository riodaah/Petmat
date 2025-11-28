import ProductCard from './ProductCard';
import ScrollReveal from './ScrollReveal';

/**
 * Grid de productos con animaciones
 */
const ProductGrid = ({ products, title, subtitle }) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(title || subtitle) && (
          <ScrollReveal className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-text mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </ScrollReveal>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ScrollReveal key={product.id} delay={index * 0.1}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>

        {/* Mensaje si no hay productos */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No hay productos disponibles en este momento.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;







