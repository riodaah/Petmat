import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './hooks/useCart';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Tienda from './pages/Tienda';
import Contacto from './pages/Contacto';
import ProductPage from './components/ProductPage';
import CheckoutMPRailway from './components/CheckoutMPRailway';
import Success from './pages/Success';
import Error from './pages/Error';
import Pending from './pages/Pending';
import Admin from './pages/Admin';
import PolicyPage from './pages/PolicyPage';
import BlogIndex from './pages/BlogIndex';
import BlogPost from './pages/BlogPost';
import SeoCategoryPage from './pages/SeoCategoryPage';

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tienda" element={<Tienda />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/blog" element={<BlogIndex />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/manta-olfativa-para-perros" element={<SeoCategoryPage slug="manta-olfativa-para-perros" />} />
              <Route path="/comedero-automatico-para-perros" element={<SeoCategoryPage slug="comedero-automatico-para-perros" />} />
              <Route path="/comedero-automatico-para-gatos" element={<SeoCategoryPage slug="comedero-automatico-para-gatos" />} />
              <Route path="/alimentacion-lenta-para-perros" element={<SeoCategoryPage slug="alimentacion-lenta-para-perros" />} />
              <Route path="/juguetes-interactivos-para-perros" element={<SeoCategoryPage slug="juguetes-interactivos-para-perros" />} />
              <Route path="/politicas/:slug" element={<PolicyPage />} />
              <Route path="/producto/:slug" element={<ProductPage />} />
                  <Route path="/checkout" element={<CheckoutMPRailway />} />
                  <Route path="/success" element={<Success />} />
                  <Route path="/pending" element={<Pending />} />
                  <Route path="/error" element={<Error />} />
                  <Route path="/admin" element={<Admin />} />
                  {/* 404 - Redirigir a home */}
                  <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
