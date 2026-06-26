import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { formatCLP } from '../utils/currency';
import { createCheckoutTraceId, sendCheckoutDiagnostic } from '../services/checkoutDiagnostics';
import MercadoPagoLogo from './MercadoPagoLogo';

const SHIPPING_COSTS = {
  rm: 2990,
  center: 5600,
  extreme: 9500
};

const REGION_OPTIONS = [
  'Región de Arica y Parinacota',
  'Región de Tarapacá',
  'Región de Antofagasta',
  'Región de Atacama',
  'Región de Coquimbo',
  'Región de Valparaíso',
  'Región Metropolitana',
  "Región de O'Higgins",
  'Región del Maule',
  'Región de Ñuble',
  'Región del Biobío',
  'Región de La Araucanía',
  'Región de Los Ríos',
  'Región de Los Lagos',
  'Región de Aysén',
  'Región de Magallanes'
];

const CENTER_REGIONS = new Set([
  'region de atacama',
  'region de coquimbo',
  'region de valparaiso',
  "region de o'higgins",
  'region del maule',
  'region de nuble',
  'region del biobio',
  'region de la araucania',
  'region de los rios',
  'region de los lagos'
]);

const EXTREME_REGIONS = new Set([
  'region de arica y parinacota',
  'region de tarapaca',
  'region de antofagasta',
  'region de aysen',
  'region de magallanes'
]);

function normalizeRegion(region) {
  return String(region || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function getShippingCostByRegion(region) {
  const normalizedRegion = normalizeRegion(region);

  if (normalizedRegion.includes('metropolitana')) {
    return SHIPPING_COSTS.rm;
  }

  if (CENTER_REGIONS.has(normalizedRegion)) {
    return SHIPPING_COSTS.center;
  }

  if (EXTREME_REGIONS.has(normalizedRegion)) {
    return SHIPPING_COSTS.extreme;
  }

  // Fallback conservador para evitar subcobros.
  return SHIPPING_COSTS.extreme;
}

/**
 * Componente de Checkout con Mercado Pago
 * Modelo copiado de Astrochoc (probado y funcionando)
 * 
 * SEGURIDAD: El Access Token está en el backend, NUNCA en el frontend
 */
export default function CheckoutMPRailway() {
  const { cart } = useCart();
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

  // URL del backend en Railway
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://sunny-comfort-production.up.railway.app';

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
      const traceId = createCheckoutTraceId();
      sessionStorage.setItem('petmat_current_trace_id', traceId);

      // Calcular shipping según región seleccionada
      const shippingCost = getShippingCostByRegion(formData.region);

      // Enviar solo identificador y cantidad; backend calcula precio real.
      const formattedItems = cart.map(item => ({
        id: item.id,
        quantity: item.quantity
      }));

      const nameParts = formData.name.trim().split(/\s+/).filter(Boolean);
      const firstName = nameParts[0] || formData.name.trim();
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Cliente';

      // Preparar datos del pagador para Checkout Pro
      const payer = {
        first_name: firstName,
        last_name: lastName,
        email: formData.email,
        phone: {
          area_code: '56',
          number: String(formData.phone).replace(/[^0-9]/g, ''),
        },
        address: {
          street_name: formData.address,
          city_name: formData.city,
          state_name: formData.region,
        },
      };

      console.log('🛒 Enviando pedido al backend...');

      // Llamar al backend para crear la preferencia (formato compatible con Astrochoc)
      const response = await fetch(`${BACKEND_URL}/api/create-preference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: formattedItems,
          payer: payer,
          trace_id: traceId,
          shipments: {
            cost: shippingCost,
            mode: 'not_specified'
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear la preferencia de pago');
      }

      const data = await response.json();
      sessionStorage.setItem(
        'petmat_last_checkout',
        JSON.stringify({
          trace_id: traceId,
          preference_id: data.id,
          external_reference: data.external_reference,
          payer_email: formData.email,
          created_at: new Date().toISOString()
        })
      );
      
      console.log('✅ Preferencia creada, redirigiendo a Mercado Pago...');

      // Redirigir al checkout de Mercado Pago (igual que Astrochoc)
      const checkoutUrl = data.init_point || data.sandbox_init_point;
      
      if (checkoutUrl) {
        // Redirigir a Mercado Pago
        window.location.href = checkoutUrl;
      } else {
        throw new Error('No se recibió la URL de checkout');
      }

    } catch (err) {
      console.error('❌ Error en checkout:', err);
      await sendCheckoutDiagnostic({
        stage: 'create_preference_error',
        trace_id: sessionStorage.getItem('petmat_current_trace_id') || null,
        error_message: err?.message || 'Error sin mensaje',
        checkout_context: {
          region: formData.region,
          cart_items: cart.map((item) => ({ id: item.id, quantity: item.quantity })),
          subtotal
        },
        source: 'frontend_checkout'
      });
      setError(err.message || 'Error al procesar el pago. Por favor intenta de nuevo.');
      setLoading(false);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = getShippingCostByRegion(formData.region);
  const total = subtotal + shippingCost;
  const shippingLabel = formatCLP(shippingCost);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-muted py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <h2 className="text-2xl font-heading font-bold mb-4">Tu carrito está vacío</h2>
            <p className="text-gray-600 mb-8">Agrega productos para continuar con la compra</p>
            <a 
              href="/tienda" 
              className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Ver Tienda
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold mb-8 text-center">Finalizar Compra</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
            <p className="font-semibold">⚠️ Error</p>
            <p>{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Formulario */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-heading font-semibold mb-6">Datos de Envío</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre Completo *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  required
                >
                  {REGION_OPTIONS.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-sm text-gray-600">
                  Envío para esta región: <span className="font-semibold text-text">{shippingLabel}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-heading font-semibold mb-6">Resumen del Pedido</h3>
              
              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center py-3 border-b">
                    <div className="flex items-center gap-3">
                      {item.images?.[0] && (
                        <img 
                          src={item.images[0]} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
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
              </div>

              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>{formatCLP(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío:</span>
                  <span>{shippingLabel}</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-3 mt-3">
                  <span>Total:</span>
                  <span className="text-primary">{formatCLP(total)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className={`w-full mt-6 py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
                  loading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  '💳 Pagar con Mercado Pago'
                )}
              </button>

              <div className="flex flex-col items-center gap-1 mt-4">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Pago seguro procesado por
                </div>
                <MercadoPagoLogo height={26} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
