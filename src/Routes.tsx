
import React from "react";
import { Routes as RouterRoutes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Contacts from "./pages/Contacts";
import Delivery from "./pages/Delivery";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import AuthCallback from "./pages/auth/AuthCallback";
import Account from "./pages/account/Account";
import AccountSecurity from "./pages/account/AccountSecurity";
import UserOrders from "./pages/account/UserOrders";

// Admin routes
import AdminPanel from "./pages/admin/AdminPanel";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";

const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/catalog" element={<Catalog />} />
      <Route path="/catalog/:categorySlug" element={<Catalog />} />
      <Route path="/product/:slug" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/delivery" element={<Delivery />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      
      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Account routes */}
      <Route path="/account" element={<Account />} />
      <Route path="/account/security" element={<AccountSecurity />} />
      <Route path="/account/orders" element={<UserOrders />} />
      
      {/* Admin routes */}
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/products" element={<AdminProducts />} />
      <Route path="/admin/categories" element={<AdminCategories />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
      <Route path="/admin/customers" element={<AdminCustomers />} />
      <Route path="/admin/reports" element={<AdminReports />} />
      <Route path="/admin/settings" element={<AdminSettings />} />
      
      {/* Not Found */}
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
};

export default Routes;
