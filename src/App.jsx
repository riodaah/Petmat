import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './hooks/useCart';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Tienda from './pages/Tienda';
import Contacto from './pages/Contacto';
import ProductPage from './components/ProductPage';
import CheckoutMPNew from './components/CheckoutMPNew';
import Success from './pages/Success';
import Error from './pages/Error';

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
              <Route path="/producto/:slug" element={<ProductPage />} />
              <Route path="/checkout" element={<CheckoutMPNew />} />
              <Route path="/success" element={<Success />} />
              <Route path="/error" element={<Error />} />
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
