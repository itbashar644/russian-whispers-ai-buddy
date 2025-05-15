
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./components/layout/ScrollToTop";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Delivery from "./pages/Delivery";
import Contacts from "./pages/Contacts";
import AdminPanel from "./pages/admin/AdminPanel";
import AdminLogin from "./pages/admin/AdminLogin";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import AdminAuth from "./components/admin/AdminAuth";
import UserAuth from "./components/account/UserAuth";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Account from "./pages/account/Account";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import AuthCallback from "./pages/auth/AuthCallback";
import ChatWidget from "./components/chat/ChatWidget";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <HelmetProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/about" element={<About />} />
                <Route path="/delivery" element={<Delivery />} />
                <Route path="/contacts" element={<Contacts />} />
                
                {/* Authentication routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/auth/reset-password" element={<ResetPassword />} /> {/* Add this route to catch Supabase reset links */}
                <Route path="/auth/callback" element={<AuthCallback />} />
                
                {/* Account routes */}
                <Route path="/account" element={
                  <UserAuth>
                    <Account />
                  </UserAuth>
                } />
                
                {/* Admin panel routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/*" element={
                  <AdminAuth>
                    <AdminPanel />
                  </AdminAuth>
                } />
                
                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              {/* Chat widget available on all pages except admin panel */}
              <ChatWidget />
            </BrowserRouter>
          </HelmetProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
