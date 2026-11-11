import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { formatCLP } from '../utils/currency';
import CartItem from './CartItem';
import MercadoPagoLogo from './MercadoPagoLogo';
import { getChristmasDeadlines } from '../lib/season';

/**
 * Drawer lateral del carrito
 */
const CartDrawer = () => {
  const navigate = useNavigate();
  const { cart, isOpen, closeCart, getTotalPrice, getTotalItems } = useCart();
  
  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const deadlines = getChristmasDeadlines();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    closeCart();
    navigate('/tienda');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-heading font-bold text-text">
                  Mi Carrito
                </h2>
                <p className="text-sm text-gray-600">
                  {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
                </p>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-muted rounded-full transition-colors"
                aria-label="Cerrar carrito"
              >
                <svg className="w-6 h-6 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <h3 className="text-lg font-heading font-semibold text-text mb-2">
                    Tu carrito está vacío
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Agrega productos para comenzar tu compra
                  </p>
                  <button
                    onClick={handleContinueShopping}
                    className="px-6 py-3 bg-cta text-white font-bold rounded-xl hover:bg-cta-dark transition-colors"
                  >
                    Ver productos
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {cart.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer con total y botones */}
            {cart.length > 0 && (
              <div className="border-t border-gray-200 px-6 py-4 space-y-4">
                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-heading font-semibold text-text">
                    Total:
                  </span>
                  <span className="text-2xl font-heading font-bold text-ink">
                    {formatCLP(totalPrice)}
                  </span>
                </div>

                {/* Nota de envío */}
                <p className="text-xs text-gray-600 text-center">
                  Envío gratis en la Región Metropolitana; a regiones se calcula al pagar.
                  {deadlines?.rm ? ` Pide hasta el ${deadlines.rm} y llega antes de Navidad.` : ''}
                </p>

                {/* Botones */}
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    className="w-full px-6 py-4 bg-cta text-white text-lg font-bold rounded-xl hover:bg-cta-dark transition-colors"
                  >
                    Ir a pagar
                  </motion.button>
                  
                  <button
                    onClick={handleContinueShopping}
                    className="w-full px-6 py-3 bg-white text-ink border border-gray-300 font-semibold rounded-xl hover:border-ink transition-colors"
                  >
                    Seguir comprando
                  </button>
                </div>

                {/* Trust badge */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs text-gray-500">Pago seguro con</span>
                  <MercadoPagoLogo height={20} />
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;







