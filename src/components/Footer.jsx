import { useState } from 'react';
import { Link } from 'react-router-dom';
import config from '../config.json';
import PopupPolicies from './PopupPolicies';

const Footer = () => {
  const [policyOpen, setPolicyOpen] = useState(false);
  const [policyType, setPolicyType] = useState('');

  const openPolicy = (type) => {
    setPolicyType(type);
    setPolicyOpen(true);
  };

  const policies = [
    { name: 'Política de Privacidad', type: 'privacy' },
    { name: 'Cookies', type: 'cookies' },
    { name: 'Términos y Condiciones', type: 'terms' },
    { name: 'Devoluciones', type: 'returns' },
  ];

  return (
    <>
      <footer className="bg-accent text-white mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Columna 1: Sobre PetMAT */}
            <div>
              <h3 className="font-heading font-bold text-xl mb-4">PetMAT</h3>
              <p className="text-gray-300 mb-4">
                Accesorios diseñados para hacer feliz a tu mascota. 
                Productos seguros, duraderos y pensados para su bienestar.
              </p>
              <div className="flex space-x-4">
                <a
                  href={config.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Columna 2: Enlaces útiles */}
            <div>
              <h3 className="font-heading font-bold text-xl mb-4">Enlaces</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-primary transition-colors duration-200">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link to="/tienda" className="text-gray-300 hover:text-primary transition-colors duration-200">
                    Tienda
                  </Link>
                </li>
                <li>
                  <Link to="/contacto" className="text-gray-300 hover:text-primary transition-colors duration-200">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            {/* Columna 3: Contacto y envíos */}
            <div>
              <h3 className="font-heading font-bold text-xl mb-4">Contacto</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a 
                    href={`mailto:${config.brand.email}`}
                    className="hover:text-primary transition-colors duration-200"
                  >
                    {config.brand.email}
                  </a>
                </li>
                <li>Instagram: @petmatcl</li>
              </ul>
              <div className="mt-4 pt-4 border-t border-gray-600">
                <p className="text-sm text-gray-300">
                  <strong>Envíos a todo Chile</strong><br />
                  RM: ${config.shipping.rm.toLocaleString('es-CL')}<br />
                  Regiones: ${config.shipping.regions.toLocaleString('es-CL')}
                </p>
              </div>
            </div>
          </div>

          {/* Políticas y Copyright */}
          <div className="mt-8 pt-8 border-t border-gray-600">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-300">
                {policies.map((policy) => (
                  <button
                    key={policy.type}
                    onClick={() => openPolicy(policy.type)}
                    className="hover:text-primary transition-colors duration-200"
                  >
                    {policy.name}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-300">
                © {new Date().getFullYear()} PetMAT. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Popup de políticas */}
      <PopupPolicies
        isOpen={policyOpen}
        onClose={() => setPolicyOpen(false)}
        type={policyType}
      />
    </>
  );
};

export default Footer;



