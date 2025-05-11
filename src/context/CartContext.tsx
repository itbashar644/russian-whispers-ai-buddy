
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem, DeliveryMethod } from "../types/product";
import { deliveryMethods } from "../data/deliveryMethods";
import { toast } from "@/components/ui/sonner";
import { getProductById } from "@/data/products";

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
  validateStock: () => boolean;
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

  // Проверяем наличие и достаточное количество товара
  const checkProductAvailability = (productId: string, requestedQuantity: number): boolean => {
    const currentProduct = getProductById(productId);
    
    if (!currentProduct) {
      return false; // Товар не найден
    }
    
    if (!currentProduct.inStock) {
      return false; // Товар не в наличии
    }
    
    // Проверяем количество, если оно указано
    if (currentProduct.stockQuantity !== undefined) {
      return currentProduct.stockQuantity >= requestedQuantity;
    }
    
    // Если количество не указано, но товар в наличии, считаем что его достаточно
    return true;
  };

  // Проверка всей корзины
  const validateStock = (): boolean => {
    for (const item of items) {
      const isAvailable = checkProductAvailability(item.product.id, item.quantity);
      if (!isAvailable) {
        // Получаем актуальные данные о товаре
        const currentProduct = getProductById(item.product.id);
        if (!currentProduct) {
          toast.error(`Товар "${item.product.title}" больше не доступен и будет удален из корзины.`);
          removeItem(item.product.id);
          return false;
        } else if (!currentProduct.inStock) {
          toast.error(`Товар "${item.product.title}" закончился и будет удален из корзины.`);
          removeItem(item.product.id);
          return false;
        } else if (currentProduct.stockQuantity !== undefined && currentProduct.stockQuantity < item.quantity) {
          toast.error(`Для товара "${item.product.title}" доступно только ${currentProduct.stockQuantity} шт.`);
          updateQuantity(item.product.id, currentProduct.stockQuantity);
          return false;
        }
      }
    }
    return true;
  };

  const addItem = (item: CartItem) => {
    // Проверяем наличие товара перед добавлением
    const isAvailable = checkProductAvailability(item.product.id, item.quantity);
    
    if (!isAvailable) {
      // Получаем актуальные данные о товаре для точного сообщения
      const currentProduct = getProductById(item.product.id);
      
      if (!currentProduct || !currentProduct.inStock) {
        toast.error("Товар не в наличии.");
        return;
      } else if (currentProduct.stockQuantity !== undefined && currentProduct.stockQuantity < item.quantity) {
        toast.error(`Доступно только ${currentProduct.stockQuantity} шт.`);
        // Добавляем в корзину максимально доступное количество
        item.quantity = currentProduct.stockQuantity;
      }
    }

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
        
        // Проверяем, не превышает ли общее количество доступное на складе
        const currentProduct = getProductById(item.product.id);
        const newQuantity = newItems[existingItemIndex].quantity + item.quantity;
        
        if (currentProduct && currentProduct.stockQuantity !== undefined && newQuantity > currentProduct.stockQuantity) {
          toast.warning(`В корзину добавлено максимально доступное количество: ${currentProduct.stockQuantity} шт.`);
          newItems[existingItemIndex].quantity = currentProduct.stockQuantity;
        } else {
          newItems[existingItemIndex].quantity = newQuantity;
        }
        
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
    
    // Проверяем доступное количество перед обновлением
    const currentProduct = getProductById(itemId);
    
    if (currentProduct && currentProduct.stockQuantity !== undefined && quantity > currentProduct.stockQuantity) {
      toast.warning(`Доступно только ${currentProduct.stockQuantity} шт.`);
      quantity = currentProduct.stockQuantity;
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
    validateStock,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
