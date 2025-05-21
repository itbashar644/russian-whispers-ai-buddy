
import { CartItem, DeliveryMethod } from "@/types/product";

export function useCartCalculations(items: CartItem[], deliveryMethod: DeliveryMethod | null) {
  // Calculate total number of items
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  // Calculate subtotal
  const subtotal = items.reduce((total, item) => {
    // Get the price based on the selected color variant
    let price = item.product.discountPrice || item.product.price;
    
    if (item.color && item.product.colorVariants) {
      const variant = item.product.colorVariants.find(v => v.color === item.color);
      if (variant) {
        price = variant.discountPrice || variant.price;
      }
    }
    
    // Ensure price is a number
    const numericPrice = typeof price === 'number' ? price : 0;
    
    return total + (numericPrice * item.quantity);
  }, 0);

  // Calculate total with delivery
  const deliveryPrice = deliveryMethod?.price || 0;
  const total = subtotal + deliveryPrice;

  return {
    totalItems,
    subtotal,
    total
  };
}
