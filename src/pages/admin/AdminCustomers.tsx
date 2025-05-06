
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
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from "lucide-react";

// Фиктивные данные клиентов
const mockCustomers = [
  {
    id: "1",
    name: "Иванов Иван",
    email: "ivanov@example.com",
    phone: "+7 (900) 123-45-67",
    registrationDate: "2023-01-15",
    totalOrders: 3,
    totalSpent: 15600,
  },
  {
    id: "2",
    name: "Петров Петр",
    email: "petrov@example.com",
    phone: "+7 (900) 987-65-43",
    registrationDate: "2023-02-10",
    totalOrders: 2,
    totalSpent: 8700,
  },
  {
    id: "3",
    name: "Сидорова Анна",
    email: "sidorova@example.com",
    phone: "+7 (900) 555-55-55",
    registrationDate: "2023-03-05",
    totalOrders: 1,
    totalSpent: 4200,
  },
  {
    id: "4",
    name: "Козлов Дмитрий",
    email: "kozlov@example.com",
    phone: "+7 (900) 111-22-33",
    registrationDate: "2023-03-15",
    totalOrders: 4,
    totalSpent: 23500,
  },
  {
    id: "5",
    name: "Новикова Елена",
    email: "novikova@example.com",
    phone: "+7 (900) 444-55-66",
    registrationDate: "2023-04-01",
    totalOrders: 2,
    totalSpent: 9800,
  },
  {
    id: "6",
    name: "Морозов Алексей",
    email: "morozov@example.com",
    phone: "+7 (900) 777-88-99",
    registrationDate: "2023-05-12",
    totalOrders: 1,
    totalSpent: 5600,
  },
  {
    id: "7",
    name: "Волкова Ольга",
    email: "volkova@example.com",
    phone: "+7 (900) 333-22-11",
    registrationDate: "2023-05-20",
    totalOrders: 3,
    totalSpent: 18200,
  },
  {
    id: "8",
    name: "Соколов Игорь",
    email: "sokolov@example.com",
    phone: "+7 (900) 666-77-88",
    registrationDate: "2023-06-05",
    totalOrders: 2,
    totalSpent: 12400,
  }
];

const AdminCustomers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredCustomers = mockCustomers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Клиенты</h2>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Добавить клиента
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCustomers;
