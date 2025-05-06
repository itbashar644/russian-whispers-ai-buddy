
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { CartItem } from "@/types/product";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  date: string;
  status: "processing" | "shipped" | "delivered" | "canceled";
  items: CartItem[];
  total: number;
  deliveryMethod: string;
  deliveryAddress: string;
}

const UserOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Имитируем загрузку заказов
    const fetchOrders = () => {
      setLoading(true);
      
      // В реальном приложении здесь будет запрос к API
      setTimeout(() => {
        // Генерируем демо-заказы
        if (user) {
          const demoOrders: Order[] = [
            {
              id: "ORD-2023-001",
              date: "15.04.2023",
              status: "delivered",
              items: [
                {
                  product: {
                    id: "p1",
                    title: "Портативный проектор XYZ",
                    description: "Компактный проектор с разрешением HD.",
                    price: 24990,
                    category: "projectors",
                    imageUrl: "/placeholder.svg",
                    rating: 4.5,
                    inStock: true,
                    countryOfOrigin: "Китай",
                  },
                  quantity: 1
                }
              ],
              total: 24990,
              deliveryMethod: "Курьер",
              deliveryAddress: "г. Москва, ул. Ленина, 123"
            },
            {
              id: "ORD-2023-002",
              date: "22.05.2023",
              status: "shipped",
              items: [
                {
                  product: {
                    id: "p2",
                    title: "Наушники беспроводные ABC",
                    description: "Беспроводные наушники с шумоподавлением.",
                    price: 6990,
                    category: "headphones",
                    imageUrl: "/placeholder.svg",
                    rating: 4.2,
                    inStock: true,
                    countryOfOrigin: "Китай",
                  },
                  quantity: 2
                }
              ],
              total: 13980,
              deliveryMethod: "Самовывоз",
              deliveryAddress: "г. Москва, ул. Пушкина, 10"
            }
          ];
          setOrders(demoOrders);
        }
        
        setLoading(false);
      }, 800);
    };
    
    fetchOrders();
  }, [user]);

  const getStatusColor = (status: Order["status"]) => {
    switch(status) {
      case "processing": return "bg-blue-500";
      case "shipped": return "bg-orange-500";
      case "delivered": return "bg-green-500";
      case "canceled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch(status) {
      case "processing": return "В обработке";
      case "shipped": return "Отправлен";
      case "delivered": return "Доставлен";
      case "canceled": return "Отменен";
      default: return "Неизвестно";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Мои заказы</CardTitle>
          <CardDescription>История ваших заказов</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Мои заказы</CardTitle>
          <CardDescription>История ваших заказов</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <p className="text-muted-foreground">У вас пока нет заказов</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Мои заказы</CardTitle>
        <CardDescription>История ваших заказов</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {orders.map((order) => (
            <AccordionItem key={order.id} value={order.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">
                  <div>
                    <span className="font-medium">{order.id}</span>
                    <span className="text-muted-foreground ml-4">{order.date}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 sm:mt-0">
                    <Badge variant="secondary">
                      {order.total.toLocaleString()} ₽
                    </Badge>
                    <Badge className={getStatusColor(order.status) + " text-white"}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="p-3 text-left">Товар</th>
                          <th className="p-3 text-center">Количество</th>
                          <th className="p-3 text-right">Цена</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <div className="h-16 w-16 flex-shrink-0 rounded overflow-hidden">
                                  <img 
                                    src={item.product.imageUrl} 
                                    alt={item.product.title}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">{item.product.title}</p>
                                  {item.color && (
                                    <p className="text-xs text-muted-foreground">Цвет: {item.color}</p>
                                  )}
                                  {item.size && (
                                    <p className="text-xs text-muted-foreground">Размер: {item.size}</p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-center">{item.quantity}</td>
                            <td className="p-3 text-right">
                              {(item.product.price * item.quantity).toLocaleString()} ₽
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Способ доставки</h4>
                      <p className="text-muted-foreground">{order.deliveryMethod}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Адрес доставки</h4>
                      <p className="text-muted-foreground">{order.deliveryAddress}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-semibold">Итого</span>
                    <span className="font-bold text-lg">{order.total.toLocaleString()} ₽</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default UserOrders;
