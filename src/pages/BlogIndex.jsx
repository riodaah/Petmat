import { Link } from 'react-router-dom';
import SeoHead from '../components/SeoHead';
import Breadcrumbs from '../components/Breadcrumbs';
import { BLOG_POSTS } from '../data/seoContent';
import { buildBreadcrumbSchema } from '../lib/seo';

const BlogIndex = () => {
  const breadcrumbItems = [
    { label: 'Inicio', path: '/' },
    { label: 'Blog', path: '/blog' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SeoHead
        title="Blog PetMAT | Guías para perros inquietos, aburridos y ansiosos"
        description="Consejos prácticos para estimulación mental, juegos de olfato, alimentación lenta y bienestar de perros en casa."
        schemas={[buildBreadcrumbSchema(breadcrumbItems)]}
      />

      <section className="bg-gradient-to-br from-primary/10 to-muted py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} />
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-text mt-4 mb-4">Blog PetMAT</h1>
          <p className="text-lg text-gray-700 max-w-3xl">
            Guías pensadas para resolver problemas reales: inquietud, aburrimiento, ansiedad y alimentación apurada.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BLOG_POSTS.map((post) => (
              <article key={post.slug} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <img
                  src={post.image}
                  alt={post.imageAlt || post.title}
                  className="w-full h-44 object-cover rounded-lg mb-4"
                  loading="lazy"
                />
                <h2 className="text-2xl font-heading font-bold text-text mb-3">
                  <Link to={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-700 mb-4">{post.description}</p>
                <Link to={`/blog/${post.slug}`} className="font-semibold text-primary hover:underline">
                  Leer artículo
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogIndex;
