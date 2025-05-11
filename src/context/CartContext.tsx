import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem, DeliveryMethod } from "../types/product";
import { deliveryMethods } from "../data/deliveryMethods";
import { toast } from "@/components/ui/sonner";

interface CartContextType {
  items: CartItem[];
  deliveryMethod: DeliveryMethod | null;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
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

  // Load cart from localStorage on initial load
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    const storedDelivery = localStorage.getItem("deliveryMethod");
    
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage");
      }
    }
    
    if (storedDelivery) {
      try {
        setDeliveryMethod(JSON.parse(storedDelivery));
      } catch (e) {
        console.error("Failed to parse delivery method from localStorage");
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // Save delivery method to localStorage whenever it changes
  useEffect(() => {
    if (deliveryMethod) {
      localStorage.setItem("deliveryMethod", JSON.stringify(deliveryMethod));
    }
  }, [deliveryMethod]);

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (i) => 
          i.product.id === item.product.id && 
          i.color === item.color && 
          i.size === item.size
      );

      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + item.quantity,
        };
        return newItems;
      } else {
        // Item doesn't exist, add it
        return [...prevItems, item];
      }
    });
    
    toast.success("Товар добавлен в корзину");
  };

  const removeItem = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== itemId));
    toast.info("Товар удален из корзины");
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.info("Корзина очищена");
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const subtotal = items.reduce(
    (total, item) => 
      total + (item.product.discountPrice || item.product.price) * item.quantity, 
    0
  );

  const total = subtotal + (deliveryMethod?.price || 0);

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
