import mpLogo from '../assets/Mercado_Pago.svg.webp';

const MercadoPagoLogo = ({ className = '', height = 28 }) => (
  <img
    src={mpLogo}
    alt="Mercado Pago"
    height={height}
    style={{ height: `${height}px`, width: 'auto' }}
    className={className}
  />
);

export default MercadoPagoLogo;
