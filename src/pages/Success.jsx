import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import config from '../config.json';

const Success = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    // Limpiar carrito al mostrar página de éxito
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-muted flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center"
      >
        {/* Ícono de éxito */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6"
        >
          <svg
            className="w-12 h-12 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>

        {/* Título */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-heading font-bold text-text mb-4"
        >
          ¡Compra exitosa!
        </motion.h1>

        {/* Descripción */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-600 mb-8"
        >
          Tu pedido ha sido recibido y está siendo procesado.
          Te enviaremos un email de confirmación a tu correo.
        </motion.p>

        {/* Info box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-muted rounded-xl p-6 mb-8 text-left"
        >
          <h2 className="font-heading font-semibold text-lg text-text mb-4">
            ¿Qué sigue?
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                1
              </span>
              <span>Recibirás un email de confirmación con los detalles de tu pedido</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                2
              </span>
              <span>Prepararemos tu pedido en {config.shipping.prep_days_min} a {config.shipping.prep_days_max} días hábiles</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                3
              </span>
              <span>Te enviaremos el código de seguimiento cuando el pedido sea despachado</span>
            </li>
          </ul>
        </motion.div>

        {/* Contacto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <p className="text-gray-600 mb-2">
            ¿Tienes alguna duda?
          </p>
          <p className="text-gray-700">
            Escríbenos a{' '}
            <a
              href={`mailto:${config.brand.email}`}
              className="text-primary font-semibold hover:underline"
            >
              {config.brand.email}
            </a>
          </p>
        </motion.div>

        {/* Botones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/"
            className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-[#5AB5D9] transition-colors shadow-md"
          >
            Volver al inicio
          </Link>
          <Link
            to="/tienda"
            className="px-8 py-3 bg-white text-primary border-2 border-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            Seguir comprando
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Success;



