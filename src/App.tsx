
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import React, { useEffect } from "react";
import Index from "@/pages/Index";
import Product from "@/pages/Product";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import About from "@/pages/About";
import Contacts from "@/pages/Contacts";
import Catalog from "@/pages/Catalog";
import Delivery from "@/pages/Delivery";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import AuthCallback from "@/pages/auth/AuthCallback";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import AdminPanel from "@/pages/admin/AdminPanel";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminCustomers from "@/pages/admin/AdminCustomers";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminReports from "@/pages/admin/AdminReports";
import { NewsletterManager } from "@/components/admin/marketing/NewsletterManager";
import Account from "@/pages/account/Account";
import AccountSecurity from "@/pages/account/AccountSecurity";
import UserOrders from "@/pages/account/UserOrders";
import Wishlist from "@/pages/Wishlist";
import ThankYou from "@/pages/ThankYou";
import OrderSuccess from "@/pages/OrderSuccess";
import ScrollToTop from "@/components/layout/ScrollToTop";
import YandexMetrika from "@/components/analytics/YandexMetrika";
import ChatWidget from "@/components/chat/ChatWidget";
import { ThemeProvider } from "@/components/theme-provider";
import "./App.css";

import { initRedirectHandler } from './utils/redirectHandler';

function App() {
  useEffect(() => {
    initRedirectHandler();
  }, []);

  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <Router>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <ScrollToTop />
                <YandexMetrika />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/delivery" element={<Delivery />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/thank-you" element={<ThankYou />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                  
                  {/* Account routes */}
                  <Route path="/account" element={<Account />} />
                  <Route path="/account/security" element={<AccountSecurity />} />
                  <Route path="/account/orders" element={<UserOrders />} />
                  
                  {/* Admin routes */}
                  <Route path="/admin/*" element={<AdminPanel />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  
                  {/* 404 route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
                <ChatWidget />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
