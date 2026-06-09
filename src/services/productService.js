import { getReviewsForProduct } from '../data/reviews';

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || 'https://sunny-comfort-production.up.railway.app';

async function request(path) {
  const response = await fetch(`${BACKEND_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Error ${response.status} consultando ${path}`);
  }
  return response.json();
}

function mapCatalogProduct(raw) {
  const fallbackReviews = getReviewsForProduct({
    name: raw.name || raw.title,
    short: raw.short || raw.short_description || '',
    description: raw.description || ''
  });
  const reviewsCount = Number(raw.reviewsCount || raw.review_count || fallbackReviews.reviews.length);
  const ratingAverage = Number(raw.ratingAverage || raw.rating || fallbackReviews.ratingAverage);

  return {
    id: raw.id,
    slug: raw.slug || raw.product_slug,
    name: raw.name || raw.title,
    short: raw.short || raw.short_description || '',
    description: raw.description || '',
    features: raw.features || [],
    images: raw.images || (raw.image_link ? [raw.image_link, ...(raw.additional_image_link || [])] : []),
    stock: Number(raw.stock || 0),
    price: Number(raw.price || raw.finalPrice || 0),
    offerPrice: raw.offerPrice ? Number(raw.offerPrice) : null,
    hasOffer: Boolean(raw.hasOffer),
    finalPrice: Number(raw.finalPrice || raw.price || 0),
    active: raw.active !== false,
    isNew: Boolean(raw.isNew),
    isBestSeller: Boolean(raw.isBestSeller || raw.featured),
    reviewsCount,
    ratingAverage,
    reviews: Array.isArray(raw.reviews) && raw.reviews.length > 0 ? raw.reviews : fallbackReviews.reviews,
    category: raw.category || '',
    tags: Array.isArray(raw.tags) ? raw.tags : []
  };
}

export async function getProducts() {
  const data = await request('/api/products');
  return (data.products || []).map(mapCatalogProduct).filter((p) => p.active);
}

export async function getProductById(id) {
  const data = await request(`/api/products/${id}`);
  return mapCatalogProduct(data);
}
