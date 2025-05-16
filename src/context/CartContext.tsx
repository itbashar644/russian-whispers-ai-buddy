
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
  totalItems: number;
  decreaseStockForItems: (items: CartItem[]) => Promise<boolean>;
}

// Create the context with a default value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create the provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for cart items
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      // Try to load items from localStorage
      const savedItems = localStorage.getItem("cart");
      return savedItems ? JSON.parse(savedItems) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
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
      localStorage.setItem("cart", JSON.stringify(items));
      
      // Сохраняем корзину в глобальной переменной
      window.cart = {
        items,
        totalItems,
        subtotal,
        total
      };
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [items, subtotal, total, totalItems]);

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

  const contextValue = {
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
  };
  
  // Сохраняем методы контекста в глобальной переменной
  window.cart = {
    ...contextValue
  };

  return (
    <CartContext.Provider value={contextValue}>
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
