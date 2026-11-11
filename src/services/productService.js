import { getReviewsForProduct } from '../data/reviews';
import config from '../config.json';

// Las reseñas de src/data/reviews.js no vienen del backend ni de un sistema de
// reseñas. Solo se muestran si config.reviews.showUnverified es true.
const SHOW_UNVERIFIED_REVIEWS = Boolean(config.reviews?.showUnverified);
const NO_REVIEWS = { ratingAverage: 0, reviews: [] };

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
  const fallbackReviews = SHOW_UNVERIFIED_REVIEWS
    ? getReviewsForProduct({
        name: raw.name || raw.title,
        short: raw.short || raw.short_description || '',
        description: raw.description || ''
      })
    : NO_REVIEWS;
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

// Una sola petición por carga de página, compartida entre todos los componentes.
let productsPromise = null;

export function getProducts() {
  if (!productsPromise) {
    productsPromise = request('/api/products')
      .then((data) => (data.products || []).map(mapCatalogProduct).filter((p) => p.active))
      .catch((error) => {
        productsPromise = null;
        throw error;
      });
  }
  return productsPromise;
}

export async function getProductById(id) {
  const data = await request(`/api/products/${id}`);
  return mapCatalogProduct(data);
}
