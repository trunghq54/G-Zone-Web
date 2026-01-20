import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import MissionLog from './pages/MissionLog';
import Support from './pages/Support';
import Checkout from './pages/Checkout';
import Garage from './pages/Garage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Accessories from './pages/Accessories';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const hideHeaderRoutes = ['/login'];
  const isHeaderHidden = hideHeaderRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen font-display text-white bg-background-dark selection:bg-primary selection:text-white">
      {!isHeaderHidden && <Header />}
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      {!isHeaderHidden && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/missions" element={<MissionLog />} />
          <Route path="/support" element={<Support />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/garage" element={<Garage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/shop" element={<Accessories />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;