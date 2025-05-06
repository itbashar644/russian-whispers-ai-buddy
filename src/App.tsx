
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/about" element={<About />} />
              <Route path="/delivery" element={<Delivery />} />
              <Route path="/contacts" element={<Contacts />} />
              
              {/* Маршруты аутентификации */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Маршруты личного кабинета */}
              <Route path="/account" element={
                <UserAuth>
                  <Account />
                </UserAuth>
              } />
              
              {/* Маршруты админ-панели */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/*" element={
                <AdminAuth>
                  <AdminPanel />
                </AdminAuth>
              } />
              
              {/* Маршрут "не найдено" */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
