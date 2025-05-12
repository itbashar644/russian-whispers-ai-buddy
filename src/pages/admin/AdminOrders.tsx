
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getAllOrders, updateOrderStatus, updateOrderTracking } from "@/services/orderService";
import { Archive, ExternalLink, Truck } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

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
  
  // Tracking information form state
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");

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

  const handleTrackingSubmit = async () => {
    if (!selectedOrderId) return;

    try {
      const result = await updateOrderTracking(
        selectedOrderId, 
        trackingNumber.trim(),
        trackingUrl.trim()
      );
      
      if (result.success) {
        // Update local state
        setOrders(
          orders.map((order) =>
            order.id === selectedOrderId 
              ? { 
                  ...order, 
                  trackingNumber: trackingNumber.trim(),
                  trackingUrl: trackingUrl.trim() 
                } 
              : order
          )
        );
        
        // Reset form
        setTrackingNumber("");
        setTrackingUrl("");
        setSelectedOrderId("");
        
        const orderNumber = orders.find(o => o.id === selectedOrderId)?.orderNumber;
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

  const openTrackingDialog = (order: Order) => {
    setSelectedOrderId(order.id);
    setTrackingNumber(order.trackingNumber || '');
    setTrackingUrl(order.trackingUrl || '');
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
                  <SelectItem value="archived">Архивированные</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/3 flex items-center space-x-2">
              <Button 
                variant={showArchived ? "default" : "outline"} 
                onClick={() => setShowArchived(!showArchived)}
              >
                <Archive className="h-4 w-4 mr-2" />
                {showArchived ? "Скрыть архивные" : "Показать архивные"}
              </Button>
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
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>№</TableHead>
                    <TableHead>ID заказа</TableHead>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Доставка</TableHead>
                    <TableHead>Трекинг</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-4">
                        Заказы не найдены
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id} className={order.status === 'archived' ? 'opacity-60' : ''}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
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
                        <TableCell>
                          {order.trackingNumber ? (
                            <div className="flex items-center">
                              <Truck className="h-4 w-4 mr-1" />
                              <span className="text-xs">{order.trackingNumber}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">Не задан</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => openTrackingDialog(order)}
                                >
                                  <Truck className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Данные для отслеживания заказа</DialogTitle>
                                  <DialogDescription>
                                    Добавьте трек-номер и ссылку для отслеживания заказа №{order.orderNumber}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="tracking-number">Трек-номер</Label>
                                    <Input 
                                      id="tracking-number" 
                                      value={trackingNumber} 
                                      onChange={(e) => setTrackingNumber(e.target.value)}
                                      placeholder="Введите трек-номер"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="tracking-url">Ссылка для отслеживания</Label>
                                    <Input 
                                      id="tracking-url" 
                                      value={trackingUrl} 
                                      onChange={(e) => setTrackingUrl(e.target.value)}
                                      placeholder="https://..."
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Отмена</Button>
                                  </DialogClose>
                                  <DialogClose asChild>
                                    <Button onClick={handleTrackingSubmit}>Сохранить</Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            {order.status !== 'archived' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleArchiveOrder(order.id)}
                                className="text-gray-500"
                              >
                                <Archive className="h-4 w-4" />
                              </Button>
                            )}
                            <Select
                              value={order.status}
                              onValueChange={(value) => handleStatusChange(order.id, value as Order["status"])}
                              disabled={order.status === 'archived'}
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
                                <SelectItem value="archived">Архивирован</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
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

export default AdminOrders;
