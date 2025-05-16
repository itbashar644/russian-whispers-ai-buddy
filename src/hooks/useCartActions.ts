
import { useState } from "react";
import { CartItem } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { checkProductStock } from "@/data/products";

export function useCartActions() {
  const { toast } = useToast();

  // Function to find an existing item with the same product ID and variant
  const findExistingItemIndex = (items: CartItem[], newItem: CartItem): number => {
    return items.findIndex(
      (i) => 
        i.product.id === newItem.product.id && 
        i.color === newItem.color && 
        i.size === newItem.size
    );
  };

  const addItem = (items: CartItem[], item: CartItem, setItems: React.Dispatch<React.SetStateAction<CartItem[]>>) => {
    setItems((prevItems) => {
      const existingItemIndex = findExistingItemIndex(prevItems, item);

      // Check if there's enough stock for the requested quantity
      const totalRequestedQuantity = existingItemIndex >= 0 
        ? prevItems[existingItemIndex].quantity + item.quantity 
        : item.quantity;
      
      // Convert product.id to string to match the expected type for checkProductStock
      if (!checkProductStock(String(item.product.id), totalRequestedQuantity)) {
        toast({
          title: "Ошибка",
          description: "Недостаточно товара на складе",
          variant: "destructive"
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
      description: `${item.product.title} - ${item.color || ""}`
    });
  };

  const removeItem = (itemId: string, color: string | undefined, setItems: React.Dispatch<React.SetStateAction<CartItem[]>>) => {
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
      title: "Товар удален из корзины"
    });
  };

  const updateQuantity = (
    itemId: string, 
    quantity: number, 
    color: string | undefined,
    items: CartItem[],
    setItems: React.Dispatch<React.SetStateAction<CartItem[]>>
  ) => {
    if (quantity <= 0) {
      removeItem(itemId, color, setItems);
      return;
    }

    setItems((prevItems) => {
      const itemIndex = color 
        ? prevItems.findIndex(item => item.product.id === itemId && item.color === color)
        : prevItems.findIndex(item => item.product.id === itemId);

      if (itemIndex === -1) return prevItems;
      
      const item = prevItems[itemIndex];
      
      // Check if there's enough stock for the requested quantity
      // Convert product.id to string to match the expected type for checkProductStock
      if (!checkProductStock(String(itemId), quantity)) {
        toast({
          title: "Ошибка",
          description: "Недостаточно товара на складе",
          variant: "destructive"
        });
        return prevItems; // Don't update if not enough stock
      }
      
      const newItems = [...prevItems];
      newItems[itemIndex] = { ...item, quantity };
      return newItems;
    });
  };

  const clearCart = (setItems: React.Dispatch<React.SetStateAction<CartItem[]>>) => {
    setItems([]);
    toast({
      title: "Корзина очищена"
    });
  };

  return {
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  };
}
