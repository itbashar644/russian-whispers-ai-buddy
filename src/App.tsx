
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";

import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Account from './pages/Account';
import AdminPanel from './pages/AdminPanel';
import AuthCallback from './pages/auth/AuthCallback';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Contact from './pages/Contact';
import About from './pages/About';
import Chat from './pages/Chat';
import YandexCallback from './pages/auth/YandexCallback';

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent = () => {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        // Assuming you have a function to check if the user has the admin role
        const isAdminUser = await checkUserRole(user.id);
        setIsAdmin(isAdminUser);
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user, navigate]);

  const checkUserRole = async (userId: string): Promise<boolean> => {
    // Replace this with your actual logic to check user roles
    // For example, fetching from a database or using a context
    // This is just a placeholder
    return new Promise((resolve) => {
      // Simulate checking the role, replace with actual implementation
      setTimeout(() => {
        // Example: Check if the user ID matches a known admin ID
        const hardcodedAdminUserId = "79954994-b9e6-4569-8b09-a3910851384a"; // Replace with a real admin user ID
        resolve(userId === hardcodedAdminUserId);
      }, 500);
    });
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated && window.location.pathname === '/account') {
      toast({
        title: "Требуется авторизация",
        description: "Пожалуйста, войдите или зарегистрируйтесь, чтобы получить доступ к аккаунту.",
      });
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка...</p>
          <p className="text-sm text-muted-foreground mt-2">The X Shop</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/account" element={isAuthenticated ? <Account /> : <Login />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-confirmation" element={<OrderConfirmation />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      {isAdmin && <Route path="/admin" element={<AdminPanel />} />}
      <Route path="/auth/yandex-callback" element={<YandexCallback />} />
    </Routes>
  );
};

export default App;
