// Las fotos de producto llegan del backend como /assets/products/<id>/<nombre>.png
// (1–4 MB cada una). Junto a cada PNG hay una versión WebP liviana generada con
// scripts/optimize-images.py; aquí se elige esa versión cuando existe.
const LOCAL_PRODUCT_IMAGE = /^\/assets\/products\/.+\.png$/i;

export function optimizedImage(src, size = 'full') {
  if (!src || !LOCAL_PRODUCT_IMAGE.test(src)) return src;
  const suffix = size === 'thumb' ? '-600' : '';
  return src.replace(/\.png$/i, `${suffix}.webp`);
}

// Si el WebP no existe (foto nueva subida solo como PNG), vuelve al original.
export function fallbackToOriginal(originalSrc) {
  return (event) => {
    const img = event.currentTarget;
    if (img.dataset.fallbackApplied) return;
    img.dataset.fallbackApplied = 'true';
    img.src = originalSrc || '/assets/products/placeholder.png';
  };
}
