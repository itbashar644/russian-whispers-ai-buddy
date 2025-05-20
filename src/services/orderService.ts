import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/types/product";
import { checkProductStock, decreaseProductStock } from "@/data/products/product/productServiceSpecialized";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { handleGuestCheckout } from "@/utils/auth/guestCheckout";

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
    console.log(`Fetching orders for user ID: ${userId}`);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user orders:', error);
      return { success: false, error };
    }

    console.log(`Found ${data?.length || 0} orders for user ID: ${userId}`);
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

// Function that's being imported in UserOrders.tsx
export async function getUserOrders(userId: string) {
  console.log(`Getting orders for user ID: ${userId}`);
  // This function is essentially an alias for getOrdersByUserId for backward compatibility
  return getOrdersByUserId(userId);
}

// New function to update order tracking information
export async function updateOrderTracking(orderId: string, trackingNumber: string, trackingUrl: string) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        tracking_number: trackingNumber,
        tracking_url: trackingUrl
      })
      .eq('id', orderId)
      .select();

    if (error) {
      console.error('Error updating order tracking:', error);
      return { success: false, error };
    }

    return { success: true, order: data[0] };
  } catch (error) {
    console.error('Unexpected error updating order tracking:', error);
    return { success: false, error };
  }
}

// New function to place an order with guest checkout support
export async function placeOrder(orderData: {
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
    console.log('Placing order with data:', orderData);
    
    // Handle guest checkout - create a user account if no user_id is provided
    if (!orderData.user_id) {
      console.log('Guest checkout detected, registering user');
      const { success, userId, error } = await handleGuestCheckout(
        orderData.customer_email, 
        orderData.customer_name
      );
      
      if (success && userId) {
        console.log('Guest user registered successfully with ID:', userId);
        orderData.user_id = userId;
      } else if (error) {
        console.error('Failed to register guest user:', error);
        // Continue with guest checkout even if registration fails
      }
    }
    
    // Check stock availability for all items before placing the order
    for (const item of orderData.items) {
      const colorVariant = item.color || undefined;
      const stockAvailable = await checkProductStock(item.product.id, colorVariant);

      if (!stockAvailable || item.quantity <= 0) {
        return {
          success: false,
          error: {
            message: `Недостаточно товара ${item.product.title} на складе`
          }
        };
      }
    }

     // Convert CartItem array to simplified order item format including article number
    const orderItems = orderData.items.map(item => ({
      productId: item.product.id,
      productName: item.product.title,
      price: item.selectedColorVariant
        ? (item.selectedColorVariant.discountPrice ?? item.selectedColorVariant.price)
        : (item.product.discountPrice ?? item.product.price),
      quantity: item.quantity,
      color: item.color,
      size: item.size,
      articleNumber: item.selectedColorVariant?.articleNumber || item.product.articleNumber || ''
    }));
    
    // Generate a unique ID for the order
    const orderId = uuidv4();

    console.log('Creating order with ID:', orderId);
    console.log('User ID:', orderData.user_id || 'Guest checkout');

    // Create the order in the database
    // Set order_number to 0 temporarily and let the database trigger update it
    const { data, error } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        order_number: 0, // Placeholder value, will be replaced by the trigger
        user_id: orderData.user_id || null, // Ensure null for guest checkout
        items: orderItems,
        total: orderData.total,
        delivery_method: orderData.delivery_method,
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        delivery_address: orderData.delivery_address,
        status: 'new'
      })
      .select();

    if (error) {
      console.error('Error creating order:', error);
      return { success: false, error };
    }

       // Decrease stock only after the order is successfully created
    for (const item of orderData.items) {
      const colorVariant = item.color || undefined;
      await decreaseProductStock(item.product.id, item.quantity, colorVariant);
    }

    console.log('Order created successfully:', data);
    return { success: true, order: data[0] };
  } catch (error) {
    console.error('Unexpected error creating order:', error);
    return { success: false, error };
  }
}
