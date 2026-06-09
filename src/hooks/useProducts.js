import { useEffect, useState } from 'react';
import { getProducts } from '../services/productService';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setLoading(true);
      try {
        const list = await getProducts();
        if (isMounted) {
          setProducts(list);
          setError('');
        }
      } catch (err) {
        console.error('Error cargando productos:', err);
        if (isMounted) setError('No se pudieron cargar los productos');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  return { products, loading, error };
}
