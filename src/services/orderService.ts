
import { supabase } from "@/integrations/supabase/client";

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
