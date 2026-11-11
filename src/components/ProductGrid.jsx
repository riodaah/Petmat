import ProductCard from './ProductCard';

const ProductGrid = ({ products, title, subtitle, id }) => {
  return (
    <section id={id} className="py-14 bg-white scroll-mt-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="mb-8 max-w-2xl">
            {title && <h2 className="text-3xl md:text-4xl font-heading font-bold text-ink">{title}</h2>}
            {subtitle && <p className="text-lg text-gray-600 mt-2">{subtitle}</p>}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <p className="text-gray-600 text-lg py-8">
            No pudimos cargar los productos. Recarga la página o escríbenos a info@petmat.cl.
          </p>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
