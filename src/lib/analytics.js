// Medición para Google Analytics 4 y Google Ads.
// No carga nada hasta que definas VITE_GA_ID (G-XXXX) y/o VITE_GADS_ID (AW-XXXX)
// en las variables de entorno del build. La conversión de compra de Ads usa
// VITE_GADS_PURCHASE_LABEL (la etiqueta que entrega Google Ads al crear la conversión).
const GA_ID = import.meta.env.VITE_GA_ID;
const GADS_ID = import.meta.env.VITE_GADS_ID;
const GADS_PURCHASE_LABEL = import.meta.env.VITE_GADS_PURCHASE_LABEL;

let loaded = false;

function gtag() {
  window.dataLayer.push(arguments);
}

export function initAnalytics() {
  const firstId = GA_ID || GADS_ID;
  if (loaded || !firstId || typeof window === 'undefined') return;
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${firstId}`;
  document.head.appendChild(script);
  gtag('js', new Date());
  if (GA_ID) gtag('config', GA_ID, { send_page_view: false });
  if (GADS_ID) gtag('config', GADS_ID);
}

function send(eventName, params) {
  if (!loaded) return;
  gtag('event', eventName, params);
}

const priceOf = (product) =>
  Number(product.hasOffer && product.offerPrice ? product.offerPrice : product.price) || 0;

const toItem = (product, quantity = 1) => ({
  item_id: String(product.id),
  item_name: product.name,
  price: Number(product.unit_price ?? priceOf(product)),
  quantity
});

export function trackPageView(path) {
  send('page_view', { page_path: path, page_location: window.location.href });
}

export function trackViewItem(product) {
  send('view_item', { currency: 'CLP', value: priceOf(product), items: [toItem(product)] });
}

export function trackAddToCart(product, quantity = 1) {
  send('add_to_cart', {
    currency: 'CLP',
    value: priceOf(product) * quantity,
    items: [toItem(product, quantity)]
  });
}

const PENDING_PURCHASE_KEY = 'petmat_pending_purchase';

export function trackBeginCheckout(cart, value) {
  // Se guarda el pedido para poder informar la compra al volver de Mercado Pago.
  try {
    sessionStorage.setItem(
      PENDING_PURCHASE_KEY,
      JSON.stringify({ value, items: cart.map((item) => toItem(item, item.quantity)) })
    );
  } catch {
    // sessionStorage puede no estar disponible; la compra igual continúa.
  }
  send('begin_checkout', {
    currency: 'CLP',
    value,
    items: cart.map((item) => toItem(item, item.quantity))
  });
}

/** Llamar una vez en la página de éxito, con el payment_id de Mercado Pago. */
export function trackPurchase(transactionId) {
  if (!transactionId) return;
  let pending = null;
  try {
    pending = JSON.parse(sessionStorage.getItem(PENDING_PURCHASE_KEY));
    sessionStorage.removeItem(PENDING_PURCHASE_KEY);
  } catch {
    pending = null;
  }
  // Sin pedido pendiente es una recarga de la página: no se informa dos veces.
  if (!pending) return;
  const { value, items } = pending;
  const payload = {
    transaction_id: String(transactionId),
    currency: 'CLP',
    value,
    items
  };
  send('purchase', payload);
  if (GADS_ID && GADS_PURCHASE_LABEL) {
    send('conversion', {
      send_to: `${GADS_ID}/${GADS_PURCHASE_LABEL}`,
      value,
      currency: 'CLP',
      transaction_id: String(transactionId)
    });
  }
}
