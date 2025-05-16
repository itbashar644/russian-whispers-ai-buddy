
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from 'sonner';
import { Loading } from './components/ui/loading';
import ScrollToTop from './components/layout/ScrollToTop';
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider } from "./context/AuthContext";

// Lazy-loaded pages for better performance
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Contacts = lazy(() => import("./pages/Contacts"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Delivery = lazy(() => import("./pages/Delivery"));
const Catalog = lazy(() => import("./pages/Catalog"));
const Product = lazy(() => import("./pages/Product"));
const Cart = lazy(() => import("./pages/Cart"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminPanel = lazy(() => import("./pages/admin/AdminPanel"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminReports = lazy(() => import("./pages/admin/AdminReports"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const Account = lazy(() => import("./pages/account/Account"));
const UserOrders = lazy(() => import("./pages/account/UserOrders"));
const AccountSecurity = lazy(() => import("./pages/account/AccountSecurity"));
const Wishlist = lazy(() => import("./pages/Wishlist"));

// Auth pages
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const AuthCallback = lazy(() => import("./pages/auth/AuthCallback"));

// Create a new query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="x-shop-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <BrowserRouter>
                <ScrollToTop />
                <Suspense fallback={<Loading />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contacts" element={<Contacts />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/delivery" element={<Delivery />} />
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/product/:id" element={<Product />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminPanel />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="categories" element={<AdminCategories />} />
                      <Route path="settings" element={<AdminSettings />} />
                      <Route path="reports" element={<AdminReports />} />
                      <Route path="customers" element={<AdminCustomers />} />
                    </Route>
                    
                    {/* Account Routes */}
                    <Route path="/account" element={<Account />} />
                    <Route path="/account/orders" element={<UserOrders />} />
                    <Route path="/account/security" element={<AccountSecurity />} />
                    
                    {/* Auth Routes */}
                    <Route path="/auth/login" element={<Login />} />
                    <Route path="/auth/register" element={<Register />} />
                    <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                    <Route path="/auth/reset-password" element={<ResetPassword />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    
                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
                
                <Toaster position="top-right" richColors />
              </BrowserRouter>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
