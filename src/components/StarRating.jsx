const Star = ({ filled = false }) => (
  <svg
    className={`w-4 h-4 ${filled ? 'text-amber-400' : 'text-gray-300'}`}
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.2 3.694a1 1 0 00.95.69h3.885c.969 0 1.371 1.24.588 1.81l-3.143 2.284a1 1 0 00-.364 1.118l1.2 3.694c.3.921-.755 1.688-1.54 1.118l-3.143-2.284a1 1 0 00-1.176 0l-3.143 2.284c-.784.57-1.838-.197-1.539-1.118l1.2-3.694a1 1 0 00-.364-1.118L2.426 9.12c-.784-.57-.38-1.81.588-1.81h3.885a1 1 0 00.951-.69l1.2-3.694z" />
  </svg>
);

const StarRating = ({ value = 0, count = 0, showText = true }) => {
  const normalizedValue = Number(value) || 0;
  const filledStars = Math.round(normalizedValue);
  const hasReviews = count > 0 && normalizedValue > 0;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5" aria-label={hasReviews ? `Calificación ${normalizedValue} de 5` : 'Sin reseñas aún'}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} filled={index < filledStars} />
        ))}
      </div>
      {showText && (
        <span className="text-sm text-gray-600">
          {hasReviews ? `${normalizedValue.toFixed(1)} (${count} reseñas)` : 'Aún sin reseñas'}
        </span>
      )}
    </div>
  );
};

export default StarRating;
