
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import AdminDashboard from "./AdminDashboard";
import AdminProducts from "./AdminProducts";
import AdminCategories from "./AdminCategories";
import AdminOrders from "./AdminOrders";
import AdminCustomers from "./AdminCustomers";
import AdminReports from "./AdminReports";
import AdminSettings from "./AdminSettings";
import { NewsletterManager } from "@/components/admin/marketing/NewsletterManager";
import AdminAuth from "@/components/admin/AdminAuth";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset
} from "@/components/ui/sidebar";
import { LayoutDashboard, Package, LayoutList, ShoppingBag, Users, Mail, BarChart, Settings } from "lucide-react";

const AdminPanel = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: "/admin", label: "Дашборд", icon: LayoutDashboard, exact: true },
    { path: "/admin/products", label: "Товары", icon: Package },
    { path: "/admin/categories", label: "Категории", icon: LayoutList },
    { path: "/admin/orders", label: "Заказы", icon: ShoppingBag },
    { path: "/admin/customers", label: "Клиенты", icon: Users },
    { path: "/admin/marketing", label: "Рассылки", icon: Mail },
    { path: "/admin/reports", label: "Отчеты", icon: BarChart },
    { path: "/admin/settings", label: "Настройки", icon: Settings }
  ];
  
  return (
    <AdminAuth>
      <SidebarProvider defaultOpen={true}>
        <div className="grid min-h-screen w-full">
          <Sidebar>
            <div className="px-6 py-5 border-b">
              <h2 className="text-xl font-bold">Админ панель</h2>
            </div>
            <SidebarContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.exact 
                        ? location.pathname === item.path
                        : location.pathname.startsWith(item.path)}
                      tooltip={item.label}
                    >
                      <NavLink to={item.path} end={item.exact}>
                        <item.icon className="mr-2" />
                        <span>{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          
          <SidebarInset className="p-4 md:p-8">
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="products/*" element={<AdminProducts />} />
              <Route path="categories/*" element={<AdminCategories />} />
              <Route path="orders/*" element={<AdminOrders />} />
              <Route path="customers/*" element={<AdminCustomers />} />
              <Route path="marketing" element={<NewsletterManager />} />
              <Route path="reports/*" element={<AdminReports />} />
              <Route path="settings" element={<AdminSettings />} />
            </Routes>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AdminAuth>
  );
};

export default AdminPanel;
