import { Link } from 'react-router-dom';
import { getChristmasDeadlines, isChristmasSeason } from '../lib/season';
import { GiftBox } from './XmasDecor';

/** Franja superior: una sola línea fija, sin texto en movimiento. */
const ChristmasBar = ({ maxDiscount = 0 }) => {
  if (!isChristmasSeason()) {
    return (
      <div className="bg-accent text-white text-center text-xs sm:text-sm font-semibold py-2 px-4">
        Envío gratis a toda la Región Metropolitana
      </div>
    );
  }

  const deadlines = getChristmasDeadlines();
  const deadline = deadlines?.rm
    ? `Pide hasta el ${deadlines.rm} y llega antes de Navidad`
    : 'Envío gratis en la Región Metropolitana';

  return (
    <Link to="/tienda" className="block bg-pine text-white hover:bg-[#184a3c] transition-colors">
      <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-center">
        <GiftBox className="w-4 h-4 flex-shrink-0" />
        <span>
          {maxDiscount > 0 && <>Ofertas de Navidad: hasta {maxDiscount}% de descuento. </>}
          <span className="hidden sm:inline">{deadline}.</span>
        </span>
      </div>
    </Link>
  );
};

export default ChristmasBar;
