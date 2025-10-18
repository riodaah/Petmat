/**
 * Formatea un número a formato de moneda chilena (CLP)
 * Ejemplo: 19990 -> $19.990
 */
export const formatCLP = (n) => {
  if (typeof n !== 'number') return '$0';
  return n.toLocaleString('es-CL', { 
    style: 'currency', 
    currency: 'CLP', 
    maximumFractionDigits: 0 
  });
};

