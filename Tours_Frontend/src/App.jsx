import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';

import AllTours from './pages/AllTours';
import { AuthProvider } from './context/AuthContext';
import AuthSuccess from './pages/AuthSuccess';
import Cart from './pages/Cart';
import { CartProvider } from './context/CartContext';
import Checkout from './pages/Checkout';
import FloatingButtons from './components/FloatingButtons';
import Footer from './components/Footer';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword';
import ScrollToTop from './components/ScrollToTop';

function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isHomePage={isHomePage} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/all-tours" element={<AllTours />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
  <Route path="/orders" element={<Orders />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
      </Routes>
      <Footer />
      <FloatingButtons />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
