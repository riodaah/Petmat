const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || 'https://sunny-comfort-production.up.railway.app';

export function createCheckoutTraceId() {
  return `chk_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function sendCheckoutDiagnostic(payload) {
  try {
    await fetch(`${BACKEND_URL}/api/checkout-diagnostics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    // No rompemos UX por errores de logging.
    console.warn('No se pudo enviar diagnóstico de checkout', error?.message);
  }
}

export function getStoredCheckoutSnapshot() {
  try {
    const raw = sessionStorage.getItem('petmat_last_checkout');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}
