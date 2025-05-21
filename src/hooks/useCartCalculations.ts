
import { CartItem, DeliveryMethod } from "@/types/product";

export function useCartCalculations(items: CartItem[], deliveryMethod: DeliveryMethod | null) {
  // Calculate total number of items
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  // Calculate subtotal
  const subtotal = items.reduce((total, item) => {
    // Get the price based on the selected color variant
    const price = getItemPrice(item);
    return total + (price * item.quantity);
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

// Helper function to get the correct price for an item
function getItemPrice(item: CartItem): number {
  if (item.selectedColorVariant) {
    return item.selectedColorVariant.discountPrice || 
           item.selectedColorVariant.price;
  }
  
  if (item.color && item.product.colorVariants) {
    const variant = item.product.colorVariants.find(v => v.color === item.color);
    if (variant) {
      return variant.discountPrice || variant.price;
    }
  }
  
  return item.product.discountPrice || 
         item.product.price || 
         0; // Fallback to 0 if no price is found
}
