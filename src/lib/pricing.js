export function getPricing(product) {
  const listPrice = Number(product?.price) || 0;
  const offerPrice = Number(product?.offerPrice) || 0;
  const hasDiscount = Boolean(product?.hasOffer) && offerPrice > 0 && listPrice > offerPrice;
  const finalPrice = hasDiscount ? offerPrice : listPrice;
  return {
    listPrice,
    finalPrice,
    hasDiscount,
    discountPercent: hasDiscount ? Math.round(((listPrice - offerPrice) / listPrice) * 100) : 0,
    savings: hasDiscount ? listPrice - offerPrice : 0
  };
}
