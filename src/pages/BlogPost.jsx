import { Link, Navigate, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import SeoHead from '../components/SeoHead';
import FAQBlock from '../components/FAQBlock';
import ProductCard from '../components/ProductCard';
import { getPostBySlug, getCategoryBySlug, pickRelatedProducts } from '../data/seoContent';
import { useProducts } from '../hooks/useProducts';
import { buildBreadcrumbSchema } from '../lib/seo';

const BlogPost = () => {
  const { slug } = useParams();
  const post = getPostBySlug(slug);
  const { products } = useProducts();

  if (!post) return <Navigate to="/blog" replace />;

  const relatedCategory = getCategoryBySlug(post.relatedCategory);
  const relatedProducts = pickRelatedProducts(products, post.relatedCategory, 2);

  const breadcrumbItems = [
    { label: 'Inicio', path: '/' },
    { label: 'Blog', path: '/blog' },
    { label: post.title, path: `/blog/${post.slug}` }
  ];

  const faqItems = [
    {
      question: '¿Cuánto tiempo al día necesito para estas actividades?',
      answer:
        'Con 10 a 20 minutos bien enfocados puedes notar cambios. Lo importante es la constancia más que la duración.'
    },
    {
      question: '¿Sirve para perros adultos y senior?',
      answer:
        'Sí. Solo debes ajustar dificultad, intensidad y tipo de premio según su edad y condición física.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SeoHead
        title={`${post.title} | Blog PetMAT`}
        description={post.description}
        schemas={[buildBreadcrumbSchema(breadcrumbItems)]}
      />

      <section className="py-10 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Breadcrumbs items={breadcrumbItems} />
          <img
            src={post.image}
            alt={post.imageAlt || post.title}
            className="w-full h-[320px] md:h-[420px] object-cover rounded-2xl mt-5 mb-5"
            loading="eager"
          />
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-text mt-5 mb-4">{post.h1}</h1>
          <p className="text-lg text-gray-700">{post.description}</p>
        </div>
      </section>

      <article className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-10">
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-heading font-bold text-text mb-4">{section.heading}</h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 30)}>{paragraph}</p>
                ))}
              </div>
              <h3 className="text-lg font-heading font-semibold text-text mt-5 mb-2">Tip práctico</h3>
              <p className="text-gray-700">
                Aplícalo de forma gradual y observa cómo responde tu perro para ajustar la rutina sin generar frustración.
              </p>
            </section>
          ))}

          <section className="bg-primary/5 border border-primary/20 rounded-xl p-6">
            <h2 className="text-2xl font-heading font-bold text-text mb-3">¿Cómo seguir?</h2>
            <p className="text-gray-700 mb-4">{post.cta}</p>
            {relatedCategory && (
              <Link to={`/${relatedCategory.slug}`} className="font-semibold text-primary hover:underline">
                Ir a {relatedCategory.h1.toLowerCase()}
              </Link>
            )}
          </section>
        </div>
      </article>

      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-text mb-6">Productos recomendados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <FAQBlock title="Preguntas frecuentes sobre la rutina en casa" items={faqItems} />
    </div>
  );
};

export default BlogPost;
