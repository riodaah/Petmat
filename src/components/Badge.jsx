const badgeStyles = {
  oferta: 'bg-red-100 text-red-700 border-red-200',
  'mas-vendido': 'bg-amber-100 text-amber-700 border-amber-200',
  nuevo: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  envio: 'bg-sky-100 text-sky-700 border-sky-200'
};

const Badge = ({ type = 'oferta', children }) => {
  const styles = badgeStyles[type] || 'bg-gray-100 text-gray-700 border-gray-200';

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${styles}`}>
      {children}
    </span>
  );
};

export default Badge;
