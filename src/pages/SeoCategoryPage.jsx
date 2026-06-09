import { Link, Navigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import FAQBlock from '../components/FAQBlock';
import ProductCard from '../components/ProductCard';
import SeoHead from '../components/SeoHead';
import SeoTextBlock from '../components/SeoTextBlock';
import { BLOG_POSTS, getCategoryBySlug, getCategoryProducts, pickRelatedProducts } from '../data/seoContent';
import { useProducts } from '../hooks/useProducts';
import { buildBreadcrumbSchema } from '../lib/seo';

const SeoCategoryPage = ({ slug }) => {
  const category = getCategoryBySlug(slug);
  const { products } = useProducts();

  if (!category) return <Navigate to="/" replace />;

  const categoryProducts = getCategoryProducts(products, slug);
  const selectedProducts = categoryProducts.length ? categoryProducts : products;
  const relatedBlogPosts = BLOG_POSTS.filter((post) => post.relatedCategory === slug).slice(0, 3);
  const relatedProducts = pickRelatedProducts(products, slug, 2);

  const breadcrumbItems = [
    { label: 'Inicio', path: '/' },
    { label: category.h1, path: `/${category.slug}` }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: category.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-white">
      <SeoHead
        title={category.title}
        description={category.description}
        schemas={[buildBreadcrumbSchema(breadcrumbItems), faqSchema]}
      />

      <section className="bg-gradient-to-br from-primary/10 to-muted py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} />
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-text mt-4 mb-4">{category.h1}</h1>
          <p className="text-lg text-gray-700 max-w-3xl">{category.intro}</p>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-text mb-5">Beneficios principales</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {category.benefits.map((benefit) => (
              <li key={benefit} className="bg-white border border-gray-200 rounded-xl p-4 text-gray-700">
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-10 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-text mb-6">Productos recomendados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-text mb-6">Guías relacionadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedBlogPosts.map((post) => (
              <article key={post.slug} className="border border-gray-200 rounded-xl p-5">
                <h3 className="text-xl font-heading font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-700 text-sm mb-3">{post.description}</p>
                <Link to={`/blog/${post.slug}`} className="text-primary font-semibold hover:underline">
                  Leer guía
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FAQBlock items={category.faqs} />
      <SeoTextBlock title={category.seoTextTitle} paragraphs={category.seoParagraphs} />

      <section className="py-12 bg-primary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-text mb-5">
            Siguiente paso para mejorar la rutina
          </h2>
          <p className="text-gray-700 mb-6 max-w-2xl">
            Si quieres resultados sostenibles, combina producto + rutina + educación. Acá tienes dos productos y el blog para empezar hoy.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Link to="/blog" className="inline-flex items-center px-5 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-[#5AB5D9]">
            Ver más guías del blog
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SeoCategoryPage;
