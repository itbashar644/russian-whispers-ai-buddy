
import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import About from "./pages/About";
import Contacts from "./pages/Contacts";
import Delivery from "./pages/Delivery";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Product from "./pages/Product";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminPanel from "./pages/admin/AdminPanel";
import AdminAuth from "./components/admin/AdminAuth";
import Account from "./pages/account/Account";
import AccountSecurity from "./pages/account/AccountSecurity";
import UserOrders from "./pages/account/UserOrders";
import UserAuth from "./components/account/UserAuth";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AuthCallback from "./pages/auth/AuthCallback";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import { Skeleton } from "./components/ui/skeleton";
import Navbar from "./components/layout/Navbar";
import ScrollToTop from "./components/layout/ScrollToTop";
import ChatWidget from "./components/chat/ChatWidget";

// Lazy load components
const CatalogLazy = lazy(() => import("./pages/Catalog"));

export const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route 
          path="/catalog" 
          element={
            <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><Skeleton className="w-full h-full" /></div>}>
              <CatalogLazy />
              <ChatWidget />
            </Suspense>
          } 
        />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/*" 
          element={
            <AdminAuth>
              <AdminPanel />
            </AdminAuth>
          } 
        />
        <Route 
          path="/account" 
          element={
            <UserAuth>
              <Account />
            </UserAuth>
          } 
        />
        <Route 
          path="/account/security" 
          element={
            <UserAuth>
              <AccountSecurity />
            </UserAuth>
          } 
        />
        <Route 
          path="/account/orders" 
          element={
            <UserAuth>
              <UserOrders />
            </UserAuth>
          } 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};
