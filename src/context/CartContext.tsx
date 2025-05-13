import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem, DeliveryMethod, Product, ColorVariant } from "../types/product";
import { deliveryMethods } from "../data/deliveryMethods";
import { toast } from "@/components/ui/use-toast";
import { checkProductStock, decreaseProductStock } from "@/data/products";

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

  // Function to find an existing item with the same product ID and variant
  const findExistingItemIndex = (newItem: CartItem): number => {
    return items.findIndex(
      (i) => 
        i.product.id === newItem.product.id && 
        i.color === newItem.color && 
        i.size === newItem.size
    );
  };

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItemIndex = findExistingItemIndex(item);

      // Check if there's enough stock for the requested quantity
      const totalRequestedQuantity = existingItemIndex >= 0 
        ? prevItems[existingItemIndex].quantity + item.quantity 
        : item.quantity;
      
      if (!checkProductStock(item.product.id, totalRequestedQuantity, item.color)) {
        toast({
          title: "Ошибка",
          description: "Недостаточно товара на складе",
          variant: "destructive",
        });
        return prevItems; // Don't update cart if not enough stock
      }

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
    
    toast({
      title: "Товар добавлен в корзину",
      description: `${item.product.title} - ${item.color || ""}`,
    });
  };

  const removeItem = (itemId: string, color?: string) => {
    setItems((prevItems) => {
      if (color) {
        // If color is specified, only remove items with that color
        return prevItems.filter(
          (item) => !(item.product.id === itemId && item.color === color)
        );
      } else {
        // Otherwise remove all items with the product ID
        return prevItems.filter((item) => item.product.id !== itemId);
      }
    });
    toast({
      title: "Товар удален из корзины",
    });
  };

  const updateQuantity = (itemId: string, quantity: number, color?: string) => {
    if (quantity <= 0) {
      removeItem(itemId, color);
      return;
    }

    setItems((prevItems) => {
      const itemIndex = color 
        ? prevItems.findIndex(item => item.product.id === itemId && item.color === color)
        : prevItems.findIndex(item => item.product.id === itemId);

      if (itemIndex === -1) return prevItems;
      
      const item = prevItems[itemIndex];
      
      // Check if there's enough stock for the requested quantity
      if (!checkProductStock(itemId, quantity, item.color)) {
        toast({
          title: "Ошибка",
          description: "Недостаточно товара на складе",
          variant: "destructive",
        });
        return prevItems; // Don't update if not enough stock
      }
      
      const newItems = [...prevItems];
      newItems[itemIndex] = { ...item, quantity };
      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Корзина очищена",
    });
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const subtotal = items.reduce((total, item) => {
    // Get the price based on the selected color variant
    let price = item.product.discountPrice || item.product.price;
    
    if (item.color && item.product.colorVariants) {
      const variant = item.product.colorVariants.find(v => v.color === item.color);
      if (variant) {
        price = variant.discountPrice || variant.price;
      }
    }
    
    return total + (price * item.quantity);
  }, 0);

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
