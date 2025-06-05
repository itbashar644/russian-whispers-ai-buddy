
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Тип для клиента
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  registrationDate: string;
  totalOrders: number;
  totalSpent: number;
}

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Загрузка клиентов из базы данных
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        // Получаем пользователей из таблицы profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*');

        if (profilesError) {
          throw profilesError;
        }

        // Get orders data using explicit type casting for safety
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*');
        
        if (ordersError) {
          throw ordersError;
        }
        
        // Safely cast to the expected type
        const orders = ordersData as any[];

        // Формируем данные о клиентах
        const formattedCustomers: Customer[] = profiles.map(profile => {
          // Находим заказы клиента
          const userOrders = orders ? orders.filter(order => order.user_id === profile.id) : [];
          
          // Считаем общую сумму покупок
          const totalSpent = userOrders.reduce((sum, order) => sum + Number(order.total), 0);

          return {
            id: profile.id,
            name: profile.name || 'Без имени',
            email: profile.email || 'Нет email',
            phone: profile.phone,
            registrationDate: profile.created_at,
            totalOrders: userOrders.length,
            totalSpent: totalSpent
          };
        });

        setCustomers(formattedCustomers);
      } catch (error) {
        console.error('Error fetching customers:', error);
        toast.error('Ошибка при загрузке данных о клиентах');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);
  
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone && customer.phone.includes(searchTerm))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Клиенты</h2>
        <Button disabled>
          <Users className="mr-2 h-4 w-4" />
          Клиенты
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Поиск клиентов</CardTitle>
          <CardDescription>
            Найдите клиентов по имени, email или номеру телефона
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск клиентов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Список клиентов</CardTitle>
          <CardDescription>
            Всего клиентов: {filteredCustomers.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Дата регистрации</TableHead>
                    <TableHead>Заказов</TableHead>
                    <TableHead>Сумма покупок</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Клиенты не найдены
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-muted-foreground">{customer.email}</div>
                          <div className="text-sm text-muted-foreground">{customer.phone}</div>
                        </TableCell>
                        <TableCell>{new Date(customer.registrationDate).toLocaleDateString()}</TableCell>
                        <TableCell>{customer.totalOrders}</TableCell>
                        <TableCell>{customer.totalSpent.toLocaleString()} ₽</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Подробнее
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCustomers;
