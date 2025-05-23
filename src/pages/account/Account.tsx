
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import UserOrders from "./UserOrders";
import AccountSidebar from "@/components/account/AccountSidebar";
import ProfileForm from "@/components/account/ProfileForm";

const Account = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated, profile, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  // Упрощенная логика проверки аутентификации
  useEffect(() => {
    // Ждем завершения загрузки перед проверкой
    if (!isLoading) {
      if (!isAuthenticated) {
        console.log('User not authenticated, redirecting to login');
        navigate("/login", { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Показываем загрузку только пока идет проверка
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Если не авторизован, не рендерим контент (редирект уже произошел)
  if (!isAuthenticated) {
    return null;
  }

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-grow container px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar with user info */}
          <div className="md:w-1/4">
            <AccountSidebar 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onLogout={handleLogout}
            />
          </div>
          
          {/* Main content */}
          <div className="md:w-3/4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="profile">Личные данные</TabsTrigger>
                <TabsTrigger value="orders">Мои заказы</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <ProfileForm />
              </TabsContent>
              
              <TabsContent value="orders">
                <UserOrders />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Account;
