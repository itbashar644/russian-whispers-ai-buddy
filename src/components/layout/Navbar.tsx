
import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  User,
  LogIn,
  Heart,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { items } = useCart(); // Changed from cart to items which matches the CartContextType
  const { wishlist } = useWishlist();
  const { user } = useAuth();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Don't show the navbar on admin pages
  if (isAdminRoute) return null;

  const totalItems = items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const handleScroll = () => {
    if (window.scrollY > 10) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-colors ${
        scrolled
          ? "border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80"
          : "bg-white dark:bg-gray-950 border-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
          <Link to="/" className="flex items-center gap-2">
            <img src="/lovable-uploads/c08f9eab-dd00-4949-baa0-82ab4bad889b.png" alt="Logo" className="h-8 w-auto" />
          </Link>
          <nav className="hidden md:flex gap-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-primary font-medium" : "text-muted-foreground"
              }
            >
              Главная
            </NavLink>
            <NavLink
              to="/catalog"
              className={({ isActive }) =>
                isActive ? "text-primary font-medium" : "text-muted-foreground"
              }
            >
              Каталог
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "text-primary font-medium" : "text-muted-foreground"
              }
            >
              О нас
            </NavLink>
            <NavLink
              to="/contacts"
              className={({ isActive }) =>
                isActive ? "text-primary font-medium" : "text-muted-foreground"
              }
            >
              Контакты
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-4">
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
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-white dark:bg-gray-950 p-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Button
              variant="ghost"
              className="absolute top-4 right-4"
              onClick={closeMenu}
              size="icon"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
            <nav className="flex flex-col gap-4">
              <Link
                to="/"
                onClick={closeMenu}
                className="text-lg font-medium"
              >
                Главная
              </Link>
              <Link
                to="/catalog"
                onClick={closeMenu}
                className="text-lg font-medium"
              >
                Каталог
              </Link>
              <Link
                to="/about"
                onClick={closeMenu}
                className="text-lg font-medium"
              >
                О нас
              </Link>
              <Link
                to="/contacts"
                onClick={closeMenu}
                className="text-lg font-medium"
              >
                Контакты
              </Link>
              <Link
                to="/wishlist"
                onClick={closeMenu}
                className="text-lg font-medium flex items-center gap-2"
              >
                <Heart className="h-5 w-5" />
                Избранное
                {wishlist.length > 0 && (
                  <Badge>{wishlist.length}</Badge>
                )}
              </Link>
              {user ? (
                <Link
                  to="/account"
                  onClick={closeMenu}
                  className="text-lg font-medium flex items-center gap-2"
                >
                  <User className="h-5 w-5" />
                  Мой аккаунт
                </Link>
              ) : (
                <Link
                  to="/auth/login"
                  onClick={closeMenu}
                  className="text-lg font-medium flex items-center gap-2"
                >
                  <LogIn className="h-5 w-5" />
                  Войти
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
