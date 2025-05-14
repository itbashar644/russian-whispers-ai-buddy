
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AdminCategories from "./admin/AdminCategories";

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Check if user is admin
  React.useEffect(() => {
    const checkAdminStatus = async () => {
      // This is just a placeholder, replace with your actual admin check
      const isAdmin = user?.id === "79954994-b9e6-4569-8b09-a3910851384a";
      if (!isAdmin) {
        navigate("/");
      }
    };

    checkAdminStatus();
  }, [user, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Панель администратора</h1>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="space-y-6"
        >
          <TabsList>
            <TabsTrigger value="dashboard">Дашборд</TabsTrigger>
            <TabsTrigger value="products">Товары</TabsTrigger>
            <TabsTrigger value="orders">Заказы</TabsTrigger>
            <TabsTrigger value="categories">Категории</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Дашборд</h2>
              <p className="text-muted-foreground">
                Здесь будет сводная информация по магазину
              </p>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Управление товарами</h2>
              <p className="text-muted-foreground">
                Здесь будет список товаров с возможностью редактирования
              </p>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Управление заказами</h2>
              <p className="text-muted-foreground">
                Здесь будет список заказов с возможностью изменения статуса
              </p>
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <AdminCategories />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPanel;
