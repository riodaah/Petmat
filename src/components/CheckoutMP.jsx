import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import { formatCLP } from '../utils/currency';
import { initMercadoPago, cartItemsToMPItems } from '../utils/mp';
import config from '../config.json';

/**
 * Componente de Checkout con Mercado Pago
 * 
 * IMPORTANTE: Para producción, debes:
 * 1. Configurar VITE_MP_PUBLIC_KEY en .env
 * 2. Crear un backend que genere las preferencias de pago
 * 3. El ACCESS_TOKEN nunca debe estar en el frontend
 */
const CheckoutMP = () => {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useCart();
  const [shippingRegion, setShippingRegion] = useState('rm');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: 'Región Metropolitana',
    notes: '',
  });

  useEffect(() => {
    // Si el carrito está vacío, redirigir a tienda
    if (cart.length === 0) {
      navigate('/tienda');
    }
  }, [cart, navigate]);

  const shippingCost = shippingRegion === 'rm' 
    ? config.shipping.rm 
    : config.shipping.regions;

  const subtotal = getTotalPrice();
  const total = subtotal + shippingCost;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.phone || 
        !formData.address || !formData.city) {
      setError('Por favor completa todos los campos obligatorios');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingresa un email válido');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Crear preferencia de pago con Mercado Pago
      const publicKey = import.meta.env.VITE_MP_PUBLIC_KEY;
      
      // Debug: Verificar variables de entorno
      console.log('=== DEBUG MERCADO PAGO ===');
      console.log('Todas las variables de entorno:', import.meta.env);
      console.log('VITE_MP_PUBLIC_KEY:', import.meta.env.VITE_MP_PUBLIC_KEY);
      console.log('VITE_MP_ACCESS_TOKEN:', import.meta.env.VITE_MP_ACCESS_TOKEN);
      console.log('NODE_ENV:', import.meta.env.NODE_ENV);
      console.log('MODE:', import.meta.env.MODE);
      console.log('DEV:', import.meta.env.DEV);
      console.log('PROD:', import.meta.env.PROD);
      console.log('========================');
      
      if (!publicKey) {
        throw new Error('Clave pública de Mercado Pago no configurada');
      }

      // Cargar SDK de Mercado Pago
      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.async = true;
      
      script.onload = () => {
        const mp = new window.MercadoPago(publicKey);
        
        // Crear preferencia
        const preference = {
          items: cart.map(item => ({
            title: item.name,
            quantity: item.quantity,
            unit_price: item.price,
            currency_id: 'CLP'
          })),
          payer: {
            name: formData.name,
            email: formData.email,
            phone: {
              number: formData.phone
            },
            address: {
              street_name: formData.address,
              city_name: formData.city,
              state_name: formData.region,
              country_name: 'Chile'
            }
          },
          shipments: {
            cost: shippingCost,
            mode: 'not_specified'
          },
          back_urls: {
            success: `${window.location.origin}/success`,
            failure: `${window.location.origin}/error`,
            pending: `${window.location.origin}/success`
          },
          auto_return: 'approved',
          notification_url: `${window.location.origin}/api/webhooks/mercadopago`
        };

        // Crear checkout
        mp.checkout({
          preference: preference,
          render: {
            container: '.mp-checkout-container',
            label: 'Pagar con Mercado Pago'
          }
        });
      };

      document.head.appendChild(script);

    } catch (err) {
      console.error('Error en checkout:', err);
      setError('Hubo un error al procesar tu pedido. Por favor intenta nuevamente.');
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-heading font-bold text-text mb-8 text-center"
        >
          Finalizar Compra
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-heading font-bold text-text mb-6">
                Información de envío
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                {/* Email y Teléfono */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      required
                    />
                  </div>
                </div>

                {/* Dirección */}
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Dirección completa *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Calle, número, depto/casa"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                {/* Ciudad y Región */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">
                      Ciudad/Comuna *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">
                      Región *
                    </label>
                    <select
                      name="region"
                      value={formData.region}
                      onChange={(e) => {
                        handleInputChange(e);
                        setShippingRegion(e.target.value === 'Región Metropolitana' ? 'rm' : 'regions');
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      required
                    >
                      <option value="Región Metropolitana">Región Metropolitana</option>
                      <option value="Arica y Parinacota">Arica y Parinacota</option>
                      <option value="Tarapacá">Tarapacá</option>
                      <option value="Antofagasta">Antofagasta</option>
                      <option value="Atacama">Atacama</option>
                      <option value="Coquimbo">Coquimbo</option>
                      <option value="Valparaíso">Valparaíso</option>
                      <option value="O'Higgins">O'Higgins</option>
                      <option value="Maule">Maule</option>
                      <option value="Ñuble">Ñuble</option>
                      <option value="Biobío">Biobío</option>
                      <option value="Araucanía">Araucanía</option>
                      <option value="Los Ríos">Los Ríos</option>
                      <option value="Los Lagos">Los Lagos</option>
                      <option value="Aysén">Aysén</option>
                      <option value="Magallanes">Magallanes</option>
                    </select>
                  </div>
                </div>

                {/* Notas adicionales */}
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Notas adicionales (opcional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Ej: Dejar en conserjería, timbre roto, etc."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
                  />
                </div>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Contenedor para botón de Mercado Pago */}
                <div className="mp-checkout-container"></div>

                {/* Botón submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full px-6 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-[#5AB5D9] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </span>
                  ) : (
                    'Continuar al pago'
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Resumen del pedido */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-heading font-bold text-text mb-6">
                Resumen del pedido
              </h2>

              {/* Productos */}
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/64x64/6CC5E9/FFFFFF?text=PetMAT';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text line-clamp-2">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Cantidad: {item.quantity}
                      </p>
                      <p className="text-sm font-bold text-primary">
                        {formatCLP(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-text">{formatCLP(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Envío ({shippingRegion === 'rm' ? 'RM' : 'Regiones'})</span>
                  <span className="font-semibold text-text">{formatCLP(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-lg pt-3 border-t border-gray-200">
                  <span className="font-heading font-bold text-text">Total</span>
                  <span className="font-heading font-bold text-primary">{formatCLP(total)}</span>
                </div>
              </div>

              {/* Info de tiempo de preparación */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-xs text-gray-700">
                  <strong>Tiempo de preparación:</strong> {config.shipping.prep_days_min} a {config.shipping.prep_days_max} días hábiles
                </p>
              </div>

              {/* Métodos de pago */}
              <div className="mt-6">
                <p className="text-xs text-gray-600 mb-2">Pagos seguros con:</p>
                <div className="flex items-center justify-center p-3 bg-muted rounded-lg">
                  <span className="text-sm font-semibold text-primary">Mercado Pago</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutMP;


