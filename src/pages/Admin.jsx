import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import {
  ALLOWED_ADMIN_EMAIL,
  firebaseAuth,
  firebaseDb,
  googleProvider,
  hasFirebaseClientConfig
} from '../lib/firebaseClient';
import { formatCLP } from '../utils/currency';
import productsSeed from '../data/products.json';

const DEFAULT_FORM = {
  id: '',
  slug: '',
  name: '',
  short: '',
  description: '',
  price: 0,
  offerPrice: 0,
  hasOffer: false,
  stock: 0,
  currency: 'CLP',
  brand: 'PetMAT',
  category: 'Productos para mascotas',
  mpn: '',
  active: true,
  featuresText: '',
  imagesText: ''
};

const toTextArea = (arr = []) => arr.join('\n');
const fromTextArea = (text = '') =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const ORDER_STATUS_OPTIONS = [
  { value: 'created', label: 'Creada' },
  { value: 'processing', label: 'Procesando' },
  { value: 'delivered', label: 'Entregada' }
];

const Admin = () => {
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState('');

  const productsRef = useMemo(() => (firebaseDb ? collection(firebaseDb, 'products') : null), []);
  const ordersRef = useMemo(() => (firebaseDb ? collection(firebaseDb, 'orders') : null), []);

  const currentProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) || null,
    [products, selectedProductId]
  );

  useEffect(() => {
    if (!firebaseAuth) {
      setLoadingAuth(false);
      return;
    }

    const unsub = onAuthStateChanged(firebaseAuth, async (authUser) => {
      setLoadingAuth(true);
      setUser(authUser || null);
      setAuthorized(Boolean(authUser?.email && authUser.email === ALLOWED_ADMIN_EMAIL));
      setLoadingAuth(false);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (authorized && productsRef) {
      loadProducts();
      loadOrders();
    }
  }, [authorized, productsRef, ordersRef]);

  const loadProducts = async () => {
    setLoadingProducts(true);
    setMessage('');
    if (!productsRef) {
      setMessage('Firebase no está configurado.');
      setLoadingProducts(false);
      return;
    }
    try {
      const docs = await getDocs(query(productsRef));
      const list = docs.docs
        .map((snap) => ({ id: snap.id, ...snap.data() }))
        .sort((a, b) => a.name.localeCompare(b.name));

      setProducts(list);

      if (list.length > 0) {
        selectProduct(list[0]);
      }
    } catch (error) {
      console.error('Error cargando productos:', error);
      setMessage('No se pudieron cargar los productos. Revisa reglas de Firestore.');
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadOrders = async () => {
    setLoadingOrders(true);
    if (!ordersRef) {
      setLoadingOrders(false);
      return;
    }
    try {
      const docs = await getDocs(query(ordersRef));
      const list = docs.docs
        .map((snap) => ({ id: snap.id, ...snap.data() }))
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setOrders(list);
    } catch (error) {
      console.error('Error cargando órdenes:', error);
      setMessage('No se pudieron cargar las órdenes.');
    } finally {
      setLoadingOrders(false);
    }
  };

  const selectProduct = (product) => {
    setSelectedProductId(product.id);
    setForm({
      id: product.id || '',
      slug: product.slug || '',
      name: product.name || '',
      short: product.short || '',
      description: product.description || '',
      price: Number(product.price || 0),
      offerPrice: Number(product.offerPrice || 0),
      hasOffer: Boolean(product.hasOffer),
      stock: Number(product.stock || 0),
      currency: product.currency || 'CLP',
      brand: product.brand || 'PetMAT',
      category: product.category || 'Productos para mascotas',
      mpn: product.mpn || '',
      active: product.active !== false,
      featuresText: toTextArea(product.features),
      imagesText: toTextArea(product.images)
    });
  };

  const handleGoogleLogin = async () => {
    setMessage('');
    try {
      if (!firebaseAuth || !googleProvider) {
        setMessage('Firebase Auth no está configurado.');
        return;
      }
      await signInWithPopup(firebaseAuth, googleProvider);
    } catch (error) {
      console.error(error);
      setMessage('No fue posible iniciar sesión con Google.');
    }
  };

  const handleLogout = async () => {
    if (!firebaseAuth) return;
    await signOut(firebaseAuth);
    setAuthorized(false);
    setSelectedProductId('');
    setForm(DEFAULT_FORM);
  };

  const handleForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateOrderStatus = async (orderId, orderStatus) => {
    if (!firebaseDb) return;
    setUpdatingOrderId(orderId);
    setMessage('');
    try {
      await updateDoc(doc(firebaseDb, 'orders', orderId), {
        orderStatus,
        updatedAt: new Date().toISOString()
      });
      await loadOrders();
      setMessage('Estado de orden actualizado.');
    } catch (error) {
      console.error(error);
      setMessage('No se pudo actualizar el estado de la orden.');
    } finally {
      setUpdatingOrderId('');
    }
  };

  const validateForm = () => {
    if (!form.id || !form.slug || !form.name) return 'ID, slug y nombre son obligatorios.';
    if (Number(form.price) <= 0) return 'El precio debe ser mayor a 0.';
    if (Number(form.stock) < 0) return 'El stock no puede ser negativo.';
    if (form.hasOffer && Number(form.offerPrice) <= 0) return 'El precio oferta debe ser mayor a 0.';
    if (form.hasOffer && Number(form.offerPrice) >= Number(form.price)) {
      return 'El precio oferta debe ser menor al precio normal.';
    }
    return '';
  };

  const buildPayload = () => ({
    slug: form.slug.trim(),
    name: form.name.trim(),
    short: form.short.trim(),
    description: form.description.trim(),
    price: Number(form.price),
    offerPrice: form.hasOffer ? Number(form.offerPrice) : null,
    hasOffer: Boolean(form.hasOffer),
    stock: Number(form.stock),
    currency: form.currency || 'CLP',
    brand: form.brand || 'PetMAT',
    category: form.category || 'Productos para mascotas',
    mpn: form.mpn || form.id,
    active: Boolean(form.active),
    features: fromTextArea(form.featuresText),
    images: fromTextArea(form.imagesText),
    updatedAt: new Date().toISOString()
  });

  const saveProduct = async () => {
    if (!firebaseDb) {
      setMessage('Firestore no está configurado.');
      return;
    }
    const error = validateForm();
    if (error) {
      setMessage(error);
      return;
    }

    setSaving(true);
    setMessage('');
    try {
      await updateDoc(doc(firebaseDb, 'products', form.id), buildPayload());
      await loadProducts();
      setMessage('Producto actualizado correctamente.');
    } catch (err) {
      console.error(err);
      setMessage('Error al actualizar producto.');
    } finally {
      setSaving(false);
    }
  };

  const createProduct = async () => {
    if (!firebaseDb) {
      setMessage('Firestore no está configurado.');
      return;
    }
    const error = validateForm();
    if (error) {
      setMessage(error);
      return;
    }

    setSaving(true);
    setMessage('');
    try {
      const payload = { ...buildPayload() };
      await setDoc(doc(firebaseDb, 'products', form.id.trim()), payload);
      await loadProducts();
      setMessage('Producto creado correctamente.');
    } catch (err) {
      console.error(err);
      setMessage('Error al crear producto.');
    } finally {
      setSaving(false);
    }
  };

  const seedInitialProducts = async () => {
    if (!firebaseDb) {
      setMessage('Firestore no está configurado.');
      return;
    }

    setSaving(true);
    setMessage('');
    try {
      const now = new Date().toISOString();
      for (const item of productsSeed) {
        await setDoc(doc(firebaseDb, 'products', item.id), {
          slug: item.slug,
          name: item.name,
          short: item.short || '',
          description: item.description || '',
          price: Number(item.price || 0),
          offerPrice: null,
          hasOffer: false,
          stock: 10,
          currency: 'CLP',
          brand: 'PetMAT',
          category: 'Productos para mascotas',
          mpn: item.id,
          active: true,
          features: item.features || [],
          images: item.images || [],
          updatedAt: now
        });
      }
      await loadProducts();
      setMessage('Seed inicial cargado en Firestore (3 productos).');
    } catch (error) {
      console.error(error);
      setMessage('No se pudo cargar seed inicial.');
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async () => {
    if (!firebaseDb) {
      setMessage('Firestore no está configurado.');
      return;
    }
    if (!currentProduct) return;
    const yes = window.confirm(`¿Eliminar producto "${currentProduct.name}"?`);
    if (!yes) return;

    setSaving(true);
    setMessage('');
    try {
      await deleteDoc(doc(firebaseDb, 'products', currentProduct.id));
      await loadProducts();
      setMessage('Producto eliminado.');
    } catch (err) {
      console.error(err);
      setMessage('No se pudo eliminar el producto.');
    } finally {
      setSaving(false);
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasFirebaseClientConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Configura Firebase Client</h1>
          <p className="text-gray-600">
            Falta configurar variables <code>VITE_FIREBASE_*</code> en el frontend. Revisa el archivo <code>.env.example</code>.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin PetMAT</h1>
          <p className="text-gray-600 mb-6">Ingresa con Google para administrar catálogo, precios, stock y ofertas.</p>
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-[#5AB5D9] transition-colors"
          >
            Entrar con Google
          </button>
          {message && <p className="text-sm text-red-600 mt-4">{message}</p>}
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso denegado</h1>
          <p className="text-gray-600 mb-4">Tu cuenta ({user.email}) no está autorizada para el panel admin.</p>
          <button
            onClick={handleLogout}
            className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-black transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel Admin PetMAT</h1>
            <p className="text-sm text-gray-500">Sesión: {user.email}</p>
          </div>
          <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 bg-white rounded-xl shadow p-2 inline-flex gap-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'products' ? 'bg-primary text-white' : 'text-gray-700'}`}
          >
            Productos
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'orders' ? 'bg-primary text-white' : 'text-gray-700'}`}
          >
            Ventas
          </button>
        </div>

        {activeTab === 'products' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="font-semibold text-gray-900 mb-4">Productos</h2>
              <button
                onClick={() => {
                  setSelectedProductId('');
                  setForm(DEFAULT_FORM);
                }}
                className="w-full mb-4 bg-primary text-white py-2 rounded-lg"
              >
                Nuevo producto
              </button>
              <button
                onClick={seedInitialProducts}
                disabled={saving}
                className="w-full mb-4 bg-gray-100 text-gray-800 py-2 rounded-lg border border-gray-300"
              >
                Cargar seed inicial
              </button>
              {loadingProducts ? (
                <p className="text-sm text-gray-500">Cargando...</p>
              ) : (
                <ul className="space-y-2">
                  {products.map((p) => (
                    <li key={p.id}>
                      <button
                        onClick={() => selectProduct(p)}
                        className={`w-full text-left p-3 rounded-lg border ${
                          selectedProductId === p.id ? 'border-primary bg-primary/5' : 'border-gray-200'
                        }`}
                      >
                        <p className="font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.id} · {formatCLP(p.price)}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="lg:col-span-2 bg-white rounded-xl shadow p-6 space-y-4">
              <h2 className="font-semibold text-gray-900">
                {selectedProductId ? 'Editar producto' : 'Crear producto'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="border rounded-lg p-2" placeholder="ID" value={form.id} onChange={(e) => handleForm('id', e.target.value)} />
                <input className="border rounded-lg p-2" placeholder="Slug" value={form.slug} onChange={(e) => handleForm('slug', e.target.value)} />
                <input className="border rounded-lg p-2 md:col-span-2" placeholder="Nombre" value={form.name} onChange={(e) => handleForm('name', e.target.value)} />
                <input className="border rounded-lg p-2 md:col-span-2" placeholder="Descripción corta" value={form.short} onChange={(e) => handleForm('short', e.target.value)} />
                <textarea className="border rounded-lg p-2 md:col-span-2" rows={4} placeholder="Descripción larga" value={form.description} onChange={(e) => handleForm('description', e.target.value)} />
                <input className="border rounded-lg p-2" type="number" placeholder="Precio" value={form.price} onChange={(e) => handleForm('price', e.target.value)} />
                <input className="border rounded-lg p-2" type="number" placeholder="Stock" value={form.stock} onChange={(e) => handleForm('stock', e.target.value)} />
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.hasOffer} onChange={(e) => handleForm('hasOffer', e.target.checked)} />
                  <span>Precio oferta activo</span>
                </label>
                <input className="border rounded-lg p-2" type="number" placeholder="Precio oferta" value={form.offerPrice} onChange={(e) => handleForm('offerPrice', e.target.value)} />
                <input className="border rounded-lg p-2" placeholder="Marca" value={form.brand} onChange={(e) => handleForm('brand', e.target.value)} />
                <input className="border rounded-lg p-2" placeholder="MPN" value={form.mpn} onChange={(e) => handleForm('mpn', e.target.value)} />
                <input className="border rounded-lg p-2 md:col-span-2" placeholder="Categoría Google" value={form.category} onChange={(e) => handleForm('category', e.target.value)} />
                <label className="flex items-center gap-2 md:col-span-2">
                  <input type="checkbox" checked={form.active} onChange={(e) => handleForm('active', e.target.checked)} />
                  <span>Producto activo</span>
                </label>
                <textarea
                  className="border rounded-lg p-2 md:col-span-2"
                  rows={4}
                  placeholder="Características (una por línea)"
                  value={form.featuresText}
                  onChange={(e) => handleForm('featuresText', e.target.value)}
                />
                <textarea
                  className="border rounded-lg p-2 md:col-span-2"
                  rows={4}
                  placeholder="Imágenes (una URL/path por línea)"
                  value={form.imagesText}
                  onChange={(e) => handleForm('imagesText', e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                {selectedProductId ? (
                  <button onClick={saveProduct} disabled={saving} className="bg-primary text-white px-4 py-2 rounded-lg">
                    Guardar cambios
                  </button>
                ) : (
                  <button onClick={createProduct} disabled={saving} className="bg-primary text-white px-4 py-2 rounded-lg">
                    Crear producto
                  </button>
                )}
                {selectedProductId && (
                  <button onClick={deleteProduct} disabled={saving} className="bg-red-600 text-white px-4 py-2 rounded-lg">
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-900">Ventas</h2>
              <button onClick={loadOrders} className="text-sm bg-gray-100 border border-gray-300 px-3 py-2 rounded-lg">
                Recargar
              </button>
            </div>

            {loadingOrders ? (
              <p className="text-sm text-gray-500">Cargando ventas...</p>
            ) : orders.length === 0 ? (
              <p className="text-sm text-gray-500">Aún no hay ventas registradas.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="py-2 pr-4">Fecha</th>
                      <th className="py-2 pr-4">Orden</th>
                      <th className="py-2 pr-4">Cliente</th>
                      <th className="py-2 pr-4">Pago</th>
                      <th className="py-2 pr-4">Total</th>
                      <th className="py-2 pr-4">Estado despacho</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b align-top">
                        <td className="py-3 pr-4 whitespace-nowrap">
                          {order.createdAt ? new Date(order.createdAt).toLocaleString('es-CL') : '-'}
                        </td>
                        <td className="py-3 pr-4">
                          <p className="font-medium">{order.externalReference || order.paymentId || order.id}</p>
                          <p className="text-xs text-gray-500">payment_id: {order.paymentId}</p>
                        </td>
                        <td className="py-3 pr-4">
                          <p className="font-medium">{order.customerName || '-'}</p>
                          <p className="text-xs text-gray-500">{order.payerEmail || '-'}</p>
                        </td>
                        <td className="py-3 pr-4">
                          <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700">
                            {order.paymentStatus || '-'}
                          </span>
                        </td>
                        <td className="py-3 pr-4 whitespace-nowrap">{formatCLP(order.total || 0)}</td>
                        <td className="py-3 pr-4">
                          <select
                            value={order.orderStatus || 'created'}
                            disabled={updatingOrderId === order.id}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="border rounded-lg p-2"
                          >
                            {ORDER_STATUS_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {message && (
          <div className="mt-6 text-sm rounded-lg border border-gray-200 bg-gray-50 p-3 text-gray-700">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;



