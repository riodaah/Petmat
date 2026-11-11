// Adornos navideños en SVG. Todos son decorativos (aria-hidden).

export const SantaHat = ({ className = '' }) => (
  <svg viewBox="0 0 120 100" className={className} aria-hidden="true">
    <path d="M14 78C22 44 44 14 78 12c14-1 26 8 32 26-12-8-22-8-30-2 8 12 12 26 12 42z" fill="#C8322B" />
    <path d="M78 12c14-1 26 8 32 26-12-8-22-8-30-2-6-10-8-18-2-24z" fill="#A62620" />
    <rect x="4" y="70" width="98" height="22" rx="11" fill="#FFFFFF" />
    <rect x="4" y="70" width="98" height="22" rx="11" fill="none" stroke="#E3EDF2" strokeWidth="2" />
    <circle cx="109" cy="42" r="10" fill="#FFFFFF" stroke="#E3EDF2" strokeWidth="2" />
  </svg>
);

export const GiftBox = ({ className = '', box = '#C8322B', ribbon = '#F0B840' }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
    <path d="M50 30c-10-20-32-16-28-2 2 8 16 8 28 2zM50 30c10-20 32-16 28-2-2 8-16 8-28 2z" fill={ribbon} />
    <rect x="12" y="30" width="76" height="18" rx="4" fill={box} />
    <rect x="18" y="48" width="64" height="42" rx="4" fill={box} />
    <rect x="18" y="48" width="64" height="8" fill="#000" opacity=".12" />
    <rect x="43" y="30" width="14" height="60" fill={ribbon} />
  </svg>
);

export const Ornament = ({ className = '', color = '#1E5B4A' }) => (
  <svg viewBox="0 -40 60 120" className={className} aria-hidden="true">
    <path d="M30 -40V4" stroke="#F0B840" strokeWidth="1.5" />
    <rect x="24" y="8" width="12" height="10" rx="2" fill="#F0B840" />
    <circle cx="30" cy="6" r="4" fill="none" stroke="#F0B840" strokeWidth="2" />
    <circle cx="30" cy="48" r="28" fill={color} />
    <path d="M6 42c14 8 34 8 48 0" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity=".7" />
    <circle cx="20" cy="36" r="5" fill="#FFFFFF" opacity=".25" />
  </svg>
);

export const Snowflake = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
    <path d="M12 2v20M3.3 7l17.4 10M20.7 7 3.3 17M12 5.5 9.8 3.6M12 5.5l2.2-1.9M12 18.5l-2.2 1.9M12 18.5l2.2 1.9" />
  </svg>
);

/** Guirnalda de luces para el borde superior de una sección. */
export const LightString = ({ className = '' }) => {
  const colors = ['#C8322B', '#F0B840', '#1E5B4A', '#6CC5E9'];
  const bulbs = Array.from({ length: 24 });
  return (
    <svg viewBox="0 0 1200 34" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path d="M0 4 Q 25 22 50 4 T 100 4 T 150 4 T 200 4 T 250 4 T 300 4 T 350 4 T 400 4 T 450 4 T 500 4 T 550 4 T 600 4 T 650 4 T 700 4 T 750 4 T 800 4 T 850 4 T 900 4 T 950 4 T 1000 4 T 1050 4 T 1100 4 T 1150 4 T 1200 4" fill="none" stroke="#2F4550" strokeWidth="1.5" />
      {bulbs.map((_, i) => (
        <ellipse key={i} cx={25 + i * 50} cy={i % 2 === 0 ? 19 : 9} rx="5" ry="7" fill={colors[i % colors.length]} />
      ))}
    </svg>
  );
};
