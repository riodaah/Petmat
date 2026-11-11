import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { fallbackToOriginal, optimizedImage } from '../lib/images';
import Price from './Price';
import { getPricing } from '../lib/pricing';
import StarRating from './StarRating';

const LOW_STOCK_LIMIT = 10;

/**
 * Tarjeta de producto: foto, nombre, precio y compra directa.
 */
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { hasDiscount, discountPercent } = getPricing(product);
  const image = product.images?.[0];
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= LOW_STOCK_LIMIT;
  const productUrl = `/producto/${product.slug}`;

  return (
    <article className="group flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-primary transition-colors">
      <Link to={productUrl} className="relative block aspect-square bg-ice overflow-hidden">
        <img
          src={optimizedImage(image, 'thumb')}
          alt={product.name}
          width="600"
          height="600"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={fallbackToOriginal(image)}
        />
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-cta text-white text-sm font-bold px-3 py-1 rounded-full">
            -{discountPercent}%
          </span>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-heading font-semibold text-lg text-ink leading-snug">
          <Link to={productUrl} className="hover:text-primary-dark">{product.name}</Link>
        </h3>
        <p className="text-gray-600 text-sm mt-1">{product.short}</p>

        {product.reviewsCount > 0 && (
          <div className="mt-2">
            <StarRating value={product.ratingAverage} count={product.reviewsCount} />
          </div>
        )}

        <div className="mt-auto pt-4">
          <Price product={product} />
          {lowStock && (
            <p className="text-sm font-semibold text-cta mt-1">
              {product.stock === 1 ? 'Queda 1 unidad' : `Quedan ${product.stock} unidades`}
            </p>
          )}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={() => addToCart(product, 1)}
              disabled={outOfStock}
              className="px-3 py-3 bg-cta text-white text-sm font-bold rounded-lg hover:bg-cta-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {outOfStock ? 'Agotado' : 'Agregar al carrito'}
            </button>
            <Link
              to={productUrl}
              className="px-3 py-3 text-center text-sm font-bold text-ink border border-gray-300 rounded-lg hover:border-ink transition-colors"
            >
              Ver detalle
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
