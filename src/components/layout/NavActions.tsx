
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, LogIn, Heart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchIcon } from "./SearchIcon";

interface NavActionsProps {
  onToggleMenu: () => void;
}

export const NavActions: React.FC<NavActionsProps> = ({ onToggleMenu }) => {
  let cartCount = 0;
  let wishlistCount = 0;
  let user = null;
  
  // Безопасно получаем данные из контекстов, если они доступны
  // Это не работа с контекстами напрямую, а работа с глобальными переменными
  try {
    if (window.cart && Array.isArray(window.cart.items)) {
      cartCount = window.cart.items.reduce((acc, item) => acc + (item.quantity || 0), 0);
    }
    
    if (window.wishlist && Array.isArray(window.wishlist)) {
      wishlistCount = window.wishlist.length;
    }
    
    if (window.auth && window.auth.user) {
      user = window.auth.user;
    }
  } catch (error) {
    console.error("Error accessing context data:", error);
  }
  
  return (
    <div className="flex items-center gap-4">
      <SearchIcon />
      
      <Link to="/wishlist" className="relative">
        <Heart className="h-5 w-5" />
        {wishlistCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
            {wishlistCount}
          </Badge>
        )}
      </Link>
      
      <Link to="/cart" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {cartCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
            {cartCount}
          </Badge>
        )}
      </Link>
      
      <div className="hidden md:block">
        {user ? (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="flex items-center gap-2"
          >
            <Link to="/account">
              <User className="h-4 w-4" />
              <span className="hidden md:inline-block">Мой аккаунт</span>
            </Link>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="flex items-center gap-2"
          >
            <Link to="/login">
              <LogIn className="h-4 w-4" />
              <span className="hidden md:inline-block">Войти</span>
            </Link>
          </Button>
        )}
      </div>
      
      <Button
        variant="outline"
        size="icon"
        className="md:hidden"
        onClick={onToggleMenu}
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Меню</span>
      </Button>
    </div>
  );
};
