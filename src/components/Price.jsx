import { getPricing } from '../lib/pricing';
import { formatCLP } from '../utils/currency';

const sizes = {
  md: { final: 'text-2xl', list: 'text-sm' },
  lg: { final: 'text-4xl', list: 'text-lg' }
};

const Price = ({ product, size = 'md', showSavings = false }) => {
  const { listPrice, finalPrice, hasDiscount, discountPercent, savings } = getPricing(product);
  const s = sizes[size] || sizes.md;

  return (
    <div>
      <div className="flex items-baseline flex-wrap gap-x-2">
        <span className={`${s.final} font-heading font-bold ${hasDiscount ? 'text-cta' : 'text-ink'}`}>
          {formatCLP(finalPrice)}
        </span>
        {hasDiscount && (
          <>
            <span className={`${s.list} text-gray-500 line-through`}>{formatCLP(listPrice)}</span>
            <span className="text-xs font-bold text-white bg-cta rounded-full px-2 py-0.5">-{discountPercent}%</span>
          </>
        )}
      </div>
      {showSavings && hasDiscount && (
        <p className="text-sm text-pine font-semibold mt-1">Ahorras {formatCLP(savings)}</p>
      )}
    </div>
  );
};

export default Price;
