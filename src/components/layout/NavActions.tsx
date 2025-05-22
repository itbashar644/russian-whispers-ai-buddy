
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext"; // Changed from @/hooks/useAuthCore
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Menu, Heart, ShoppingCart, User } from "lucide-react";
import { SearchIcon } from "./SearchIcon";
import { Button } from "@/components/ui/button";

interface NavActionsProps {
  onToggleMenu: () => void;
  onOpenSearch: () => void;
}

export const NavActions: React.FC<NavActionsProps> = ({
  onToggleMenu,
  onOpenSearch,
}) => {
  const { user } = useAuth();
  const { items } = useCart();
  const { wishlist } = useWishlist(); // Changed from items to wishlist

  const cartCount = items.length;
  const wishlistCount = wishlist.length; // Changed from wishlistItems to wishlist

  return (
    <div className="flex items-center gap-1 md:gap-2">
      <SearchIcon onClick={onOpenSearch} />
      
      <Link
        to="/wishlist"
        className="relative flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent"
      >
        <Heart className="h-5 w-5" />
        {wishlistCount > 0 && (
          <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-white">
            {wishlistCount}
          </span>
        )}
      </Link>
      
      <Link
        to="/cart"
        className="relative flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent"
      >
        <ShoppingCart className="h-5 w-5" />
        {cartCount > 0 && (
          <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-white">
            {cartCount}
          </span>
        )}
      </Link>
      
      <Link
        to={user ? "/account" : "/login"}
        className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent"
      >
        <User className="h-5 w-5" />
      </Link>
      
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onToggleMenu}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>
    </div>
  );
};
