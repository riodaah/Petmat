import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const PopupPolicies = ({ isOpen, onClose, type }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && type) {
      loadPolicy(type);
    }
  }, [isOpen, type]);

  const loadPolicy = async (policyType) => {
    setLoading(true);
    try {
      const response = await fetch(`/src/data/policies/${policyType}.md`);
      const text = await response.text();
      setContent(text);
    } catch (error) {
      console.error('Error cargando política:', error);
      setContent('# Error\n\nNo se pudo cargar el contenido.');
    } finally {
      setLoading(false);
    }
  };

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop con blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-4 md:inset-10 bg-white rounded-2xl shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-heading font-bold text-text">
                {type === 'privacy' && 'Política de Privacidad'}
                {type === 'cookies' && 'Política de Cookies'}
                {type === 'terms' && 'Términos y Condiciones'}
                {type === 'returns' && 'Política de Devoluciones'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-full transition-colors duration-200"
                aria-label="Cerrar"
              >
                <svg
                  className="w-6 h-6 text-text"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="prose prose-lg max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-3xl font-heading font-bold text-text mb-4">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-2xl font-heading font-bold text-text mt-6 mb-3">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-xl font-heading font-semibold text-text mt-4 mb-2">{children}</h3>
                      ),
                      p: ({ children }) => (
                        <p className="text-text mb-4 leading-relaxed">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-text">{children}</li>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-text">{children}</strong>
                      ),
                      a: ({ href, children }) => (
                        <a href={href} className="text-primary hover:underline">
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-[#5AB5D9] transition-colors duration-200"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PopupPolicies;

