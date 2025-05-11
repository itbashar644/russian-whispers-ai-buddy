
import { Routes, Route, NavLink, Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  LogOut,
  Settings,
  List,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import AdminDashboard from "./AdminDashboard";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import AdminCustomers from "./AdminCustomers";
import AdminReports from "./AdminReports";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import AdminCategories from "./AdminCategories";

const AdminPanel = () => {
  const { logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    toast("Выход выполнен", {
      description: "Вы вышли из административной панели",
    });
  };

  const navigation = [
    {
      title: "Панель управления",
      href: "/admin",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      title: "Товары",
      href: "/admin/products",
      icon: <Package className="h-4 w-4" />,
    },
    {
      title: "Категории",
      href: "/admin/categories",
      icon: <List className="h-4 w-4" />,
    },
    {
      title: "Заказы",
      href: "/admin/orders",
      icon: <ShoppingCart className="h-4 w-4" />,
    },
    {
      title: "Пользователи",
      href: "/admin/customers",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Отчеты",
      href: "/admin/reports",
      icon: <BarChart3 className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r bg-background">
        <div className="p-6">
          <h2 className="text-2xl font-bold">Админ панель</h2>
          <p className="text-sm text-muted-foreground">Управление магазином</p>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/admin"}
              className={({ isActive }) =>
                cn(
                  "flex items-center py-2 px-3 rounded-md text-sm font-medium",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              {item.icon}
              <span className="ml-3">{item.title}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t space-y-2">
          <Link to="/">
            <Button
              variant="outline"
              className="w-full justify-start"
            >
              <Home className="h-4 w-4 mr-2" />
              На сайт
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Выйти
          </Button>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-background">
        <h2 className="text-xl font-bold">Админ панель</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/">
              <Home className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="icon" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 flex-1">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/products" element={<AdminProducts />} />
            <Route path="/categories" element={<AdminCategories />} />
            <Route path="/orders" element={<AdminOrders />} />
            <Route path="/customers" element={<AdminCustomers />} />
            <Route path="/reports" element={<AdminReports />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
