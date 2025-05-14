
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AuthProvider } from '@/context/AuthContext';
import { toast } from "sonner";

import About from './pages/About';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AuthCallback from './pages/auth/AuthCallback';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import YandexCallback from './pages/auth/YandexCallback';
import Cart from './pages/Cart';
import NotFound from './pages/NotFound';
import Delivery from './pages/Delivery';
import Home from './pages/Home';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
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
      toast.error("Требуется авторизация", {
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
      <Route path="/delivery" element={<Delivery />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/auth/yandex-callback" element={<YandexCallback />} />
      {isAdmin && <Route path="/admin" element={<AdminPanel />} />}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Create placeholder components for missing pages
const Account = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Личный кабинет</h1>
      <p>Содержимое личного кабинета будет здесь.</p>
    </div>
  );
};

const AdminPanel = () => (
  <div className="container mx-auto py-8">
    <h1 className="text-3xl font-bold mb-6">Админ-панель</h1>
    <p>Панель администратора будет здесь.</p>
  </div>
);

const Products = () => (
  <div className="container mx-auto py-8">
    <h1 className="text-3xl font-bold mb-6">Товары</h1>
    <p>Список товаров будет здесь.</p>
  </div>
);

const ProductDetails = () => (
  <div className="container mx-auto py-8">
    <h1 className="text-3xl font-bold mb-6">Детали товара</h1>
    <p>Информация о товаре будет здесь.</p>
  </div>
);

const Checkout = () => (
  <div className="container mx-auto py-8">
    <h1 className="text-3xl font-bold mb-6">Оформление заказа</h1>
    <p>Форма оформления заказа будет здесь.</p>
  </div>
);

const OrderConfirmation = () => (
  <div className="container mx-auto py-8">
    <h1 className="text-3xl font-bold mb-6">Подтверждение заказа</h1>
    <p>Информация о подтверждении заказа будет здесь.</p>
  </div>
);

const Contact = () => (
  <div className="container mx-auto py-8">
    <h1 className="text-3xl font-bold mb-6">Контакты</h1>
    <p>Контактная информация будет здесь.</p>
  </div>
);

const Chat = () => (
  <div className="container mx-auto py-8">
    <h1 className="text-3xl font-bold mb-6">Чат</h1>
    <p>Чат с поддержкой будет здесь.</p>
  </div>
);

export default App;
