import { Link, Navigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import FAQBlock from '../components/FAQBlock';
import ProductCard from '../components/ProductCard';
import SeoHead from '../components/SeoHead';
import { BLOG_POSTS, getCategoryBySlug, getCategoryProducts } from '../data/seoContent';
import { useProducts } from '../hooks/useProducts';
import { buildBreadcrumbSchema } from '../lib/seo';

/**
 * Página de categoría: los productos van primero; el texto largo para
 * buscadores queda al final, plegado, para no interrumpir la compra.
 */
const SeoCategoryPage = ({ slug }) => {
  const category = getCategoryBySlug(slug);
  const { products } = useProducts();

  if (!category) return <Navigate to="/" replace />;

  const categoryProducts = getCategoryProducts(products, slug);
  const selectedProducts = categoryProducts.length ? categoryProducts : products;
  const relatedBlogPosts = BLOG_POSTS.filter((post) => post.relatedCategory === slug).slice(0, 3);

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
      acceptedAnswer: { '@type': 'Answer', text: faq.answer }
    }))
  };

  return (
    <div className="bg-white">
      <SeoHead
        title={category.title}
        description={category.description}
        schemas={[buildBreadcrumbSchema(breadcrumbItems), faqSchema]}
      />

      <section className="bg-ice py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} />
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-ink mt-3">{category.h1}</h1>
          <p className="text-lg text-gray-700 max-w-2xl mt-2">{category.intro}</p>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 bg-ice">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-5">Por qué funciona</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 max-w-4xl">
            {category.benefits.map((benefit) => (
              <li key={benefit} className="flex gap-2 text-gray-800">
                <span className="mt-2 w-2 h-2 rounded-full bg-primary flex-shrink-0" aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FAQBlock items={category.faqs} className="py-12" />

      <section className="pb-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <details className="group border-t border-gray-200 pt-4">
            <summary className="font-semibold text-ink cursor-pointer">
              {category.seoTextTitle}
            </summary>
            <div className="space-y-4 text-gray-700 leading-relaxed mt-4">
              {category.seoParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 30)}>{paragraph}</p>
              ))}
            </div>
          </details>

          {relatedBlogPosts.length > 0 && (
            <div className="mt-8">
              <h2 className="font-heading font-bold text-lg text-ink mb-2">Guías relacionadas</h2>
              <ul className="space-y-1">
                {relatedBlogPosts.map((post) => (
                  <li key={post.slug}>
                    <Link to={`/blog/${post.slug}`} className="text-primary-dark font-semibold hover:underline">
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SeoCategoryPage;
