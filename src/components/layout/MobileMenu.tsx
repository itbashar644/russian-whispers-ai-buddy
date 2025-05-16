
import React from "react";
import { Link } from "react-router-dom";
import { X, Heart, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  let user = null;
  let wishlistItems = [];
  
  try {
    const auth = useAuth();
    const { wishlist } = useWishlist();
    
    user = auth?.user;
    wishlistItems = wishlist || [];
  } catch (error) {
    console.error("Error in MobileMenu: Context not available", error);
  }
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 top-16 z-50 bg-white dark:bg-gray-950 p-4 md:hidden">
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          className="absolute top-4 right-4"
          onClick={onClose}
          size="icon"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>
        <nav className="flex flex-col gap-4">
          <Link
            to="/"
            onClick={onClose}
            className="text-lg font-medium"
          >
            Главная
          </Link>
          <Link
            to="/catalog"
            onClick={onClose}
            className="text-lg font-medium"
          >
            Каталог
          </Link>
          <Link
            to="/about"
            onClick={onClose}
            className="text-lg font-medium"
          >
            О нас
          </Link>
          <Link
            to="/contacts"
            onClick={onClose}
            className="text-lg font-medium"
          >
            Контакты
          </Link>
          <Link
            to="/wishlist"
            onClick={onClose}
            className="text-lg font-medium flex items-center gap-2"
          >
            <Heart className="h-5 w-5" />
            Избранное
            {wishlistItems.length > 0 && (
              <Badge>{wishlistItems.length}</Badge>
            )}
          </Link>
          {user ? (
            <Link
              to="/account"
              onClick={onClose}
              className="text-lg font-medium flex items-center gap-2"
            >
              <User className="h-5 w-5" />
              Мой аккаунт
            </Link>
          ) : (
            <Link
              to="/auth/login"
              onClick={onClose}
              className="text-lg font-medium flex items-center gap-2"
            >
              <LogIn className="h-5 w-5" />
              Войти
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
};
