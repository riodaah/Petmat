import FAQBlock from '../components/FAQBlock';
import ProductGrid from '../components/ProductGrid';
import SeoHead from '../components/SeoHead';
import { getShippingFaqs } from '../data/productContent';
import { useProducts } from '../hooks/useProducts';
import { getChristmasDeadlines, isChristmasSeason } from '../lib/season';

const Tienda = () => {
  const { products, loading, error } = useProducts();
  const christmas = isChristmasSeason();
  const deadlines = getChristmasDeadlines();

  return (
    <div className="bg-white">
      <SeoHead
        title="Tienda PetMAT | Alfombras olfativas y comedero automático"
        description="Compra alfombras olfativas para perros y comedero automático con cámara. Envío gratis en la Región Metropolitana y despacho a todo Chile."
      />

      <section className="bg-ice py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-ink">
            {christmas ? 'Regalos de Navidad para tu mascota' : 'Tienda'}
          </h1>
          <p className="text-lg text-gray-700 mt-2">
            Envío gratis en la Región Metropolitana.
            {deadlines?.rm ? ` Pide hasta el ${deadlines.rm} y llega antes de Navidad.` : ''}
          </p>
        </div>
      </section>

      {loading ? (
        <section className="py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" role="status" aria-label="Cargando productos" />
        </section>
      ) : (
        <>
          {error && (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">{error}</div>
            </div>
          )}
          <ProductGrid products={products} />
        </>
      )}

      <FAQBlock title="Envíos, pagos y devoluciones" items={getShippingFaqs(deadlines)} className="py-12 bg-ice" />
    </div>
  );
};

export default Tienda;
