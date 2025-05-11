
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/pages/admin/AdminOrders";
import { CartItem } from "@/types/product";
import { v4 as uuidv4 } from "uuid";

// Функция для создания нового заказа
export const createOrder = async (
  userId: string | null,
  cartItems: CartItem[],
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  deliveryAddress: string,
  deliveryMethod: string,
  total: number
) => {
  try {
    const orderId = `ORD-${new Date().getFullYear()}-${uuidv4().slice(0, 8)}`;
    
    const formattedItems = cartItems.map(item => ({
      productId: item.product.id,
      productName: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
      color: item.color || null,
      size: item.size || null,
      imageUrl: item.product.imageUrl
    }));
    
    // Создаем новый заказ в базе
    const { data, error } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        user_id: userId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        items: formattedItems,
        total: total,
        status: 'new',
        delivery_address: deliveryAddress,
        delivery_method: deliveryMethod,
        created_at: new Date().toISOString()
      })
      .select();
    
    if (error) throw error;
    
    return { success: true, orderId };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error };
  }
};

// Функция для получения всех заказов
export const getAllOrders = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return { success: true, orders: data };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { success: false, error };
  }
};

// Функция для получения заказов пользователя
export const getUserOrders = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return { success: true, orders: data };
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return { success: false, error };
  }
};

// Функция для обновления статуса заказа
export const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select();
    
    if (error) throw error;
    
    return { success: true, order: data[0] };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error };
  }
};
