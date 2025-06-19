
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Package, Users, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getActiveProducts } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get products count
        const products = await getActiveProducts();
        
        // Get orders that are not archived
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .not('status', 'eq', 'archived');
          
        if (ordersError) throw ordersError;
        
        // Get distinct customers count
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id');
          
        if (profilesError) throw profilesError;
        
        // Calculate stats
        const totalProducts = products.length;
        const totalOrders = orders ? orders.length : 0;
        const totalCustomers = profiles ? profiles.length : 0;
        const totalRevenue = orders ? orders.reduce((sum, order) => sum + Number(order.total), 0) : 0;
        
        setStats({
          totalProducts,
          totalOrders,
          totalCustomers,
          totalRevenue
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Дашборд</h2>
        <div className="text-sm text-muted-foreground">
          Последнее обновление: {new Date().toLocaleString()}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего заказов</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Активные заказы в системе
            </p>
            <Button variant="link" size="sm" className="mt-2 h-auto p-0" asChild>
              <Link to="/admin/orders" className="flex items-center">
                Просмотреть <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Товары</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Всего товаров в каталоге
            </p>
            <Button variant="link" size="sm" className="mt-2 h-auto p-0" asChild>
              <Link to="/admin/products" className="flex items-center">
                Управлять <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Клиенты</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Всего клиентов в базе
            </p>
            <Button variant="link" size="sm" className="mt-2 h-auto p-0" asChild>
              <Link to="/admin/customers" className="flex items-center">
                Посмотреть <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Выручка</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} ₽</div>
            <p className="text-xs text-muted-foreground mt-1">
              Общая сумма по активным заказам
            </p>
            <Button variant="link" size="sm" className="mt-2 h-auto p-0" asChild>
              <Link to="/admin/reports" className="flex items-center">
                Отчеты <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Руководство по использованию</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Как начать работу</h3>
              <p className="text-sm text-muted-foreground">
                Администраторская панель позволяет управлять заказами, товарами, клиентами и просматривать 
                отчеты по продажам. Используйте меню слева для навигации между разделами.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-1">Обработка заказов</h3>
              <p className="text-sm text-muted-foreground">
                В разделе "Заказы" вы можете просматривать новые заказы, изменять их статус и 
                отслеживать отправку. Для просмотра деталей заказа нажмите на его номер.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-1">Управление товарами</h3>
              <p className="text-sm text-muted-foreground">
                В разделе "Товары" вы можете добавлять новые товары, редактировать существующие, 
                изменять цены и наличие на складе.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-1">Нужна помощь?</h3>
              <p className="text-sm text-muted-foreground">
                Если у вас возникли вопросы по использованию админ-панели, обратитесь к документации 
                или свяжитесь с технической поддержкой.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
