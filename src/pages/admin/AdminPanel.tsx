
import React, { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { 
  ShoppingCart, 
  Package, 
  Users, 
  FileText, 
  ChartBar, 
  LayoutDashboard 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminOrders from "./AdminOrders";
import AdminProducts from "./AdminProducts";
import AdminDashboard from "./AdminDashboard";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/admin/${value === "dashboard" ? "" : value}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Административная панель</h1>
          </div>
          <div>
            <Button variant="outline" asChild>
              <Link to="/">Вернуться на сайт</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 bg-white border-r p-4 hidden md:block">
          <nav className="space-y-2">
            <Link 
              to="/admin" 
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-md ${
                activeTab === "dashboard" ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              <ChartBar size={20} />
              <span>Дашборд</span>
            </Link>
            <Link 
              to="/admin/orders" 
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-md ${
                activeTab === "orders" ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("orders")}
            >
              <ShoppingCart size={20} />
              <span>Заказы</span>
            </Link>
            <Link 
              to="/admin/products" 
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-md ${
                activeTab === "products" ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("products")}
            >
              <Package size={20} />
              <span>Товары</span>
            </Link>
            <Link 
              to="/admin/customers" 
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-md ${
                activeTab === "customers" ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("customers")}
            >
              <Users size={20} />
              <span>Клиенты</span>
            </Link>
            <Link 
              to="/admin/reports" 
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-md ${
                activeTab === "reports" ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("reports")}
            >
              <FileText size={20} />
              <span>Отчеты</span>
            </Link>
          </nav>
        </aside>

        <div className="md:hidden p-2 sticky top-0 bg-white z-10 border-b w-full">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="dashboard">Дашборд</TabsTrigger>
              <TabsTrigger value="orders">Заказы</TabsTrigger>
              <TabsTrigger value="products">Товары</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/orders" element={<AdminOrders />} />
            <Route path="/products" element={<AdminProducts />} />
            <Route path="/customers" element={<div className="text-center p-8 text-gray-500">Раздел находится в разработке</div>} />
            <Route path="/reports" element={<div className="text-center p-8 text-gray-500">Раздел находится в разработке</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
