
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/types/product";
import { decreaseProductStock } from "@/data/products/productData";

export async function getAllOrders() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return { success: false, error };
    }

    return { success: true, orders: data };
  } catch (error) {
    console.error('Unexpected error fetching orders:', error);
    return { success: false, error };
  }
}

export async function getOrdersByUserId(userId: string) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user orders:', error);
      return { success: false, error };
    }

    return { success: true, orders: data };
  } catch (error) {
    console.error('Unexpected error fetching user orders:', error);
    return { success: false, error };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select();

    if (error) {
      console.error('Error updating order status:', error);
      return { success: false, error };
    }

    return { success: true, order: data[0] };
  } catch (error) {
    console.error('Unexpected error updating order status:', error);
    return { success: false, error };
  }
}

// Function to create a new order
export async function createOrder(orderData: {
  user_id?: string;
  items: CartItem[];
  total: number;
  delivery_method: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
}) {
  try {
    // Уменьшаем количество товаров на складе
    const stockUpdatesSuccessful = orderData.items.every(item => 
      decreaseProductStock(item.product.id, item.quantity)
    );

    if (!stockUpdatesSuccessful) {
      return { 
        success: false, 
        error: { message: "Недостаточно товаров на складе для выполнения заказа" } 
      };
    }

    const { data, error } = await supabase
      .from('orders')
      .insert([{
        id: generateOrderId(),
        ...orderData
      }])
      .select();

    if (error) {
      console.error('Error creating order:', error);
      return { success: false, error };
    }

    return { success: true, order: data[0] };
  } catch (error) {
    console.error('Unexpected error creating order:', error);
    return { success: false, error };
  }
}

// Helper function to generate a unique order ID
function generateOrderId() {
  const timestamp = new Date().getTime().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${timestamp}${random}`;
}

// Function that's being imported in UserOrders.tsx
export async function getUserOrders(userId: string) {
  // This function is essentially an alias for getOrdersByUserId for backward compatibility
  return getOrdersByUserId(userId);
}
