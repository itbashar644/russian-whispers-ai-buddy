
import { Link } from "react-router-dom";
import { ShoppingCart, Search, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold">Sport Nutrition</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" className="font-medium transition-colors hover:text-primary">
            Главная
          </Link>
          <Link to="/catalog" className="font-medium transition-colors hover:text-primary">
            Каталог
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="font-medium transition-colors hover:text-primary">
                Категории
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48">
              <DropdownMenuItem>
                <Link to="/catalog?category=protein" className="w-full">Протеин</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/catalog?category=creatine" className="w-full">Креатин</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/catalog?category=bcaa" className="w-full">БЦАА</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/catalog?category=vitamins" className="w-full">Витамины</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Link to="/account">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
