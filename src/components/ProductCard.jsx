import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatCLP } from '../utils/currency';
import Badge from './Badge';
import StarRating from './StarRating';

/**
 * Tarjeta de producto individual
 */
const ProductCard = ({ product }) => {
  const hasDiscount =
    Boolean(product.hasOffer) &&
    Boolean(product.offerPrice) &&
    Number(product.price) > Number(product.offerPrice);
  const discountPercent = hasDiscount
    ? Math.round(((Number(product.price) - Number(product.offerPrice)) / Number(product.price)) * 100)
    : 0;

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
            src={product.images?.[0] || 'https://via.placeholder.com/400x400/6CC5E9/FFFFFF?text=PetMAT'}
            alt={`${product.name} en PetMAT`}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x400/6CC5E9/FFFFFF?text=PetMAT';
            }}
          />
          {hasDiscount && (
            <>
              <motion.div
                animate={{ y: [0, -3, 0], rotate: [-14, -11, -14] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -left-14 top-5 z-20 w-52 bg-gradient-to-r from-primary to-[#5AB5D9] text-white text-center font-extrabold text-sm py-2 shadow-xl border border-white/30 -rotate-12"
              >
                {discountPercent}% DCTO
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.05, 1], x: [0, 1, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-3 right-3 z-20 bg-accent text-white text-[11px] px-3 py-1 rounded-full font-bold shadow-lg"
              >
                Oferta limitada
              </motion.div>
            </>
          )}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
            {product.isBestSeller && <Badge type="mas-vendido">Más vendido</Badge>}
            {product.isNew && <Badge type="nuevo">Nuevo</Badge>}
          </div>
        </div>

        {/* Contenido */}
        <div className="p-5">
          <h3 className="font-heading font-semibold text-lg text-text mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.short}
          </p>

          <div className="mb-4">
            <StarRating value={product.ratingAverage} count={product.reviewsCount} />
          </div>

          {/* Precio y botón */}
          <div className="flex items-center justify-between">
            {product.hasOffer && product.offerPrice ? (
              <div className="flex flex-col">
                <span className="text-sm text-gray-400 line-through">{formatCLP(product.price)}</span>
                <span className="text-2xl font-heading font-bold text-primary">{formatCLP(product.offerPrice)}</span>
              </div>
            ) : (
              <span className="text-2xl font-heading font-bold text-primary">{formatCLP(product.price)}</span>
            )}
            
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







