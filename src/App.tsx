
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import YandexMetrika from "@/components/analytics/YandexMetrika";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import OrderSuccess from "./pages/OrderSuccess";
import Account from "./pages/account/Account";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AuthCallback from "./pages/auth/AuthCallback";
import Contacts from "./pages/Contacts";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import Wishlist from "./pages/Wishlist";
import ResetPassword from "./pages/auth/ResetPassword";
import AdminPanel from "./pages/admin/AdminPanel";
import ChatWidget from "@/components/chat/ChatWidget";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <NotFound />,
  },
  {
    path: "/catalog",
    element: <Catalog />,
    errorElement: <NotFound />,
  },
  {
    path: "/product/:id",
    element: <ProductDetail />,
    errorElement: <NotFound />,
  },
  {
    path: "/cart",
    element: <Cart />,
    errorElement: <NotFound />,
  },
  {
    path: "/wishlist",
    element: <Wishlist />,
    errorElement: <NotFound />,
  },
  {
    path: "/order-success",
    element: <OrderSuccess />,
    errorElement: <NotFound />,
  },
  {
    path: "/account",
    element: <Account />,
    errorElement: <NotFound />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <NotFound />,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <NotFound />,
  },
  {
    path: "/auth/callback",
    element: <AuthCallback />,
    errorElement: <NotFound />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
    errorElement: <NotFound />,
  },
  {
    path: "/contacts",
    element: <Contacts />,
    errorElement: <NotFound />,
  },
  {
    path: "/about",
    element: <About />,
    errorElement: <NotFound />,
  },
  {
    path: "/privacy",
    element: <Privacy />,
    errorElement: <NotFound />,
  },
  {
    path: "/terms",
    element: <Terms />,
    errorElement: <NotFound />,
  },
  {
    path: "/admin/*",
    element: <AdminPanel />,
    errorElement: <NotFound />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="light" storageKey="the-x-shop-theme">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <YandexMetrika />
                <RouterProvider router={router} />
                <ChatWidget />
                <Toaster />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
