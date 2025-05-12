
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  getAllOrders, 
  updateOrderStatus, 
  updateOrderTracking 
} from "@/services/orderService";
import OrderFilter from "@/components/admin/orders/OrderFilter";
import OrdersTable from "@/components/admin/orders/OrdersTable";

// Типы для заказов
export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  status: "new" | "processing" | "shipped" | "delivered" | "cancelled" | "archived";
  date: string;
  address: string;
  deliveryMethod: string;
  userId: string | null;
  trackingNumber?: string;
  trackingUrl?: string;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  // Загрузка заказов из Supabase
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const result = await getAllOrders();

        if (result.success && result.orders) {
          // Преобразуем данные из базы в формат Order
          const formattedOrders: Order[] = result.orders.map(order => ({
            id: order.id,
            orderNumber: order.order_number,
            customerName: order.customer_name,
            customerEmail: order.customer_email,
            customerPhone: order.customer_phone,
            // Use type assertion to properly convert JSON items to OrderItem[]
            items: (order.items as unknown) as OrderItem[],
            total: order.total,
            status: validateOrderStatus(order.status),
            date: order.created_at,
            address: order.delivery_address,
            deliveryMethod: order.delivery_method,
            userId: order.user_id,
            trackingNumber: order.tracking_number || undefined,
            trackingUrl: order.tracking_url || undefined
          }));
          
          setOrders(formattedOrders);
        } else {
          throw new Error("Failed to fetch orders");
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Ошибка при загрузке заказов');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Subscribe to real-time updates
    const ordersSubscription = supabase
      .channel('orders_admin_channel')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'orders' 
        },
        (payload) => {
          const newOrder = payload.new as any;
          
          const formattedOrder: Order = {
            id: newOrder.id,
            orderNumber: newOrder.order_number,
            customerName: newOrder.customer_name,
            customerEmail: newOrder.customer_email,
            customerPhone: newOrder.customer_phone,
            // Cast JSON items to OrderItem[] type using double assertion
            items: (newOrder.items as unknown) as OrderItem[],
            total: newOrder.total,
            status: validateOrderStatus(newOrder.status),
            date: newOrder.created_at,
            address: newOrder.delivery_address,
            deliveryMethod: newOrder.delivery_method,
            userId: newOrder.user_id,
            trackingNumber: newOrder.tracking_number || undefined,
            trackingUrl: newOrder.tracking_url || undefined
          };
          
          setOrders(prevOrders => [formattedOrder, ...prevOrders]);
          toast.info(`Получен новый заказ №${newOrder.order_number}`);
        }
      )
      .subscribe();
      
    // Cleanup on unmount
    return () => {
      supabase.removeChannel(ordersSubscription);
    };
  }, []);

  // Helper function to validate order status
  const validateOrderStatus = (status: string): Order["status"] => {
    const validStatuses: Order["status"][] = ["new", "processing", "shipped", "delivered", "cancelled", "archived"];
    return validStatuses.includes(status as Order["status"]) 
      ? (status as Order["status"]) 
      : "new"; // Default to "new" if invalid status
  };

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      
      if (result.success) {
        // Обновляем локальное состояние заказов
        setOrders(
          orders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
        
        toast.success('Статус заказа обновлен', {
          description: `Заказ №${orders.find(o => o.id === orderId)?.orderNumber} теперь имеет статус "${getStatusText(newStatus)}"`,
        });
      } else {
        throw new Error("Failed to update order status");
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Ошибка при обновлении статуса заказа');
    }
  };

  const handleArchiveOrder = async (orderId: string) => {
    await handleStatusChange(orderId, "archived");
  };

  const handleTrackingUpdate = async (orderId: string, trackingNumber: string, trackingUrl: string) => {
    try {
      const result = await updateOrderTracking(
        orderId, 
        trackingNumber.trim(),
        trackingUrl.trim()
      );
      
      if (result.success) {
        // Update local state
        setOrders(
          orders.map((order) =>
            order.id === orderId 
              ? { 
                  ...order, 
                  trackingNumber: trackingNumber.trim(),
                  trackingUrl: trackingUrl.trim() 
                } 
              : order
          )
        );
        
        const orderNumber = orders.find(o => o.id === orderId)?.orderNumber;
        toast.success('Информация о треке обновлена', {
          description: `Трек-номер для заказа №${orderNumber} успешно сохранен`,
        });
      } else {
        throw new Error("Failed to update tracking information");
      }
    } catch (error) {
      console.error('Error updating tracking information:', error);
      toast.error('Ошибка при обновлении информации о треке');
    }
  };

  const filteredOrders = orders.filter((order) => {
    // Фильтрация по архивным заказам
    if (!showArchived && order.status === "archived") {
      return false;
    }
    
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderNumber.toString().includes(searchTerm);

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
      case "archived":
        return "bg-gray-100 text-gray-800";
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
      cancelled: "Отменен",
      archived: "Архивирован"
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
          <OrderFilter 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            showArchived={showArchived}
            onToggleArchived={() => setShowArchived(!showArchived)}
          />
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
          <OrdersTable 
            orders={filteredOrders}
            loading={loading}
            onStatusChange={handleStatusChange}
            onArchive={handleArchiveOrder}
            onTrackingUpdate={handleTrackingUpdate}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;
