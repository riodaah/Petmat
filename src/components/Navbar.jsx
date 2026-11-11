import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useProducts } from '../hooks/useProducts';
import { isChristmasSeason } from '../lib/season';
import logoHorizontal from '../assets/logo-h.png';
import ChristmasBar from './ChristmasBar';
import { getPricing } from '../lib/pricing';
import { SantaHat } from './XmasDecor';

const navLinks = [
  { name: 'Alfombra olfativa', path: '/producto/alfombra-olfativa' },
  { name: 'Comedero automático', path: '/producto/comedero-automatico' },
  { name: 'Tienda', path: '/tienda' },
  { name: 'Contacto', path: '/contacto' }
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalItems, toggleCart } = useCart();
  const { products } = useProducts();
  const location = useLocation();
  const totalItems = getTotalItems();
  const christmas = isChristmasSeason();
  const maxDiscount = products.reduce((max, p) => Math.max(max, getPricing(p).discountPercent), 0);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <ChristmasBar maxDiscount={maxDiscount} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-[72px]">
          <Link to="/" className="relative flex items-center" aria-label="PetMAT, ir al inicio">
            <img src={logoHorizontal} alt="PetMAT" width="176" height="44" className="h-10 md:h-11 w-auto" />
            {christmas && (
              <SantaHat className="absolute w-7 md:w-8 -top-2 md:-top-2.5 left-[3px] md:left-[4px] -rotate-12" />
            )}
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-semibold text-[15px] transition-colors ${
                  isActive(link.path) ? 'text-primary-dark' : 'text-ink hover:text-primary-dark'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleCart}
              className="relative p-2 hover:bg-muted rounded-full transition-colors"
              aria-label={`Carrito de compras, ${totalItems} productos`}
            >
              <svg className="w-6 h-6 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-cta text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Menú"
              aria-expanded={isMenuOpen}
            >
              <svg className="w-6 h-6 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg font-semibold ${
                  isActive(link.path) ? 'bg-ice text-primary-dark' : 'text-ink hover:bg-muted'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
