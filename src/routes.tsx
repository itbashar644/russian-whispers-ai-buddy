
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import IndexWithChat from "./pages/IndexWithChat";
import About from "./pages/About";
import Contacts from "./pages/Contacts";
import Delivery from "./pages/Delivery";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Product from "./pages/Product";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import CatalogWithChat from "./pages/CatalogWithChat";
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
import { Suspense } from "react";
import { Skeleton } from "./components/ui/skeleton";
import ScrollToTop from "@/components/layout/ScrollToTop";

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexWithChat />,
    errorElement: <NotFound />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/contacts",
    element: <Contacts />,
  },
  {
    path: "/delivery",
    element: <Delivery />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
  {
    path: "/privacy",
    element: <Privacy />,
  },
  {
    path: "/catalog",
    element: (
      <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><Skeleton className="w-full h-full" /></div>}>
        <CatalogWithChat />
      </Suspense>
    ),
  },
  {
    path: "/product/:id",
    element: <Product />,
  },
  {
    path: "/wishlist",
    element: <Wishlist />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin/*",
    element: (
      <AdminAuth>
        <AdminPanel />
      </AdminAuth>
    ),
  },
  {
    path: "/account",
    element: (
      <UserAuth>
        <Account />
      </UserAuth>
    ),
  },
  {
    path: "/account/security",
    element: (
      <UserAuth>
        <AccountSecurity />
      </UserAuth>
    ),
  },
  {
    path: "/account/orders",
    element: (
      <UserAuth>
        <UserOrders />
      </UserAuth>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/auth/callback",
    element: <AuthCallback />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
]);

export const Routes = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ScrollToTop />
    </>
  );
};
