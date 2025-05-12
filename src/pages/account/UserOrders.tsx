
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { getUserOrders } from "@/services/orderService";

interface Order {
  id: string;
  order_number: number;
  date: string;
  status: "new" | "processing" | "shipped" | "delivered" | "cancelled";
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
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      
      try {
        // Get user orders from service function
        const result = await getUserOrders(user.id);
        
        if (result.success && result.orders) {
          // Format orders for display
          const formattedOrders: Order[] = result.orders.map(order => ({
            id: order.id,
            order_number: order.order_number || 0, // Include order number, default to 0 if missing
            date: order.created_at,
            status: order.status as Order["status"],
            // Cast the items to CartItem[] with type assertion
            items: (order.items as unknown) as CartItem[],
            total: order.total,
            deliveryMethod: order.delivery_method,
            deliveryAddress: order.delivery_address
          }));
          
          setOrders(formattedOrders);
        } else {
          throw new Error("Failed to fetch orders");
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Не удалось загрузить ваши заказы');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();

    // Subscribe to real-time updates for orders
    const ordersSubscription = supabase
      .channel('orders_channel')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'orders',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          // Update order status if it changes
          const updatedOrder = payload.new as any;
          setOrders(currentOrders => 
            currentOrders.map(order => 
              order.id === updatedOrder.id 
                ? { 
                    ...order, 
                    status: updatedOrder.status as Order["status"]
                  } 
                : order
            )
          );

          toast.info(`Статус заказа №${updatedOrder.order_number || ''} изменен на "${getStatusText(updatedOrder.status)}"`);
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(ordersSubscription);
    };
  }, [user]);

  const getStatusColor = (status: Order["status"]) => {
    switch(status) {
      case "new": return "bg-blue-500";
      case "processing": return "bg-yellow-500";
      case "shipped": return "bg-orange-500";
      case "delivered": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch(status) {
      case "new": return "Новый";
      case "processing": return "В обработке";
      case "shipped": return "Отправлен";
      case "delivered": return "Доставлен";
      case "cancelled": return "Отменен";
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
                    <span className="font-medium">Заказ №{order.order_number}</span>
                    <span className="text-muted-foreground ml-4">{new Date(order.date).toLocaleDateString()}</span>
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
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Товар</TableHead>
                          <TableHead className="text-center">Количество</TableHead>
                          <TableHead className="text-right">Цена</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
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
                            </TableCell>
                            <TableCell className="text-center">{item.quantity}</TableCell>
                            <TableCell className="text-right">
                              {(item.product.price * item.quantity).toLocaleString()} ₽
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
