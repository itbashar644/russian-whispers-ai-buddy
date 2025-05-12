
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
  Accordion
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { getUserOrders } from "@/services/orderService";
import OrderAccordionItem from "@/components/orders/OrderAccordionItem";

interface Order {
  id: string;
  order_number: number;
  date: string;
  status: "new" | "processing" | "shipped" | "delivered" | "cancelled" | "archived";
  items: CartItem[];
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

  // Helper function to validate order status and provide type safety
  const validateOrderStatus = (status: string): Order["status"] => {
    const validStatuses: Order["status"][] = ["new", "processing", "shipped", "delivered", "cancelled", "archived"];
    return validStatuses.includes(status as Order["status"]) 
      ? (status as Order["status"]) 
      : "new"; // Default to "new" if invalid status
  };

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
          const formattedOrders: Order[] = result.orders.map((order: OrderFromDB) => ({
            id: order.id,
            order_number: order.order_number,
            date: order.created_at,
            status: validateOrderStatus(order.status),
            // Cast the items to CartItem[] with type assertion
            items: (order.items as unknown) as CartItem[],
            total: order.total,
            deliveryMethod: order.delivery_method,
            deliveryAddress: order.delivery_address,
            trackingNumber: order.tracking_number || undefined,
            trackingUrl: order.tracking_url || undefined
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
          const updatedOrder = payload.new as OrderFromDB;
          setOrders(currentOrders => 
            currentOrders.map(order => 
              order.id === updatedOrder.id 
                ? { 
                    ...order, 
                    status: validateOrderStatus(updatedOrder.status),
                    order_number: updatedOrder.order_number,
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
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(ordersSubscription);
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
