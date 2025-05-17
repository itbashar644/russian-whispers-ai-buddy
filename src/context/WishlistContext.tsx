
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Product } from '@/types/product';
import { toast } from 'sonner';

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlistItem: (productOrId: Product | string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: React.ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });
  
  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);
  
  const addToWishlist = (product: Product) => {
    if (!isInWishlist(product.id)) {
      setWishlist([...wishlist, product]);
      toast.success('Товар добавлен в избранное');
    }
  };
  
  const removeFromWishlist = (productId: string) => {
    const updatedWishlist = wishlist.filter(item => item.id !== productId);
    setWishlist(updatedWishlist);
    toast('Товар удален из избранного');
  };
  
  const toggleWishlistItem = (productOrId: Product | string) => {
    // Check if we received a product object or just an ID
    if (typeof productOrId === 'string') {
      const productId = productOrId;
      if (isInWishlist(productId)) {
        removeFromWishlist(productId);
      } else {
        // If we only have an ID, we can't add it to wishlist since we need the full product
        console.error('Cannot add to wishlist with just an ID. Need full product object.');
      }
    } else {
      // We have a full product object
      if (isInWishlist(productOrId.id)) {
        removeFromWishlist(productOrId.id);
      } else {
        addToWishlist(productOrId);
      }
    }
  };
  
  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };
  
  const clearWishlist = () => {
    setWishlist([]);
    toast('Список избранного очищен');
  };
  
  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlistItem,
      isInWishlist,
      clearWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
