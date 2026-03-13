import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import Home from "@/features/home/routes/Home";
import MissionLog from "@/features/missions/routes/MissionLog";
import Support from "@/features/support/routes/Support";
import Checkout from "@/features/checkout/routes/Checkout";
import Garage from "@/features/workshop/routes/Garage";
import Dashboard from "@/features/dashboard/routes/Dashboard";
import Login from "@/features/auth/routes/AuthPage";
import ProductDetail from "@/features/products/routes/ProductDetail";
import Cart from "@/features/cart/routes/Cart";
import Accessories from "@/features/products/routes/Accessories";
import { AuthProvider } from "@/providers/AuthProvider";

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen font-display text-white bg-background-dark selection:bg-primary selection:text-white">
      <Header />
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

import ProfilePage from "@/features/accounts/routes/ProfilePage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/missions" element={<MissionLog />} />
            <Route path="/support" element={<Support />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/garage" element={<Garage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/product" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/shop" element={<Accessories />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
