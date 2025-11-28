/**
 * Utilidades para integración con Mercado Pago
 * En producción, las preferencias deben crearse desde el backend
 */

/**
 * Mock para crear preferencia de pago (solo desarrollo)
 * En producción, este endpoint debe estar en tu backend
 */
export const createPreferenceMock = async (items) => {
  // Este es un mock para desarrollo
  // En producción, debes hacer un POST a tu backend que cree la preferencia
  console.log('Mock: Creando preferencia de pago', items);
  
  return {
    id: 'MOCK-PREFERENCE-ID-' + Date.now(),
    init_point: '/checkout/mock', // URL de redirección mock
  };
};

/**
 * Inicializa el SDK de Mercado Pago
 */
export const initMercadoPago = () => {
  const publicKey = import.meta.env.VITE_MP_PUBLIC_KEY;
  
  if (!publicKey) {
    console.warn('VITE_MP_PUBLIC_KEY no está configurado en .env');
    return null;
  }

  // Cargar SDK de Mercado Pago
  if (typeof window !== 'undefined' && window.MercadoPago) {
    const mp = new window.MercadoPago(publicKey);
    return mp;
  }
  
  return null;
};

/**
 * Transforma items del carrito al formato esperado por Mercado Pago
 */
export const cartItemsToMPItems = (cartItems) => {
  return cartItems.map(item => ({
    title: item.name,
    quantity: item.quantity,
    unit_price: item.price,
    currency_id: 'CLP',
  }));
};







