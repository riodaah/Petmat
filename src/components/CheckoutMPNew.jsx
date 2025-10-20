import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import { formatCLP } from '../utils/currency';
import { orderService } from '../services/orderService';
import { emailService } from '../services/emailService';

const CheckoutMPNew = () => {
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mpLoaded, setMpLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: '',
    notes: ''
  });

  // Cargar SDK de Mercado Pago
  useEffect(() => {
    const loadMercadoPago = () => {
      if (window.MercadoPago) {
        setMpLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.async = true;
      script.onload = () => {
        setMpLoaded(true);
      };
      script.onerror = () => {
        setError('Error cargando Mercado Pago SDK');
      };
      document.head.appendChild(script);
    };

    loadMercadoPago();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const required = ['name', 'email', 'phone', 'address', 'city', 'region'];
    for (const field of required) {
      if (!formData[field].trim()) {
        setError(`El campo ${field} es requerido`);
        return false;
      }
    }
    return true;
  };

  const createPreference = async () => {
    const publicKey = import.meta.env.VITE_MP_PUBLIC_KEY;
    
    if (!publicKey) {
      throw new Error('Clave pública de Mercado Pago no configurada');
    }

    // Crear preferencia según mejores prácticas de Mercado Pago
    const preference = {
      items: cart.map((item, index) => ({
        id: `item_${index + 1}`,
        title: item.name,
        description: item.description || item.name,
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: 'CLP',
        category_id: 'others'
      })),
      payer: {
        name: formData.name,
        surname: formData.name.split(' ')[1] || '',
        email: formData.email,
        phone: {
          number: formData.phone,
          area_code: '56'
        },
        address: {
          street_name: formData.address,
          city_name: formData.city,
          state_name: formData.region,
          country_name: 'Chile'
        }
      },
      shipments: {
        cost: 2990,
        mode: 'not_specified'
      },
      back_urls: {
        success: `${window.location.origin}/success`,
        failure: `${window.location.origin}/error`,
        pending: `${window.location.origin}/success`
      },
      auto_return: 'approved',
      statement_descriptor: 'PetMAT',
      external_reference: `petmat_${Date.now()}`,
      binary_mode: false,
      installments: 12,
      notification_url: `${window.location.origin}/api/webhooks/mercadopago`
    };

    // Crear checkout usando la API de Mercado Pago
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_MP_ACCESS_TOKEN}`
      },
      body: JSON.stringify(preference)
    });

    if (!response.ok) {
      throw new Error('Error creando preferencia de pago');
    }

    const data = await response.json();
    return data.id;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    if (!mpLoaded) {
      setError('Mercado Pago SDK no está cargado');
      return;
    }

    setLoading(true);

    try {
      console.log('🚀 Iniciando proceso de pago...');
      
      // Crear orden en el sistema
      const orderData = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        shipping: {
          address: formData.address,
          city: formData.city,
          region: formData.region,
          notes: formData.notes || ''
        },
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          images: item.images
        })),
        subtotal: subtotal,
        shipping_cost: shippingCost,
        total: total,
        payment_status: 'pending',
        estimated_delivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
      };

      // Guardar orden
      const order = await orderService.createOrder(orderData);
      console.log('✅ Orden creada:', order.id);

      // Crear preferencia con referencia de la orden
      const preferenceId = await createPreference();
      console.log('✅ Preferencia creada:', preferenceId);

      // Inicializar Mercado Pago
      const mp = new window.MercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY);
      
      // Crear checkout con autoOpen
      const checkout = mp.checkout({
        preference: {
          id: preferenceId
        },
        autoOpen: true
      });

      console.log('✅ Checkout creado exitosamente');
      setLoading(false);

    } catch (err) {
      console.error('❌ Error en checkout:', err);
      setError('Error al procesar el pago. Por favor intenta nuevamente.');
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return null;
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = 2990;
  const total = subtotal + shippingCost;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-heading font-bold text-text">
            Finalizar Compra
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información de envío */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
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
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      required
                    >
                      <option value="">Selecciona una región</option>
                      <option value="Región Metropolitana">Región Metropolitana</option>
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

                {/* Botón submit */}
                <motion.button
                  type="submit"
                  disabled={loading || !mpLoaded}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando pago...
                    </span>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      Pagar con Mercado Pago
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Resumen del pedido */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-heading font-bold text-text mb-6">
                Resumen del pedido
              </h2>

              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0">
                      <img
                        src={item.images?.[0] || '/assets/products/placeholder.png'}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = '/assets/products/placeholder.png';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-text truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Cantidad: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-primary">
                        {formatCLP(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Subtotal:</span>
                  <span>{formatCLP(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Envío (RM):</span>
                  <span>{formatCLP(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-primary">
                  <span>Total:</span>
                  <span>{formatCLP(total)}</span>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-600">
                <p className="mb-2">
                  <strong>Tiempo de preparación:</strong> 2 a 5 días hábiles
                </p>
                <div className="flex items-center space-x-2">
                  <span>Pagos seguros con:</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">MP</span>
                    </div>
                    <span className="text-sm font-medium">Mercado Pago</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutMPNew;
