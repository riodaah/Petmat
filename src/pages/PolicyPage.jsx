import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const POLICY_CONFIG = {
  envio: {
    title: 'Política de Envío',
    file: 'shipping'
  },
  devoluciones: {
    title: 'Política de Devoluciones',
    file: 'returns'
  },
  contacto: {
    title: 'Contacto',
    file: 'contact'
  },
  'terminos-y-condiciones': {
    title: 'Términos y Condiciones',
    file: 'terms'
  },
  privacidad: {
    title: 'Política de Privacidad',
    file: 'privacy'
  }
};

export default function PolicyPage() {
  const { slug } = useParams();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const policy = useMemo(() => POLICY_CONFIG[slug], [slug]);

  useEffect(() => {
    const loadPolicy = async () => {
      if (!policy) {
        setError('Esta política no existe.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await fetch(`/policies/${policy.file}.md`);
        if (!response.ok) {
          throw new Error(`No se pudo cargar ${policy.file}.md`);
        }
        const text = await response.text();
        setContent(text);
      } catch (err) {
        console.error('Error cargando política:', err);
        setError('No se pudo cargar el contenido de esta política.');
      } finally {
        setLoading(false);
      }
    };

    loadPolicy();
  }, [policy]);

  if (loading) {
    return (
      <section className="py-20 bg-white min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-text mb-6">Políticas PetMAT</h1>
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-text mb-8">{policy.title}</h1>

        <article className="prose prose-lg max-w-none">
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
              p: ({ children }) => <p className="text-text mb-4 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
              li: ({ children }) => <li className="text-text">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold text-text">{children}</strong>,
              a: ({ href, children }) => (
                <a href={href} className="text-primary hover:underline">
                  {children}
                </a>
              )
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </section>
  );
}
