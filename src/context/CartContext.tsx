
import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Product } from "@/types/product";
import { getFromStorage, saveToStorage } from "@/data/products/utils";
import { toast } from "sonner";

interface CartContextProps {
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextProps>({
  cartItems: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Load cart from localStorage
  useEffect(() => {
    const savedCart = getFromStorage<CartItem[]>("cart", []);
    setCartItems(savedCart);
  }, []);
  
  // Save cart to localStorage when it changes
  useEffect(() => {
    saveToStorage("cart", cartItems);
  }, [cartItems]);
  
  const addItem = (newItem: CartItem) => {
    // Check stock before adding
    if (newItem.product.stockQuantity !== undefined && 
        newItem.quantity > newItem.product.stockQuantity) {
      toast.error("Недостаточно товара на складе", {
        description: `Доступно: ${newItem.product.stockQuantity} шт.`
      });
      return;
    }

    setCartItems(prevItems => {
      // Check if item already in cart (same product and color)
      const existingItemIndex = prevItems.findIndex(
        item => 
          item.product.id === newItem.product.id && 
          item.color === newItem.color
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...prevItems];
        const newQuantity = updatedItems[existingItemIndex].quantity + newItem.quantity;
        
        // Check if updated quantity exceeds available stock
        if (newItem.product.stockQuantity !== undefined && 
            newQuantity > newItem.product.stockQuantity) {
          toast.error("Недостаточно товара на складе", {
            description: `Доступно: ${newItem.product.stockQuantity} шт.`
          });
          return prevItems;
        }
        
        updatedItems[existingItemIndex].quantity = newQuantity;
        
        toast.success("Товар добавлен в корзину", {
          description: `${newItem.product.title} (${newQuantity} шт.)`
        });
        
        return updatedItems;
      } else {
        // Add new item
        toast.success("Товар добавлен в корзину", {
          description: `${newItem.product.title} (${newItem.quantity} шт.)`
        });
        
        return [...prevItems, newItem];
      }
    });
  };
  
  const removeItem = (productId: string, color?: string) => {
    setCartItems(prevItems => 
      prevItems.filter(item => 
        !(item.product.id === productId && item.color === color)
      )
    );
  };
  
  const updateQuantity = (productId: string, quantity: number, color?: string) => {
    setCartItems(prevItems => {
      const updatedItems = [...prevItems];
      const itemIndex = updatedItems.findIndex(
        item => item.product.id === productId && item.color === color
      );
      
      if (itemIndex >= 0) {
        // Check if updated quantity exceeds available stock
        const product = updatedItems[itemIndex].product;
        if (product.stockQuantity !== undefined && 
            quantity > product.stockQuantity) {
          toast.error("Недостаточно товара на складе", {
            description: `Доступно: ${product.stockQuantity} шт.`
          });
          return prevItems;
        }
        
        updatedItems[itemIndex].quantity = quantity;
      }
      
      return updatedItems;
    });
  };
  
  const clearCart = () => {
    setCartItems([]);
  };
  
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalPrice = cartItems.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
