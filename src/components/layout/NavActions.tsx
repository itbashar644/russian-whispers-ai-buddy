
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, LogIn, Heart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { SearchIcon } from "./SearchIcon";

interface NavActionsProps {
  onToggleMenu: () => void;
}

export const NavActions: React.FC<NavActionsProps> = ({ onToggleMenu }) => {
  const { items } = useCart();
  const { wishlist } = useWishlist();
  const { user } = useAuth();
  
  const totalItems = items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  
  return (
    <div className="flex items-center gap-4">
      <SearchIcon />
      
      <Link to="/wishlist" className="relative">
        <Heart className="h-5 w-5" />
        {wishlist.length > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
            {wishlist.length}
          </Badge>
        )}
      </Link>
      
      <Link to="/cart" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
            {totalItems}
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
            <Link to="/auth/login">
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
        <span className="sr-only">Toggle menu</span>
      </Button>
    </div>
  );
};
