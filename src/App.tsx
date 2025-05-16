
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ScrollToTop from "@/components/layout/ScrollToTop";

// Pages
import Index from "@/pages/Index";
import About from "@/pages/About";
import Product from "@/pages/Product";
import Catalog from "@/pages/Catalog";
import Contacts from "@/pages/Contacts";
import Delivery from "@/pages/Delivery";
import ProductDetail from "@/pages/ProductDetail";
import Wishlist from "@/pages/Wishlist";
import Cart from "@/pages/Cart";
import NotFound from "@/pages/NotFound";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";

// Account pages
import Account from "@/pages/account/Account";
import AccountSecurity from "@/pages/account/AccountSecurity";
import UserOrders from "@/pages/account/UserOrders";

// Auth pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import AuthCallback from "@/pages/auth/AuthCallback";

// Admin pages
import AdminPanel from "@/pages/admin/AdminPanel";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminCustomers from "@/pages/admin/AdminCustomers";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminReports from "@/pages/admin/AdminReports";

// Context providers
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";

// Components
import ChatWidget from "@/components/chat/ChatWidget";

import "./App.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                  {/* Main routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/delivery" element={<Delivery />} />
                  <Route path="/product" element={<Product />} />
                  <Route path="/product/:productId" element={<ProductDetail />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/cart" element={<Cart />} />
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
                  <Route path="/admin" element={<AdminPanel />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="customers" element={<AdminCustomers />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="reports" element={<AdminReports />} />
                  </Route>
                  <Route path="/admin/login" element={<AdminLogin />} />

                  {/* 404 Not Found */}
                  <Route path="*" element={<NotFound />} />
                </Routes>

                <SonnerToaster richColors position="top-right" />
                <Toaster />
                <ChatWidget />
              </BrowserRouter>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
