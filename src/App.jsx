import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FirebaseService from './services/FirebaseService';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminLogin from './pages/Admin/AdminLogin';
import DynamicPage from './pages/DynamicPage';
import FAQ from './pages/FAQ';
import CollectionProducts from './pages/CollectionProducts';
import Invoice from './pages/Invoice';
import NotFound from './pages/NotFound';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';

function App() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  // Check Maintenance Mode
  React.useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const settings = await FirebaseService.getStoreSettings();
        setMaintenanceMode(settings?.maintenanceMode || false);
      } catch (error) {
        console.error("Error checking maintenance mode", error);
      }
    };

    checkMaintenance();

    // Set up a listener or interval if real-time toggle is needed, 
    // but for now fetch on load is sufficient.
    const interval = setInterval(checkMaintenance, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Check if current route is admin
  React.useEffect(() => {
    setIsAdminRoute(window.location.pathname.startsWith('/admin'));
  }, []);

  if (maintenanceMode && !window.location.pathname.startsWith('/admin')) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: '#F3F4F6', zIndex: 9999, display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '2rem'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          {/* Use text logo if image fails or generic icon */}
          <h1 style={{ fontSize: '3rem', fontWeight: '800', color: '#059669', letterSpacing: '2px', margin: 0 }}>
            ECO<span style={{ color: '#10B981' }}>SHOPY</span>
          </h1>
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '1rem' }}>
          We'll be back soon!
        </h2>
        <p style={{ fontSize: '1.25rem', color: '#4B5563', maxWidth: '600px', lineHeight: '1.6' }}>
          Our website is currently under maintenance for improvements.
          We apologize for the inconvenience and appreciate your patience.
        </p>
        <div style={{ marginTop: '3rem', padding: '1rem 2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>Expected return: Shortly</p>
        </div>
      </div>
    );
  }

  return (
    <CartProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="collections/:id" element={<CollectionProducts />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-success" element={<OrderSuccess />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="profile" element={<Profile />} />
            <Route path="orders" element={<Orders />} />
            <Route path="pages/:slug" element={<DynamicPage />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/invoice/:orderId" element={<Invoice />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
