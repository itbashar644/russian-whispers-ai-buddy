
import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import AdminAuth from "@/components/admin/AdminAuth";
import AdminDashboard from "./AdminDashboard";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import AdminCustomers from "./AdminCustomers";
import AdminCategories from "./AdminCategories";
import AdminSettings from "./AdminSettings";
import AdminReports from "./AdminReports";
import { NewsletterManager } from "@/components/admin/marketing/NewsletterManager";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const AdminPanel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Дашборд', href: '/admin/dashboard', current: false },
    { name: 'Товары', href: '/admin/products', current: false },
    { name: 'Заказы', href: '/admin/orders', current: false },
    { name: 'Клиенты', href: '/admin/customers', current: false },
    { name: 'Категории', href: '/admin/categories', current: false },
    { name: 'Рассылка', href: '/admin/newsletter', current: false },
    { name: 'Отчеты', href: '/admin/reports', current: false },
    { name: 'Настройки', href: '/admin/settings', current: false },
  ];

  return (
    <AdminAuth>
      <div className="flex h-screen bg-gray-100">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex lg:flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 flex-shrink-0">
            <h1 className="text-xl font-semibold text-gray-800">Админ-панель</h1>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Mobile header */}
          <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Админ-панель</h1>
            <div className="w-8" /> {/* Spacer for centering */}
          </div>

          {/* Content area with proper scrolling */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-full mx-auto">
              <Routes>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="newsletter" element={<NewsletterManager />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="settings" element={<AdminSettings />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </AdminAuth>
  );
};

export default AdminPanel;
