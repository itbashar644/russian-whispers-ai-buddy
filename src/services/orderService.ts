
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/types/product";
import { decreaseProductStock } from "@/data/products"; // Import the function to decrease stock

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

// Add the missing getUserOrders function that's being imported in UserOrders.tsx
export async function getUserOrders(userId: string) {
  // This function is essentially an alias for getOrdersByUserId for backward compatibility
  return getOrdersByUserId(userId);
}

// New function to create an order and update stock quantities
export async function createOrder(orderData: any) {
  try {
    // First, create the order in the database
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select();

    if (error) {
      console.error('Error creating order:', error);
      return { success: false, error };
    }

    // Then, update stock quantities for each product in the order
    if (orderData.items) {
      const orderItems = orderData.items as CartItem[];
      orderItems.forEach(item => {
        if (item.product && item.product.id) {
          decreaseProductStock(item.product.id, item.quantity);
        }
      });
    }

    return { success: true, order: data[0] };
  } catch (error) {
    console.error('Unexpected error creating order:', error);
    return { success: false, error };
  }
}
