import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatCLP } from '../utils/currency';
import { useCart } from '../hooks/useCart';
import ProductGallery from './ProductGallery';
import ProductCard from './ProductCard';
import ScrollReveal from './ScrollReveal';
import config from '../config.json';
import productsData from '../data/products.json';

const ProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    // Buscar producto por slug
    const foundProduct = productsData.find(p => p.slug === slug);
    
    if (!foundProduct) {
      navigate('/tienda');
      return;
    }

    setProduct(foundProduct);

    // Productos recomendados (otros productos excepto el actual)
    const recommended = productsData
      .filter(p => p.id !== foundProduct.id)
      .slice(0, 2);
    setRecommendedProducts(recommended);

    // Scroll to top
    window.scrollTo(0, 0);
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

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
          <span>/</span>
          <Link to="/tienda" className="hover:text-primary transition-colors">Tienda</Link>
          <span>/</span>
          <span className="text-text">{product.name}</span>
        </div>
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
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-text mb-4">
                  {product.name}
                </h1>
                <p className="text-xl text-gray-600">
                  {product.short}
                </p>
              </div>

              {/* Precio */}
              <div className="py-6 border-y border-gray-200">
                <span className="text-4xl font-heading font-bold text-primary">
                  {formatCLP(product.price)}
                </span>
              </div>

              {/* Descripción */}
              <div>
                <h3 className="font-heading font-semibold text-lg text-text mb-3">
                  Descripción
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
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
                <h3 className="font-heading font-semibold text-text mb-3">
                  Información de envío
                </h3>
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
                    <span>RM: {formatCLP(config.shipping.rm)} | Regiones: {formatCLP(config.shipping.regions)}</span>
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







