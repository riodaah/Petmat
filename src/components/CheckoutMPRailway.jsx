import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { formatCLP } from '../utils/currency';
import config from '../config.json';

/**
 * Componente de Checkout con Mercado Pago usando backend en Railway
 * Versión SEGURA: El Access Token nunca se expone en el frontend
 */
export default function CheckoutMPRailway() {
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: 'Región Metropolitana'
  });

  // URL del backend en Railway (cambiar cuando despliegues)
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://petmat-backend-production.up.railway.app';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.name || formData.name.length < 3) {
      errors.push('El nombre debe tener al menos 3 caracteres');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.push('El email no es válido');
    }
    
    if (!formData.phone || formData.phone.length < 8) {
      errors.push('El teléfono debe tener al menos 8 dígitos');
    }
    
    if (!formData.address || formData.address.length < 10) {
      errors.push('La dirección debe ser más específica');
    }
    
    if (!formData.city) {
      errors.push('La ciudad es requerida');
    }
    
    if (!formData.region) {
      errors.push('La región es requerida');
    }
    
    if (cart.length === 0) {
      errors.push('El carrito está vacío');
    }

    if (errors.length > 0) {
      setError(errors.join('. '));
      return false;
    }
    
    return true;
  };

  const handleCheckout = async () => {
    setError(null);
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log('🚀 Iniciando checkout con backend en Railway...');

      // Calcular shipping según región
      const shippingCost = formData.region.toLowerCase().includes('metropolitana') 
        ? config.shipping.rm 
        : config.shipping.regions;

      // Llamar al backend para crear la preferencia
      const response = await fetch(`${BACKEND_URL}/api/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cart: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            short: item.short,
            images: item.images
          })),
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            region: formData.region
          },
          shipping: {
            cost: shippingCost,
            region: formData.region
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear la preferencia de pago');
      }

      const data = await response.json();
      
      console.log('✅ Preferencia creada:', data.preferenceId);

      // Inicializar Mercado Pago en el frontend
      const publicKey = import.meta.env.VITE_MP_PUBLIC_KEY;
      
      if (!publicKey) {
        throw new Error('Clave pública de Mercado Pago no configurada');
      }

      // Cargar SDK de Mercado Pago si no está cargado
      if (!window.MercadoPago) {
        await loadMercadoPagoSDK();
      }

      // Inicializar Mercado Pago con la Public Key
      const mp = new window.MercadoPago(publicKey);

      // Crear el checkout y abrirlo automáticamente
      const checkout = await mp.checkout({
        preference: {
          id: data.preferenceId
        },
        autoOpen: true
      });

      console.log('✅ Checkout abierto correctamente');

      // Limpiar carrito después de abrir el checkout
      // (el usuario puede volver atrás, pero es mejor limpiar)
      setTimeout(() => {
        clearCart();
      }, 1000);

    } catch (err) {
      console.error('❌ Error en checkout:', err);
      setError(err.message || 'Error al procesar el pago. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Cargar SDK de Mercado Pago dinámicamente
  const loadMercadoPagoSDK = () => {
    return new Promise((resolve, reject) => {
      if (window.MercadoPago) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Error cargando SDK de Mercado Pago'));
      document.body.appendChild(script);
    });
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = formData.region.toLowerCase().includes('metropolitana') 
    ? config.shipping.rm 
    : config.shipping.regions;
  const total = subtotal + shippingCost;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-heading font-bold mb-8">Finalizar Compra</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
          <p className="font-semibold">⚠️ Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className="space-y-6">
          <h3 className="text-xl font-heading font-semibold mb-4">Datos de Envío</h3>
          
          <div>
            <label className="block text-sm font-medium mb-2">Nombre Completo *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Juan Pérez"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Teléfono *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="+56 9 1234 5678"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Dirección *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Av. Providencia 123, Depto 45"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ciudad *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Santiago"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Región *</label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="Región Metropolitana">Región Metropolitana</option>
              <option value="Región de Valparaíso">Región de Valparaíso</option>
              <option value="Región del Biobío">Región del Biobío</option>
              <option value="Región de La Araucanía">Región de La Araucanía</option>
              <option value="Región de Los Lagos">Región de Los Lagos</option>
              <option value="Región de O'Higgins">Región de O'Higgins</option>
              <option value="Región del Maule">Región del Maule</option>
              <option value="Otra">Otra región</option>
            </select>
          </div>
        </div>

        {/* Resumen */}
        <div>
          <h3 className="text-xl font-heading font-semibold mb-4">Resumen del Pedido</h3>
          
          <div className="bg-muted p-6 rounded-lg space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {item.images?.[0] && (
                    <img 
                      src={item.images[0]} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold">{formatCLP(item.price * item.quantity)}</p>
              </div>
            ))}

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCLP(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío:</span>
                <span>{formatCLP(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t pt-2">
                <span>Total:</span>
                <span>{formatCLP(total)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || cart.length === 0}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                loading || cart.length === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary/90 text-white'
              }`}
            >
              {loading ? '⏳ Procesando...' : '💳 Pagar con Mercado Pago'}
            </button>

            <p className="text-xs text-center text-gray-600 mt-4">
              🔒 Pago seguro procesado por Mercado Pago
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


