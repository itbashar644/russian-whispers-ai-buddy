
import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

// Добавим типы для заказов
interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  status: "new" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
  address: string;
  deliveryMethod: string;
}

// Создадим фиктивные данные для демонстрации
const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customerName: "Иванов Иван",
    customerEmail: "ivanov@example.com",
    customerPhone: "+7 (900) 123-45-67",
    items: [
      { 
        productId: "1", 
        productName: "Минималистичная настольная лампа", 
        price: 2490, 
        quantity: 1 
      }
    ],
    total: 2490,
    status: "new",
    date: "2023-06-01T10:00:00",
    address: "г. Москва, ул. Пушкина, д. 10, кв. 5",
    deliveryMethod: "СДЭК"
  },
  {
    id: "ORD-002",
    customerName: "Петров Петр",
    customerEmail: "petrov@example.com",
    customerPhone: "+7 (900) 987-65-43",
    items: [
      { 
        productId: "3", 
        productName: "Декоративная ваза в скандинавском стиле", 
        price: 1690, 
        quantity: 1 
      },
      { 
        productId: "5", 
        productName: "Умный ночник с датчиком движения", 
        price: 1290, 
        quantity: 2 
      }
    ],
    total: 4270,
    status: "processing",
    date: "2023-06-02T14:30:00",
    address: "г. Санкт-Петербург, Невский пр-т, д. 100, кв. 15",
    deliveryMethod: "Почта России"
  },
  {
    id: "ORD-003",
    customerName: "Сидорова Анна",
    customerEmail: "sidorova@example.com",
    customerPhone: "+7 (900) 555-55-55",
    items: [
      { 
        productId: "8", 
        productName: "Набор керамических горшков для растений", 
        price: 1790, 
        quantity: 1 
      }
    ],
    total: 1790,
    status: "shipped",
    date: "2023-06-03T09:15:00",
    address: "г. Екатеринбург, ул. Ленина, д. 50, кв. 25",
    deliveryMethod: "OZON"
  }
];

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    
    toast({
      title: "Статус заказа обновлен",
      description: `Заказ ${orderId} теперь имеет статус "${newStatus}"`,
    });
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Order["status"]) => {
    const statusMap: Record<Order["status"], string> = {
      new: "Новый",
      processing: "В обработке",
      shipped: "Отправлен",
      delivered: "Доставлен",
      cancelled: "Отменен"
    };
    return statusMap[status];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление заказами</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Фильтры</CardTitle>
          <CardDescription>
            Отфильтруйте заказы по статусу или воспользуйтесь поиском
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <Input
                placeholder="Поиск по ID, имени или контактам"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-1/3">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Все статусы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="new">Новые</SelectItem>
                  <SelectItem value="processing">В обработке</SelectItem>
                  <SelectItem value="shipped">Отправленные</SelectItem>
                  <SelectItem value="delivered">Доставленные</SelectItem>
                  <SelectItem value="cancelled">Отмененные</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Список заказов</CardTitle>
          <CardDescription>
            Всего заказов: {filteredOrders.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID заказа</TableHead>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Доставка</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Заказы не найдены
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.customerEmail}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(order.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{order.total.toLocaleString()} ₽</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </TableCell>
                      <TableCell>{order.deliveryMethod}</TableCell>
                      <TableCell className="text-right">
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order.id, value as Order["status"])}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Изменить статус" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">Новый</SelectItem>
                            <SelectItem value="processing">В обработке</SelectItem>
                            <SelectItem value="shipped">Отправлен</SelectItem>
                            <SelectItem value="delivered">Доставлен</SelectItem>
                            <SelectItem value="cancelled">Отменен</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;
