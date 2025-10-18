import { motion } from 'framer-motion';
import { formatCLP } from '../utils/currency';
import { useCart } from '../hooks/useCart';

/**
 * Item individual del carrito
 */
const CartItem = ({ item }) => {
  const { incrementQuantity, decrementQuantity, removeFromCart } = useCart();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex gap-4 py-4 border-b border-gray-200"
    >
      {/* Imagen */}
      <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
        <img
          src={item.images[0]}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/80x80/6CC5E9/FFFFFF?text=PetMAT';
          }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-text text-sm mb-1 line-clamp-2">
          {item.name}
        </h4>
        <p className="text-primary font-bold text-sm mb-2">
          {formatCLP(item.price)}
        </p>

        {/* Controles de cantidad */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => decrementQuantity(item.id)}
            className="w-7 h-7 flex items-center justify-center bg-muted hover:bg-gray-300 rounded transition-colors"
            aria-label="Disminuir cantidad"
          >
            -
          </button>
          <span className="w-8 text-center font-semibold text-sm">
            {item.quantity}
          </span>
          <button
            onClick={() => incrementQuantity(item.id)}
            className="w-7 h-7 flex items-center justify-center bg-muted hover:bg-gray-300 rounded transition-colors"
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
      </div>

      {/* Precio total y eliminar */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Eliminar del carrito"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <p className="font-bold text-text">
          {formatCLP(item.price * item.quantity)}
        </p>
      </div>
    </motion.div>
  );
};

export default CartItem;

