
import React, { createContext, useState, useContext, useEffect } from "react";
import { CartItem, DeliveryMethod } from "@/types/product";
import { useCartCalculations } from "@/hooks/useCartCalculations";
import { useCartActions } from "@/hooks/useCartActions";

// Define the CartContext shape
interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (itemId: string, color?: string) => void;
  updateQuantity: (itemId: string, quantity: number, color?: string) => Promise<void>;
  clearCart: () => void;
  deliveryMethod: DeliveryMethod | null;
  setDeliveryMethod: React.Dispatch<React.SetStateAction<DeliveryMethod | null>>;
  subtotal: number;
  total: number;
  totalItems: number;  // Added this property
  decreaseStockForItems: (items: CartItem[]) => Promise<boolean>;
}

// Create the context with a default value and export it
export const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper function to validate cart items
const validateCartItems = (items: any[]): CartItem[] => {
  if (!Array.isArray(items)) {
    console.warn("Cart items is not an array, returning empty array");
    return [];
  }

  return items.filter(item => {
    // Check if item has required structure
    if (!item || typeof item !== 'object') {
      console.warn("Invalid cart item (not an object):", item);
      return false;
    }

    if (!item.product || typeof item.product !== 'object') {
      console.warn("Invalid cart item (missing or invalid product):", item);
      return false;
    }

    if (!item.product.id || !item.product.title) {
      console.warn("Invalid cart item (missing product id or title):", item);
      return false;
    }

    if (typeof item.quantity !== 'number' || item.quantity <= 0) {
      console.warn("Invalid cart item (invalid quantity):", item);
      return false;
    }

    return true;
  });
};

// Create the provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for cart items
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      // Try to load items from localStorage
      const savedItems = localStorage.getItem("cart");
      if (!savedItems) {
        return [];
      }

      const parsedItems = JSON.parse(savedItems);
      const validatedItems = validateCartItems(parsedItems);
      
      // If we filtered out invalid items, save the cleaned version
      if (validatedItems.length !== parsedItems.length) {
        console.log("Cleaned up invalid cart items");
        localStorage.setItem("cart", JSON.stringify(validatedItems));
      }

      return validatedItems;
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      // Clear corrupted cart data
      localStorage.removeItem("cart");
      return [];
    }
  });

  // State for selected delivery method
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod | null>(null);

  // Get price calculations
  const { subtotal, total, totalItems } = useCartCalculations(items, deliveryMethod);

  // Get cart actions
  const { addItem: addItemAction, 
          removeItem: removeItemAction, 
          updateQuantity: updateQuantityAction, 
          clearCart: clearCartAction,
          decreaseStockForItems: decreaseStockForItemsAction } = useCartActions();

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      // Validate items before saving
      const validItems = validateCartItems(items);
      localStorage.setItem("cart", JSON.stringify(validItems));
      
      // Update state if validation filtered out items
      if (validItems.length !== items.length) {
        setItems(validItems);
      }
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [items]);

  // Handler for adding an item to the cart
  const addItem = async (item: CartItem) => {
    await addItemAction(items, item, setItems);
  };

  // Handler for removing an item from the cart
  const removeItem = (itemId: string, color?: string) => {
    removeItemAction(itemId, color, setItems);
  };

  // Handler for updating item quantity
  const updateQuantity = async (itemId: string, quantity: number, color?: string) => {
    await updateQuantityAction(itemId, quantity, color, items, setItems);
  };

  // Handler for clearing the cart
  const clearCart = () => {
    clearCartAction(setItems);
  };
  
  // Handler for decreasing stock for all items in cart
  const decreaseStockForItems = async (cartItems: CartItem[]): Promise<boolean> => {
    return await decreaseStockForItemsAction(cartItems);
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      deliveryMethod,
      setDeliveryMethod,
      subtotal,
      total,
      totalItems,
      decreaseStockForItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Create and export the hook for using the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
