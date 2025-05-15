
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem, DeliveryMethod } from "../types/product";
import { deliveryMethods } from "../data/deliveryMethods";
import { useCartActions } from "@/hooks/useCartActions";
import { useCartCalculations } from "@/hooks/useCartCalculations";

interface CartContextType {
  items: CartItem[];
  deliveryMethod: DeliveryMethod | null;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string, color?: string) => void;
  updateQuantity: (itemId: string, quantity: number, color?: string) => void;
  clearCart: () => void;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  totalItems: number;
  subtotal: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod | null>(
    deliveryMethods[0]
  );
  
  const { addItem: addItemToCart, removeItem: removeItemFromCart, updateQuantity: updateItemQuantity, clearCart: clearAllItems } = useCartActions();
  const { totalItems, subtotal, total } = useCartCalculations(items, deliveryMethod);

  // Load cart from localStorage on initial load
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("cart");
      const storedDelivery = localStorage.getItem("deliveryMethod");
      
      if (storedCart) {
        setItems(JSON.parse(storedCart));
      }
      
      if (storedDelivery) {
        setDeliveryMethod(JSON.parse(storedDelivery));
      }
    } catch (e) {
      console.error("Failed to parse cart from localStorage", e);
      // If there's an error parsing, use default empty state
      setItems([]);
      setDeliveryMethod(deliveryMethods[0]);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [items]);

  // Save delivery method to localStorage whenever it changes
  useEffect(() => {
    try {
      if (deliveryMethod) {
        localStorage.setItem("deliveryMethod", JSON.stringify(deliveryMethod));
      }
    } catch (e) {
      console.error("Failed to save delivery method to localStorage", e);
    }
  }, [deliveryMethod]);

  // Wrapped handler functions
  const addItem = (item: CartItem) => {
    addItemToCart(items, item, setItems);
  };

  const removeItem = (itemId: string, color?: string) => {
    removeItemFromCart(itemId, color, setItems);
  };

  const updateQuantity = (itemId: string, quantity: number, color?: string) => {
    updateItemQuantity(itemId, quantity, color, items, setItems);
  };

  const clearCart = () => {
    clearAllItems(setItems);
  };

  const value = {
    items,
    deliveryMethod,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setDeliveryMethod,
    totalItems,
    subtotal,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
