
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
  // Check if there's a selected color variant with price
  if (item.selectedColorVariant) {
    const price = item.selectedColorVariant.discountPrice || item.selectedColorVariant.price || 0;
    return typeof price === 'number' ? price : 0;
  }
  
  // Check if there's a color and color variants
  if (item.color && item.product.colorVariants) {
    const variant = item.product.colorVariants.find(v => v.color === item.color);
    if (variant) {
      const price = variant.discountPrice || variant.price || 0;
      return typeof price === 'number' ? price : 0;
    }
  }
  
  // Fallback to product prices
  const productPrice = item.product.discountPrice || item.product.price || 0;
  return typeof productPrice === 'number' ? productPrice : 0;
}
