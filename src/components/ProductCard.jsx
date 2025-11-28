import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatCLP } from '../utils/currency';

/**
 * Tarjeta de producto individual
 */
const ProductCard = ({ product }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <Link to={`/producto/${product.slug}`}>
        {/* Imagen */}
        <div className="relative h-64 overflow-hidden bg-muted">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x400/6CC5E9/FFFFFF?text=PetMAT';
            }}
          />
          {/* Badge de nuevo (opcional) */}
          {product.isNew && (
            <span className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
              Nuevo
            </span>
          )}
        </div>

        {/* Contenido */}
        <div className="p-5">
          <h3 className="font-heading font-semibold text-lg text-text mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.short}
          </p>

          {/* Precio y botón */}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-heading font-bold text-primary">
              {formatCLP(product.price)}
            </span>
            
            <button className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-[#5AB5D9] transition-colors duration-200">
              Ver producto
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;







