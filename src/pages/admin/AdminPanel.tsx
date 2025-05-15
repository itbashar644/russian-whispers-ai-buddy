
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

const AdminPanel = () => {
  const location = useLocation();
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 hidden md:block bg-white shadow-sm pt-6">
        <div className="px-6 pb-6 mb-6 border-b">
          <h2 className="text-xl font-bold">Админ панель</h2>
        </div>
        
        <nav className="px-3">
          <NavItem to="/admin" end path={location.pathname}>
            Дашборд
          </NavItem>
          <NavItem to="/admin/products" path={location.pathname}>
            Товары
          </NavItem>
          <NavItem to="/admin/categories" path={location.pathname}>
            Категории
          </NavItem>
          <NavItem to="/admin/orders" path={location.pathname}>
            Заказы
          </NavItem>
          <NavItem to="/admin/customers" path={location.pathname}>
            Клиенты
          </NavItem>
          <NavItem to="/admin/marketing" path={location.pathname}>
            Рассылки
          </NavItem>
          <NavItem to="/admin/reports" path={location.pathname}>
            Отчеты
          </NavItem>
          <NavItem to="/admin/settings" path={location.pathname}>
            Настройки
          </NavItem>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/products/*" element={<AdminProducts />} />
          <Route path="/categories/*" element={<AdminCategories />} />
          <Route path="/orders/*" element={<AdminOrders />} />
          <Route path="/customers/*" element={<AdminCustomers />} />
          <Route path="/marketing" element={<NewsletterManager />} />
          <Route path="/reports/*" element={<AdminReports />} />
          <Route path="/settings/*" element={<AdminSettings />} />
        </Routes>
      </main>
    </div>
  );
};

const NavItem = ({ 
  children, 
  to, 
  path, 
  end = false 
}: { 
  children: React.ReactNode; 
  to: string; 
  path: string;
  end?: boolean;
}) => {
  const isActive = end 
    ? path === to 
    : path.startsWith(to);
  
  return (
    <NavLink
      to={to}
      end={end}
      className={cn(
        "flex items-center px-3 py-2 my-1 text-sm font-medium rounded-md",
        isActive 
          ? "bg-gray-100 text-gray-900" 
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      )}
    >
      {children}
    </NavLink>
  );
};

export default AdminPanel;
