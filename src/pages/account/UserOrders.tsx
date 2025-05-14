
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Accordion
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { getUserOrders } from "@/services/orderService";
import OrderAccordionItem from "@/components/orders/OrderAccordionItem";

interface Order {
  id: string;
  order_number: number;
  date: string;
  status: "new" | "processing" | "shipped" | "delivered" | "cancelled" | "archived";
  items: any[];
  total: number;
  deliveryMethod: string;
  deliveryAddress: string;
  trackingNumber?: string;
  trackingUrl?: string;
}

// Define a type that matches what's returned from the database
interface OrderFromDB {
  id: string;
  order_number: number;
  created_at: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  delivery_method: string;
  items: unknown;
  status: string;
  total: number;
  updated_at: string;
  user_id: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
}

const UserOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to validate order status and provide type safety
  const validateOrderStatus = (status: string): Order["status"] => {
    const validStatuses: Order["status"][] = ["new", "processing", "shipped", "delivered", "cancelled", "archived"];
    return validStatuses.includes(status as Order["status"]) 
      ? (status as Order["status"]) 
      : "new"; // Default to "new" if invalid status
  };

  useEffect(() => {
    console.log("UserOrders component mounted, user:", user?.id);
    // Clear any previous errors
    setError(null);
    
    // Only attempt to fetch orders if we have a user
    if (!user) {
      console.log("No user found, setting empty orders");
      setOrders([]);
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      
      try {
        console.log('Fetching orders for user:', user.id);
        // Get user orders from service function
        const result = await getUserOrders(user.id);
        
        console.log('Orders fetch result:', result);
        
        if (result.success && result.orders) {
          console.log('Orders fetched successfully:', result.orders.length);
          
          if (result.orders.length === 0) {
            console.log("No orders found for user");
            setOrders([]);
            setLoading(false);
            return;
          }
          
          // Format orders for display
          const formattedOrders: Order[] = result.orders.map((order: OrderFromDB) => {
            try {
              console.log('Formatting order:', order.id);
              // Преобразуем данные из БД в формат для отображения
              return {
                id: order.id || `unknown-${Math.random()}`,
                order_number: order.order_number || 0,
                date: order.created_at || new Date().toISOString(),
                status: validateOrderStatus(order.status),
                // Проверяем, что items это массив
                items: Array.isArray(order.items) ? order.items : [],
                total: order.total || 0,
                deliveryMethod: order.delivery_method || "Не указан",
                deliveryAddress: order.delivery_address || "Не указан",
                trackingNumber: order.tracking_number || undefined,
                trackingUrl: order.tracking_url || undefined
              };
            } catch (err) {
              console.error("Error formatting order:", err, order);
              // Возвращаем заказ с минимальными данными в случае ошибки
              return {
                id: order.id || `error-${Math.random()}`,
                order_number: order.order_number || 0,
                date: new Date().toISOString(),
                status: "new",
                items: [],
                total: 0,
                deliveryMethod: "Ошибка загрузки",
                deliveryAddress: "Ошибка загрузки",
              };
            }
          });
          
          console.log('Orders formatted:', formattedOrders);
          setOrders(formattedOrders);
        } else {
          console.error('Failed to fetch orders:', result.error);
          setError('Не удалось загрузить заказы');
          throw new Error(result.error?.message || "Failed to fetch orders");
        }
      } catch (error: any) {
        console.error('Error fetching orders:', error);
        setError(`Не удалось загрузить ваши заказы: ${error.message || "Неизвестная ошибка"}`);
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
          console.log("Real-time update received:", payload);
          // Update order status if it changes
          try {
            const updatedOrder = payload.new as OrderFromDB;
            setOrders(currentOrders => 
              currentOrders.map(order => 
                order.id === updatedOrder.id 
                  ? { 
                      ...order, 
                      status: validateOrderStatus(updatedOrder.status),
                      order_number: updatedOrder.order_number || 0,
                      trackingNumber: updatedOrder.tracking_number || undefined,
                      trackingUrl: updatedOrder.tracking_url || undefined
                    } 
                  : order
              )
            );

            // Only show notification if the status changed (not for tracking updates)
            if (payload.old && (payload.old as any).status !== updatedOrder.status) {
              toast.info(`Статус заказа №${updatedOrder.order_number} изменен на "${getStatusText(validateOrderStatus(updatedOrder.status))}"`);
            }
          } catch (error) {
            console.error("Error processing real-time update:", error);
          }
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    // Также подписываемся на вставку новых заказов
    const newOrdersSubscription = supabase
      .channel('new_orders_channel')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'orders',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log("New order received:", payload);
          try {
            const newOrder = payload.new as OrderFromDB;
            
            // Форматируем новый заказ и добавляем его в список
            const formattedOrder: Order = {
              id: newOrder.id || `unknown-${Math.random()}`,
              order_number: newOrder.order_number || 0,
              date: newOrder.created_at || new Date().toISOString(),
              status: validateOrderStatus(newOrder.status),
              items: Array.isArray(newOrder.items) ? newOrder.items : [],
              total: newOrder.total || 0,
              deliveryMethod: newOrder.delivery_method || "Не указан",
              deliveryAddress: newOrder.delivery_address || "Не указан",
              trackingNumber: newOrder.tracking_number || undefined,
              trackingUrl: newOrder.tracking_url || undefined
            };
            
            // Добавляем новый заказ в начало списка
            setOrders(currentOrders => [formattedOrder, ...currentOrders]);
            toast.info(`Добавлен новый заказ №${newOrder.order_number}`);
          } catch (error) {
            console.error("Error processing new order:", error);
          }
        }
      )
      .subscribe((status) => {
        console.log("New orders subscription status:", status);
      });

    // Cleanup subscription on unmount
    return () => {
      console.log("UserOrders component unmounting, removing subscription");
      supabase.removeChannel(ordersSubscription);
      supabase.removeChannel(newOrdersSubscription);
    };
  }, [user]);

  // For notification toast
  const getStatusText = (status: Order["status"]) => {
    switch(status) {
      case "new": return "Новый";
      case "processing": return "В обработке";
      case "shipped": return "Отправлен";
      case "delivered": return "Доставлен";
      case "cancelled": return "Отменен";
      case "archived": return "Архивирован";
      default: return "Неизвестно";
    }
  };

  // Отображаем состояние загрузки
  if (loading) {
    console.log("Rendering loading state");
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

  // Отображаем состояние ошибки
  if (error) {
    console.log("Rendering error state:", error);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Мои заказы</CardTitle>
          <CardDescription>История ваших заказов</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
            >
              Попробовать снова
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Отображаем пустое состояние
  if (orders.length === 0) {
    console.log("Rendering empty state");
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

  // Отображаем список заказов
  console.log("Rendering orders list:", orders.length);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Мои заказы</CardTitle>
        <CardDescription>История ваших заказов</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {orders.map((order) => (
            <OrderAccordionItem
              key={order.id}
              id={order.id}
              order_number={order.order_number}
              date={order.date}
              status={order.status}
              items={order.items}
              total={order.total}
              deliveryMethod={order.deliveryMethod}
              deliveryAddress={order.deliveryAddress}
              trackingNumber={order.trackingNumber}
              trackingUrl={order.trackingUrl}
            />
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default UserOrders;
