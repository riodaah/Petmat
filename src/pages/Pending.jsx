import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import config from '../config.json';
import { getStoredCheckoutSnapshot, sendCheckoutDiagnostic } from '../services/checkoutDiagnostics';

const Pending = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkoutSnapshot = getStoredCheckoutSnapshot();

    sendCheckoutDiagnostic({
      stage: 'checkout_return_pending',
      trace_id: checkoutSnapshot?.trace_id || sessionStorage.getItem('petmat_current_trace_id') || null,
      source: 'frontend_pending_page',
      query: {
        status: params.get('status'),
        status_detail: params.get('status_detail'),
        payment_id: params.get('payment_id') || params.get('collection_id'),
        preference_id: params.get('preference_id'),
        merchant_order_id: params.get('merchant_order_id'),
        external_reference: params.get('external_reference')
      },
      checkout_snapshot: checkoutSnapshot
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-muted flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-24 h-24 bg-amber-100 rounded-full mb-6"
        >
          <svg className="w-12 h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4m0 4h.01M5.07 19h13.86a2 2 0 001.75-2.97L13.75 4.03a2 2 0 00-3.5 0L3.32 16.03A2 2 0 005.07 19z" />
          </svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-heading font-bold text-text mb-4"
        >
          Pago pendiente
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-600 mb-8"
        >
          Tu pago está en proceso de validación por Mercado Pago.
          Te avisaremos por correo cuando se confirme.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-muted rounded-xl p-6 mb-8 text-left"
        >
          <h2 className="font-heading font-semibold text-lg text-text mb-4">Recomendaciones</h2>
          <ul className="space-y-2 text-gray-700">
            <li>- Revisa tu correo en los próximos minutos para confirmar el estado.</li>
            <li>- Si pagaste por transferencia, la acreditación puede tardar más.</li>
            <li>- Si necesitas ayuda, escríbenos a {config.brand.email}.</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
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

export default Pending;
