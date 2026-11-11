import config from '../config.json';

const Check = () => (
  <svg className="w-5 h-5 text-pine flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

/** Las tres dudas que frenan una compra: envío, pago y devolución. */
const TrustRow = ({ deadlines, className = '' }) => {
  const items = [
    deadlines?.rm
      ? `Envío gratis en la RM. Pide hasta el ${deadlines.rm} y llega antes de Navidad`
      : 'Envío gratis en la Región Metropolitana',
    'Pago seguro con Mercado Pago, débito o crédito',
    `${config.returns?.days || 30} días para devolverlo`
  ];

  return (
    <ul className={`space-y-2 text-sm text-gray-700 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-2"><Check />{item}</li>
      ))}
    </ul>
  );
};

export default TrustRow;
